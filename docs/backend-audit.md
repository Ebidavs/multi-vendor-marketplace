# Backend Audit

This document describes the current state of the multi-vendor marketplace backend
(`backend/`). It documents how the backend is structured and how it behaves today.
It does not describe review history.

---

## 1. Project Overview

The backend is a Node.js / Express REST API for a multi-vendor marketplace. It is
written in JavaScript using CommonJS modules and persists data in MongoDB through
Mongoose.

Key characteristics:

- **Runtime:** Node.js (developed and verified on Node v24).
- **Framework:** Express 5.
- **Database:** MongoDB (Atlas) accessed through Mongoose 9.
- **Auth:** JSON Web Tokens (JWT) with role-based authorization.
- **Images:** Cloudinary (streamed uploads, no local disk storage).
- **Email:** Nodemailer over SMTP, used to deliver OTP codes for password reset and
  account reactivation.
- **Validation:** a mix of Zod schemas (auth/user/OTP routes) and express-validator
  (product, shop, cart, order, address, review, admin routes).
- **Entry point:** `backend/src/app.js`, started with `npm start` (`node src/app.js`)
  or `npm run dev` (nodemon).

The API is namespaced under `/api/v1`. All responses follow a consistent envelope:
success responses use `{ success, message, data }` and error responses use
`{ success: false, message, data: null }`.

## 2. Backend Structure

```
backend/
├── package.json            # scripts: start, dev, test
├── .env.example            # documented environment variable names
├── src/
│   ├── app.js              # express app, route mounting, DB connect, listen
│   ├── config/
│   │   ├── db.js           # mongoose connection helper
│   │   ├── cloudinary.js   # cloudinary v2 client configuration
│   │   └── mailerConfig.js # nodemailer transporter + sendEmail()
│   ├── controllers/        # request handlers grouped by domain
│   ├── middlewares/
│   │   ├── auth.js         # protect + restrictTo (JWT + roles)
│   │   ├── errorHandler.js # central error -> JSON envelope
│   │   ├── upload.js       # multer memory storage + image filter
│   │   ├── userValidator.js# Zod-based request validation
│   │   └── validate.js     # express-validator result -> AppError
│   ├── models/             # mongoose schemas
│   ├── routes/             # express routers, one per domain
│   ├── utils/              # formatters, lifecycle helper, pagination, seeds
│   ├── zodSchemas/         # zod request schemas
│   └── scripts/            # seedCategories.js
└── tests/                  # node:test unit + integration tests
```

Responsibilities:

- **config/** — external service clients and the database connection. Each config
  module reads its values from environment variables.
- **controllers/** — business logic. Controllers own validation of domain state,
  authorization checks, and shaping of responses.
- **middlewares/** — cross-cutting concerns: authentication, authorization,
  request validation, file upload handling, and error formatting.
- **models/** — Mongoose schemas and their relationships. The User model uses
  discriminators to represent customer, vendor, and admin roles.
- **routes/** — HTTP surface. Each router applies `protect`/`restrictTo`, validation
  rules, and maps to controller functions.
- **utils/** — reusable helpers: response shaping (`response.js`), domain errors
  (`appError.js`), per-entity formatters, account lifecycle cascading
  (`accountLifecycle.js`), pagination, model compatibility shim
  (`modelCompat.js`), and seed scripts.

## 3. Authentication

Authentication is JWT-based.

- **Registration** (`POST /api/v1/auth/register`) validates the payload against a Zod
  discriminated union on `role` (`customer` or `vendor`), normalizes the email,
  rejects duplicate email/phone, hashes the password with bcryptjs (cost 10), and
  creates the appropriate User discriminator.
- **Login** (`POST /api/v1/auth/login`) looks up the user with `+password`, compares
  the password with bcrypt, rejects deleted accounts (`deletedAt` set) and deactivated
  accounts (`isActive === false`), then signs a JWT.
- **JWT** payload is `{ id, role }`; the secret is `JWT_SECRET` and the lifetime is
  `EXPIRES_IN`. Expiry is not hardcoded.
- **Login response** follows the agreed shape:
  `{ success: true, message: 'Login successful', data: { token, user } }`.
- **Protected routes** use the `protect` middleware, which verifies the bearer token,
  reloads the user, and rejects the request when the user is missing, soft-deleted
  (`401`), or inactive (`401`).
- **Role authorization** uses `restrictTo(...roles)`, returning `403` when the caller's
  role is not permitted.
- **Passwords** are stored hashed (bcryptjs, cost 10) and the `password` field is
  `select: false`, so it is excluded from queries unless explicitly requested.

### Password reset and account reactivation (OTP)

Both flows are OTP-based and share one implementation:

- A 6-digit code is generated with `crypto.randomInt`, hashed with bcrypt, and stored
  in the `Otp` collection with a `purpose` (`password-reset` or `account-reactivation`)
  and an `expiresAt` timestamp (10 minutes).
- Requesting an OTP does not reveal whether the email exists: both eligible and
  ineligible requests return `200` with the message
  `"If eligible, an OTP has been sent"`.
- Verification compares the submitted code against the stored hash and rejects expired
  records (deleting them).
- A successful reset or reactivation deletes the OTP record, making codes single-use.
- Password reset requires the OTP; the new password is validated by a Zod schema
  (minimum length, upper/lower/digit/special character).

## 4. Account Lifecycle

An account has two independent fields that together define its lifecycle state:

| State | `isActive` | `deletedAt` |
| --- | --- | --- |
| Active | `true` | `null` |
| Deactivated | `false` | `null` |
| Deleted | `false` | `<date>` |

Rules that are enforced in the current code:

- **Deleted accounts cannot authenticate** — login returns `401` when `deletedAt` is
  set, and `protect` returns `401` for the same condition.
- **Deactivated accounts cannot authenticate or use protected functionality** — login
  returns `403`; `protect` returns `401`.
- **Deleted accounts cannot be reactivated** — the OTP reactivation flow and the admin
  vendor-status endpoint both reject reactivation when `deletedAt` is set.
- **Historical records are preserved.** Orders and order items are never physically
  deleted by the lifecycle logic, and shipping addresses are stored as an inline
  snapshot on each order.

### Cascading

Cascading is centralized in `src/utils/accountLifecycle.js` (`setRelatedResourcesActive`).
When a user is deactivated or deleted:

- **Addresses** belonging to the user are set `isActive: false` — they are soft-hidden
  rather than deleted, so order snapshots remain intact.
- **Shops** owned by the user are set `isActive: false`.
- **Reviews** written by the user are set `isActive: false`, and the affected products'
  `ratingsAverage`/`ratingsCount` are recalculated from the remaining active reviews.
- **Products** are intentionally **not** toggled. Product visibility is derived at query
  time from the owning vendor's state (see section 5), so a soft-deleted product stays
  soft-deleted and a vendor's products disappear from discovery while the vendor is
  inactive, then reappear when the vendor is reactivated.

Vendor deactivation via the admin endpoint (`updateVendorStatus`) sets the vendor's
`isActive` and cascades the same flag to the vendor's shop.

Deactivation and deletion are rejected for admin accounts (self-service), returning
`403`.

## 5. Products

- **Model:** `name`, `description`, `price`, `stock`, `category` (ref `Category`),
  `vendor` (ref `User`), `images`, `imagePublicIds` (excluded from JSON),
  `ratingsAverage`, `ratingsCount`, `specifications`, `isActive`.
- **Lifecycle:** products are soft-deleted — `deleteProduct` sets `isActive: false`
  instead of removing the document, preserving order-item references.
- **Vendor relationship:** `Product.vendor` references the vendor user. Ownership is
  enforced on update/delete (`product.vendor === req.user.id`).
- **Visibility:** a product is visible only when `isActive: true` **and** its vendor is
  an active, non-deleted vendor. This rule is applied consistently in product listing,
  single-product lookup, related products, reviews, category product counts, and admin
  analytics.
- **Image handling:** multer stores uploads in memory; buffers are streamed to
  Cloudinary. On partial upload failure the already-uploaded images are removed. On a
  successful replacement the previous images are deleted from Cloudinary. `imagePublicIds`
  is `select: false` and stripped from JSON output.
- **Filtering/discovery:** supports category, vendor, price range, minimum rating,
  in-stock, free-text search (regex-escaped), sorting, and pagination (default limit 12,
  maximum 50). When no active vendors exist, an empty result with the requested
  pagination is returned.

## 6. Cart & Orders

### Cart

- One cart per user (`userId` is `unique`). A cart is created on demand.
- Adding an item validates the product is active with an active, non-deleted vendor and
  an active shop, and that stock is sufficient. Quantity must be a positive integer.
- Updating quantity re-validates stock; removing an item filters it out; clearing the
  cart empties `items`.
- Cart items store the price at the time of adding.

### Checkout (`POST /api/v1/orders`)

- Requires a complete shipping address and a valid payment method.
- Runs inside a MongoDB **session/transaction** (`mongoose.startSession()` +
  `session.withTransaction(...)`). All reads and writes use the session.
- For each cart item it re-validates that the product is active, the vendor is active
  and not deleted, and the shop is active, then performs an atomic stock decrement
  (`$inc: { stock: -qty }` guarded by `stock >= qty`).
- Items are grouped by shop, producing **one order per vendor**. Each order stores a
  snapshot of the shipping address and a computed `totalAmount`.
- Each order item stores `quantity` and `priceAtPurchase` (the purchase-price snapshot).
- On success the cart is deleted. Because the work is wrapped in a transaction, a failure
  at any point rolls back the whole checkout (no partial orders, no partial stock
  deductions) — **provided the MongoDB deployment supports transactions (replica set /
  Atlas cluster)**.

### Order lifecycle

- Order status is one of `pending`, `processing`, `shipped`, `delivered`.
- Customers can list their orders and view an order with its items; ownership is
  enforced.
- Vendors can list orders for their shop and update status; ownership is enforced by
  matching the order's shop to the vendor's shop.

## 7. Vendors & Admin

### Vendors / Shops

- A vendor owns at most one shop (`Shop.owner` is `unique`).
- `registerShop` creates the shop; `getShop`/`getShopByVendorId` return a shop only when
  the shop is active **and** its owner is an active, non-deleted vendor.
- `updateMyShop` updates a whitelist of fields; `getMyShopDashboard` returns product
  counts plus placeholders for order/sales figures.
- The `resolveUserModel` shim (`src/utils/modelCompat.js`) allows controllers to work
  with the named-export User model (`userModel.User`) transparently.

### Admin

- Admin routes are guarded by `protect` + `restrictTo('admin')`.
- `createAdmin` creates an admin user (bcrypt-hashed password).
- `getVendors` / `getCustomers` list users with pagination and include shop summaries
  for vendors.
- `updateVendorStatus` toggles a vendor's `isActive`, cascades the flag to the shop, and
  refuses reactivation of permanently deleted vendors (re-reads `deletedAt` defensively).
- `getAnalytics` returns user/vendor/customer/shop counts and an active-listing product
  count; revenue and top-vendor figures are placeholders (`null`) pending order data.

## 8. Database

- **Driver:** Mongoose 9 over the MongoDB Node driver.
- **Connection:** `src/config/db.js` exports `connectDB()`, which calls
  `mongoose.connect(process.env.MONGO_URI)` inside a try/catch. On success it logs
  `MongoDB connected`; on failure it logs the error message and calls `process.exit(1)`.
- **Startup sequence:** `src/app.js` loads environment variables, validates that
  `JWT_SECRET` and `EXPIRES_IN` are present, builds the Express app, mounts routes, and
  finally calls `connectDB().then(() => app.listen(PORT))`. The HTTP server therefore
  starts only after the database connection resolves.
- **URI:** the configured `MONGO_URI` is an Atlas `mongodb+srv://` connection string.
  SRV URIs require a DNS SRV lookup performed by the Node process at connect time.
- **Models and relationships:**
  - `User` (discriminators: `customer`, `vendor`, `admin`; `discriminatorKey: 'role'`).
    Fields: `name`, `email` (unique), `phoneNumber`, `password` (`select: false`),
    `isActive`, `deletedAt`. Vendor adds `businessName`, `businessDescription`,
    `bankDetails`, `isVerified`.
  - `Shop` → `owner` ref `User` (unique).
  - `Product` → `vendor` ref `User`, `category` ref `Category`.
  - `Category` (unique `name`).
  - `Cart` → `userId` ref `User` (unique); `items[].productId` ref `Product`.
  - `Order` → `customerId` ref `User`, `shopId` ref `Shop`; inline `shippingAddress`.
  - `OrderItems` → `orderId` ref `Order`, `productId` ref `Product`, `priceAtPurchase`.
  - `Address` → `user` ref `User`.
  - `Review` → `product` ref `Product`, `user` ref `User` (unique per product+user).
  - `Otp` → `email`, hashed `otp`, `purpose`, `expiresAt`.
- **Indexes:** Product (category, price, ratingsAverage), Address (user), Review
  (product+user unique), Category (name unique), Shop (owner unique), Cart (userId unique).
  User has `email` unique and (via discriminator) `role`.

## 9. Environment Variables

Only the variable **names** are listed. Values are never included.

Required by the application at runtime:

```
PORT
NODE_ENV
MONGO_URI
JWT_SECRET
EXPIRES_IN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
APP_NAME
```

Used by tooling / scripts:

```
TEST_MONGODB_URI     # integration tests (present in .env.example)
SEED_ADMIN_PASSWORD  # utils/seedAdmin.js (present in .env.example, not in local .env)
```

Notes:

- `JWT_SECRET` and `EXPIRES_IN` are validated at startup; a missing value aborts boot.
- SMTP values are optional for startup. The transporter is created at module load, and
  `sendEmail` throws only when `SMTP_USER`/`SMTP_PASS` are missing — so a missing SMTP
  configuration does **not** prevent unrelated server functionality.
- Cloudinary values are read at module load; a missing value would only affect image
  upload/delete operations.

## 10. Testing

- **Framework:** Node's built-in test runner (`node --test`), invoked via
  `npm test` → `node --test tests/*.test.js`. No external test framework.
- **Test files:**
  - `tests/model-compat.test.js` — unit (assert) checks for `resolveUserModel` and
    `normalizeBooleanFlag`.
  - `tests/product-pagination.test.js` — unit tests for pagination helpers.
  - `tests/status-boolean-validation.test.js` — unit test for strict boolean validation.
  - `tests/account-lifecycle.integration.test.js` — MongoDB integration (1 test).
  - `tests/vendor-status.integration.test.js` — MongoDB integration (3 tests).
  - `tests/endpoint-tests.md` — manual endpoint notes (not executable).
- **Result of a run in this environment** (with `TEST_MONGODB_URI` pointing at the local
  MongoDB on `127.0.0.1:27017`):

  | Metric | Count |
  | --- | --- |
  | Passed | 9 |
  | Failed | 0 |
  | Skipped | 0 |

  All nine tests pass, including the four MongoDB integration tests (account-lifecycle
  cascade, admin vendor status, and product visibility).
- **Test guard:** the integration tests are guarded with
  `{ skip: !testMongoUri && 'Set TEST_MONGODB_URI ...' }`. Without `TEST_MONGODB_URI`
  those four tests skip themselves; they are never silently ignored.
- **External requirements:** the integration tests require a reachable MongoDB instance
  via `TEST_MONGODB_URI`. The unit tests require no external services.
- **Not testable in this environment:** checkout uses `startSession()` +
  `withTransaction()`. The local MongoDB is a standalone instance, which does not support
  transactions, so checkout is **NOT TESTABLE** here (see section 11).

## 11. Server Startup

- **Startup command:** `npm start` (`node src/app.js`) or `npm run dev` (nodemon). Both
  use the same entry point.
- **Database used for runtime verification:** the local standalone MongoDB on
  `127.0.0.1:27017`, supplied to the process as an environment variable. `backend/.env`
  still carries the Atlas `mongodb+srv://` `MONGO_URI` and was not modified.
- **Successful startup:** with a reachable MongoDB the process logs `MongoDB connected`
  and then `Server running on port 5000`. The HTTP server starts only after the database
  connection resolves (see section 8).
- **Atlas limitation (environmental, not a code defect):** with the Atlas
  `mongodb+srv://` URI the process exits with code 1 and printed:

  ```
  injected env (13) from .env
  MongoDB connection failed: querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net
  ```

- **Root cause:** the machine's Node process resolves DNS through `127.0.0.1` (a local
  resolver that is not answering SRV queries), so the SRV lookup that the Atlas
  `mongodb+srv://` URI requires is refused. An isolated DNS test confirmed the SRV record
  resolves correctly (3 records) when a public resolver is used, and fails with
  `ECONNREFUSED` on the default resolver.
- **Evidence it is not a code problem:** every backend source file passes
  `node --check` (no syntax errors), and the server starts normally against a non-SRV
  MongoDB URI.
- **Not changed on purpose:** `MONGO_URI` was left as the Atlas connection string. There
  is no code-level DNS override, no hardcoded localhost, and no error suppression in the
  application.
- **Result:** Atlas is **NOT verified** in this environment. Local MongoDB connects and
  the server runs on port 5000.

## 12. Issues Found

Findings are stated as of the current state of the code. Items reported by earlier
audit passes that have since been corrected are listed under "Resolved".

### Critical

1. **Checkout transactions require a replica set / Atlas cluster.** `createOrder` uses
   `startSession()` + `withTransaction()`. On a standalone `mongod`, transactions are
   unsupported and every checkout fails. This is an implicit deployment requirement, and
   checkout is **NOT TESTABLE** in this environment.
2. **Atlas is unreachable from this machine** because the local DNS resolver does not
   answer SRV lookups. This is an environment limitation, not an application defect
   (see section 11).

### Medium

3. **No rate limiting or attempt cap on OTP verification.** A 6-digit code with a
   10-minute window and no lockout is theoretically brute-forceable.

### Informational

4. `getMyShopDashboard` and `getAnalytics` return `null` placeholders for
   order/sales/revenue figures pending order-domain integration.
5. `tests/model-compat.test.js` is a bare-assert script using `console.log` rather than
   the `node:test` harness, though it still runs and passes.
6. `src/scripts/seedCategories.js` hardcodes `dns.setServers(['8.8.8.8','1.1.1.1'])`,
   which suggests the DNS issue was encountered during seeding.
7. The Zod `validator` middleware adds an `errors` array to its validation failure body.
   The envelope keys (`success`, `message`, `data: null`) are all still present, so the
   array is additive detail rather than a different response format.

### Resolved (no longer issues)

Corrected in the current code, so they are deliberately no longer listed as open:

- The account-lifecycle cascade is covered by green integration tests (9/9 pass).
- Rating recalculation has a single canonical implementation,
  `src/utils/productRating.js`, shared by the review paths and the account lifecycle.
- Admin vendor deactivation cascades through the same helper as self-deactivation
  (`setRelatedResourcesActive`).
- `changePassword` checks that the user still exists before comparing passwords.
- `src/models/otp.js` declares `const Otp` (no implicit global).
- `app.js` has no stale commented-out mount lines, and unmatched routes return a JSON
  404 in the shared error envelope.
- The Zod `validator` middleware includes `data: null` in its error response.
- `updateOrderStatus` no longer assigns `updatedAt` by hand; `timestamps: true` owns it.
- `seedAdmin` refuses to run when `SEED_ADMIN_PASSWORD` is not set.
- The password-reset route is the canonical lower-case `/change-password`.

### Intentional design decisions (not bugs)

- **Reference field naming follows the existing persisted data.** `Product.vendor`,
  `Cart.userId`, `Order.customerId`/`shopId`, `OrderItems.productId`/`orderId`/
  `priceAtPurchase`, `Address.user`, and `Review.user` are stored schema fields.
  Renaming them would require a data migration and would break the public contract, so
  they are documented as-is.
- **`getOrderDetails` returns the order document plus its `items` array inside `data`.**
  Every cart/order endpoint in this domain returns raw documents instead of formatter
  output, so this matches the established order API contract. The project has no
  `formatOrder` helper, and the ownership check (`403`) is enforced.
- **The `OrderItems` model name is plural** while other models are singular. It is the
  registered model name and renaming it would gain nothing functionally.

## 13. Changes Made

This document was created during the audit. The backend has since been cleaned up on the
`chore/backend-cleanup-and-api-docs` branch: route mounting was split into
`cartRoutes` / `orderRoutes` / `vendorRoutes`, the password-reset path was normalized to
lower case, `.env.example` and `docs/API-DOCUMENTATION.md` were updated, and the items
listed under "Resolved" in section 12 were corrected. The findings above describe the
backend as it currently stands.

## 14. Remaining Concerns

Items that require team decisions or cannot be fully verified without additional setup:

1. **Confirm the MongoDB deployment supports transactions.** Checkout assumes a replica
   set / Atlas cluster; the local standalone instance cannot run it, so checkout is
   **NOT TESTABLE** here.
2. **Resolve local DNS** so the Atlas `mongodb+srv://` URI can be resolved from this
   machine, or accept local MongoDB for development. Atlas remains unverified here and
   `MONGO_URI` was deliberately left unchanged.
3. **Decide whether OTP verification needs rate limiting** (attempt cap or lockout).
4. **Provider/account specifics** (which SMTP provider, which Cloudinary/Atlas tier) were
   not inspected, since `.env` values were intentionally not read.