# API Documentation

Multi-Vendor Marketplace Backend REST API.

This document describes the API exactly as implemented in `backend/src`. Every
endpoint, field name, status code, and rule below is taken from the source code.

---

## 1. Overview

**Purpose.** A REST API for a multi-vendor marketplace. Customers browse products,
manage a cart, check out (producing one order per vendor), and review products.
Vendors manage a shop and products. Admins manage vendors and view analytics.

**Architecture.**

- Node.js with Express 5, written as CommonJS modules.
- MongoDB accessed through Mongoose 9.
- JSON request/response bodies (multipart/form-data only for product image uploads).
- Stateless authentication with JWT bearer tokens.

**Base URL / prefix.** All endpoints are served under:

```
/api/v1
```

Example: `http://localhost:5000/api/v1/products`.

**Versioning.** Versioned through the `/v1` path segment.

**Authentication mechanism.** A JWT bearer token. Send it in the `Authorization`
header:

```
Authorization: Bearer <token>
```

The token payload is `{ id, role }`. Token lifetime is controlled by the
`EXPIRES_IN` environment variable. Roles are `customer`, `vendor`, and `admin`.

**Content type.** `application/json` for all endpoints except product create/update,
which require `multipart/form-data`.

**Common headers.**

| Header | Value | When |
| --- | --- | --- |
| `Content-Type` | `application/json` | All JSON requests |
| `Content-Type` | `multipart/form-data` | Product image upload |
| `Authorization` | `Bearer <token>` | Protected endpoints |

**Common response format.**

Success:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Success without a payload:

```json
{
  "success": true,
  "message": "Success message",
  "data": null
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

> Note: Zod-validated routes (auth, user, OTP) return an additional `errors` array
> on validation failure. See section 11.

## 2. Authentication

### `POST /api/v1/auth/register`

**Description:** Registers a customer or vendor. Validation is performed with a Zod
discriminated union on `role`.

**Authentication:** Not required

**Role:** Public

#### Request Body (`role: "customer"`)

```json
{
  "role": "customer",
  "name": "Ada Okafor",
  "email": "ada@example.com",
  "phoneNumber": "08012345678",
  "password": "Passw0rd!"
}
```

#### Request Body (`role: "vendor"`)

```json
{
  "role": "vendor",
  "name": "Chidi Foods",
  "email": "chidi@example.com",
  "phoneNumber": "08087654321",
  "password": "Passw0rd!",
  "businessName": "Chidi Foods Ltd",
  "businessDescription": "Fresh produce and groceries",
  "bankDetails": {
    "accountNumber": "0123456789",
    "accountName": "Chidi Foods Ltd",
    "bankName": "Example Bank"
  }
}
```

#### Validation

- `role` must be `customer` or `vendor`.
- `name` is required, trimmed, at least 2 characters.
- `email` is required, trimmed, must be a valid email.
- `phoneNumber` is required, must match a Nigerian phone number
  (`+234` or `0`, then `7`/`8`/`9`, then `0`/`1`, then 8 digits).
- `password` is required, at least 8 characters, must contain a lowercase letter,
  an uppercase letter, a number, and a special character.
- Vendors additionally require `businessName` (min 5 chars) and
  `businessDescription` (min 5 chars). `bankDetails` is optional; when present it
  requires `accountNumber` (10–17 digits), `accountName` (min 5 chars), and
  `bankName` (min 3 chars).
- Unknown fields are rejected (strict schemas).

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "665f1c2e5a4b3c1d2e3f4a5b",
    "name": "Ada Okafor",
    "email": "ada@example.com",
    "phoneNumber": "08012345678",
    "role": "customer",
    "isActive": true,
    "deletedAt": null,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z",
    "__v": 0
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed

```json
{
  "success": false,
  "message": "Input data did not pass validation",
  "data": null,
  "errors": [
    { "path": "password", "errorMessage": "Password must contain a number" }
  ]
}
```

**Status:** 409 Conflict — email or phone already used

```json
{
  "success": false,
  "message": "An account with this email already exist",
  "data": null
}
```

### `POST /api/v1/auth/login`

**Description:** Authenticates a user and returns a JWT.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{
  "email": "ada@example.com",
  "password": "Passw0rd!"
}
```

#### Validation

- `email` is required and must be a valid email.
- `password` is required (minimum length 1 at the schema level).

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "_id": "665f1c2e5a4b3c1d2e3f4a5b",
      "name": "Ada Okafor",
      "email": "ada@example.com",
      "phoneNumber": "08012345678",
      "role": "customer",
      "isActive": true,
      "deletedAt": null,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed (same shape as register).

**Status:** 401 Unauthorized — unknown email, wrong password, or deleted account

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

**Status:** 403 Forbidden — account deactivated

```json
{
  "success": false,
  "message": "This account has been deactivated",
  "data": null
}
```

> There is no logout endpoint. Authentication is stateless JWT, so the client discards
> the token to "log out". Server-side token invalidation is not implemented.

### `POST /api/v1/auth/forgot-password`

**Description:** Requests a password-reset OTP by email.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{ "email": "ada@example.com" }
```

#### Validation

- `email` is required and must be a valid email.

#### Success Response

**Status:** 200 OK — returned whether or not the account exists (no account enumeration)

```json
{
  "success": true,
  "message": "If eligible, an OTP has been sent",
  "data": null
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed.

**Status:** 500 Internal Server Error — email could not be sent

```json
{
  "success": false,
  "message": "We couldn't send your code right now. Please try again shortly.",
  "data": null
}
```

### `POST /api/v1/auth/verify-reset-otp`

**Description:** Verifies a password-reset OTP without consuming it.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{ "email": "ada@example.com", "otp": "123456" }
```

#### Validation

- `email` is required and must be a valid email.
- `otp` is required and must be exactly 6 digits.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "OTP verified", "data": null }
```

#### Error Responses

**Status:** 400 Bad Request

```json
{ "success": false, "message": "Invalid or expired OTP", "data": null }
```

### `POST /api/v1/auth/reset-password`

**Description:** Resets a password using a valid OTP. The OTP is consumed on success.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{
  "email": "ada@example.com",
  "otp": "123456",
  "newPassword": "NewPassw0rd!"
}
```

#### Validation

- `email` is required and must be a valid email.
- `otp` is required and must be exactly 6 digits.
- `newPassword` is required, at least 8 characters, must contain a lowercase letter,
  an uppercase letter, a number, and a special character, and must not contain spaces.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Password reset successfully", "data": null }
```

#### Error Responses

**Status:** 400 Bad Request — invalid/expired OTP, or the account is deleted

```json
{ "success": false, "message": "Invalid or expired OTP", "data": null }
```

### `POST /api/v1/auth/reactivate/request`

**Description:** Requests an account-reactivation OTP. Only sent for deactivated
(non-deleted) accounts, but the response is uniform.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{ "email": "ada@example.com" }
```

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "If eligible, an OTP has been sent", "data": null }
```

### `POST /api/v1/auth/reactivate/verify`

**Description:** Verifies an account-reactivation OTP.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{ "email": "ada@example.com", "otp": "654321" }
```

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "OTP verified", "data": null }
```

### `POST /api/v1/auth/reactivate/confirm`

**Description:** Reactivates a deactivated account using a valid OTP and restores its
related resources.

**Authentication:** Not required

**Role:** Public

#### Request Body

```json
{ "email": "ada@example.com", "otp": "654321" }
```

#### Validation

- `email` is required and must be a valid email.
- `otp` is required and must be exactly 6 digits.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Account reactivated successfully", "data": null }
```

#### Error Responses

**Status:** 400 Bad Request — invalid/expired OTP, account deleted, or already active

```json
{ "success": false, "message": "Invalid or expired OTP", "data": null }
```

```json
{ "success": false, "message": "Account is already active", "data": null }
```

## 3. Users

All user endpoints require authentication. `GET /user/me` returns the authenticated
user's document (password excluded). Profile updates use a Zod schema chosen by the
caller's role (customer / vendor / admin) and reject unknown fields.

### `GET /api/v1/user/me`

**Description:** Returns the authenticated user's profile.

**Authentication:** Required

**Role:** Any authenticated role

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "_id": "665f1c2e5a4b3c1d2e3f4a5b",
    "name": "Ada Okafor",
    "email": "ada@example.com",
    "phoneNumber": "08012345678",
    "role": "customer",
    "isActive": true,
    "deletedAt": null,
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
}
```

#### Error Responses

**Status:** 401 Unauthorized — missing/invalid token, deactivated or deleted account.

### `PUT /api/v1/user/update-profile`

**Description:** Updates the authenticated user's profile. Email and phone are checked
for uniqueness against other accounts.

**Authentication:** Required

**Role:** Any authenticated role

#### Request Body (customer)

```json
{
  "name": "Ada N. Okafor",
  "email": "ada.new@example.com",
  "phoneNumber": "08012345678"
}
```

#### Request Body (vendor)

```json
{
  "name": "Chidi Foods",
  "businessName": "Chidi Foods Ltd",
  "businessDescription": "Fresh produce, groceries and household items"
}
```

#### Validation

- All fields are optional, but the payload must not contain unknown fields.
- `name` (when present) is trimmed and at least 2 characters.
- `email` (when present) must be a valid email.
- `phoneNumber` (when present) must match the Nigerian phone format.
- Role-specific fields follow the same rules as registration.

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Update successful",
  "data": {
    "_id": "665f1c2e5a4b3c1d2e3f4a5b",
    "name": "Ada N. Okafor",
    "email": "ada.new@example.com",
    "phoneNumber": "08012345678",
    "role": "customer",
    "isActive": true,
    "deletedAt": null,
    "updatedAt": "2026-02-02T09:30:00.000Z"
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed.

**Status:** 409 Conflict — email or phone already in use

```json
{
  "success": false,
  "message": "Email is already in use by another account",
  "data": null
}
```

### `PUT /api/v1/user/change-Password`

**Description:** Changes the authenticated user's password after verifying the current
password.

**Authentication:** Required

**Role:** Any authenticated role

> The route path is literally `change-Password` (capital `P`).

#### Request Body

```json
{
  "currentPassword": "Passw0rd!",
  "newPassword": "NewSecret1!"
}
```

#### Validation

- `currentPassword` is required (minimum length 1).
- `newPassword` is required, at least 8 characters, with lowercase, uppercase, digit,
  and special character.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Password updated successfully", "data": null }
```

#### Error Responses

**Status:** 400 Bad Request — validation failed.

**Status:** 401 Unauthorized — current password incorrect

```json
{ "success": false, "message": "Current password is incorrect", "data": null }
```

**Status:** 404 Not Found — user no longer exists

```json
{ "success": false, "message": "User not found", "data": null }
```

### `PUT /api/v1/user/deactivate-account`

**Description:** Deactivates the authenticated account (reversible). Cascades the
inactive state to the user's addresses, shop, and reviews.

**Authentication:** Required

**Role:** Customer or Vendor (admins cannot self-deactivate)

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Account deactivated successfully", "data": null }
```

#### Error Responses

**Status:** 400 Bad Request — the account is permanently deleted

```json
{
  "success": false,
  "message": "Deleted accounts cannot be deactivated or reactivated",
  "data": null
}
```

**Status:** 403 Forbidden — admin account

```json
{
  "success": false,
  "message": "Admin accounts cannot be self-deactivated. Contact another admin.",
  "data": null
}
```

**Status:** 404 Not Found — user not found.

### `DELETE /api/v1/user/delete-account`

**Description:** Soft-deletes the authenticated account: sets `isActive: false` and
`deletedAt` to the current date. The record is preserved for historical references and
the account can no longer be reactivated.

**Authentication:** Required

**Role:** Customer or Vendor (admins cannot self-delete)

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Account deleted successfully", "data": null }
```

#### Error Responses

**Status:** 403 Forbidden — admin account

```json
{
  "success": false,
  "message": "Admin accounts cannot be self-deleted. Contact another admin to remove your account.",
  "data": null
}
```

**Status:** 404 Not Found — user not found.

## 4. Products

Product listing and single-product retrieval are public. Create, update, and delete
require a vendor token; ownership is enforced.

### `GET /api/v1/products`

**Description:** Lists active products from active, non-deleted vendors. Supports
filtering, sorting, search, and pagination.

**Authentication:** Not required

**Role:** Public

#### Query Parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `category` | ObjectId | Filter by category id |
| `vendor` | ObjectId | Filter by vendor id |
| `minPrice` | number | Minimum price (inclusive) |
| `maxPrice` | number | Maximum price (inclusive) |
| `minRating` | number 0–5 | Minimum `ratingsAverage` |
| `inStock` | `true` | Only products with `stock > 0` |
| `search` | string (≤100 chars) | Case-insensitive match on `name`/`description` |
| `sort` | enum | `newest` (default), `price_asc`, `price_desc`, `rating` |
| `page` | integer ≥1 | Default 1 |
| `limit` | integer 1–50 | Default 12 |

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "id": "665f20005a4b3c1d2e3f4a60",
        "name": "Wireless Mouse",
        "price": 15000,
        "image": "https://res.cloudinary.com/.../mouse.jpg",
        "category": "Electronics",
        "categoryId": "665f10005a4b3c1d2e3f4a00",
        "vendorId": "665f0f005a4b3c1d2e3f4000",
        "inStock": true,
        "rating": 4.5,
        "reviewCount": 12
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "pages": 1,
      "limit": 12
    }
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — a query parameter failed validation.

### `GET /api/v1/products/:id`

**Description:** Returns one product plus up to four related products from the same
category.

**Authentication:** Not required

**Role:** Public

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "product": {
      "id": "665f20005a4b3c1d2e3f4a60",
      "name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse",
      "price": 15000,
      "images": ["https://res.cloudinary.com/.../mouse.jpg"],
      "category": "Electronics",
      "categoryId": "665f10005a4b3c1d2e3f4a00",
      "inStock": true,
      "stockQuantity": 40,
      "vendorId": "665f0f005a4b3c1d2e3f4000",
      "specifications": {},
      "rating": 4.5,
      "reviewCount": 12,
      "createdAt": "2026-02-01T10:00:00.000Z"
    },
    "relatedProducts": []
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — invalid product id.

**Status:** 404 Not Found — product missing, inactive, or its vendor is unavailable

```json
{ "success": false, "message": "Product not found", "data": null }
```

### `POST /api/v1/products`

**Description:** Creates a product. Requires `multipart/form-data` with at least one
image. Images are uploaded to Cloudinary.

**Authentication:** Required

**Role:** Vendor

#### Request (`multipart/form-data`)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | text | Required |
| `description` | text | Required |
| `price` | text (number) | Required, ≥ 0 |
| `stock` | text (integer) | Required, ≥ 0 |
| `category` | text (ObjectId) | Required, must exist |
| `images` | file(s) | Required, up to 5, image only, ≤ 5 MB each |

#### Validation

- `name` and `description` are required.
- `price` must be a non-negative number.
- `stock` must be a non-negative integer.
- `category` must be a valid, existing category id.
- At least one image is required; non-image files are rejected.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "665f20005a4b3c1d2e3f4a60",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 15000,
    "images": ["https://res.cloudinary.com/.../mouse.jpg"],
    "category": "Electronics",
    "categoryId": "665f10005a4b3c1d2e3f4a00",
    "inStock": true,
    "stockQuantity": 40,
    "vendorId": "665f0f005a4b3c1d2e3f4000",
    "specifications": {},
    "rating": 0,
    "reviewCount": 0,
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed, no image, or non-image file.

**Status:** 404 Not Found — category not found

```json
{ "success": false, "message": "Category not found", "data": null }
```

### `PUT /api/v1/products/:id`

**Description:** Updates a product the vendor owns. `multipart/form-data`. If new
images are supplied they replace the existing set and the old images are removed from
Cloudinary.

**Authentication:** Required

**Role:** Vendor (owner only)

#### Request (`multipart/form-data`)

Optional: `name`, `description`, `price`, `stock`, `category`, `images`.

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { "id": "665f20005a4b3c1d2e3f4a60", "name": "Wireless Mouse v2", "price": 14000 }
}
```

#### Error Responses

**Status:** 400 Bad Request — invalid product id or malformed body.

**Status:** 403 Forbidden — not the owner

```json
{ "success": false, "message": "You can only update your own products", "data": null }
```

**Status:** 404 Not Found — product (or category) not found.

### `DELETE /api/v1/products/:id`

**Description:** Soft-deletes a product the vendor owns (`isActive: false`). The
document is preserved for historical order references.

**Authentication:** Required

**Role:** Vendor (owner only)

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Product deleted successfully", "data": null }
```

#### Error Responses

**Status:** 403 Forbidden — not the owner.

**Status:** 404 Not Found — product not found.

## 5. Categories

Categories are created by admins and listed publicly. There is no update or delete
endpoint.

### `GET /api/v1/categories`

**Description:** Lists all categories (sorted by name) with a count of visible products
in each.

**Authentication:** Not required

**Role:** Public

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "665f10005a4b3c1d2e3f4a00",
      "name": "Electronics",
      "icon": "📱",
      "description": "Phones, laptops, accessories and gadgets",
      "productCount": 12
    }
  ]
}
```

> `productCount` counts only products that are active and whose vendor is active and
> not deleted.

### `POST /api/v1/categories`

**Description:** Creates a category.

**Authentication:** Required

**Role:** Admin

#### Request Body

```json
{
  "name": "Electronics",
  "icon": "📱",
  "description": "Phones, laptops, accessories and gadgets"
}
```

#### Validation

- `name` is required and non-empty; it is unique.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "665f10005a4b3c1d2e3f4a00",
    "name": "Electronics",
    "icon": "📱",
    "description": "Phones, laptops, accessories and gadgets"
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed or duplicate name.

**Status:** 403 Forbidden — caller is not an admin.

## 6. Vendors

A vendor owns at most one shop. Shops are created and updated by the owning vendor and
read publicly. Admins manage vendor status.

### `POST /api/v1/shops`

**Description:** Registers the authenticated vendor's shop. One shop per vendor.

**Authentication:** Required

**Role:** Vendor

#### Request Body

```json
{
  "name": "Chidi Foods",
  "description": "Fresh produce and groceries",
  "logo": "https://res.cloudinary.com/.../logo.png",
  "contactEmail": "hello@chidifoods.example",
  "contactPhone": "08087654321"
}
```

#### Validation

- `name` is required and non-empty.
- `logo` (when present) must be a valid URL.
- `contactEmail` (when present) must be a valid email.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Shop registered successfully",
  "data": {
    "id": "665f15005a4b3c1d2e3f4a10",
    "name": "Chidi Foods",
    "description": "Fresh produce and groceries",
    "logo": "https://res.cloudinary.com/.../logo.png",
    "contactEmail": "hello@chidifoods.example",
    "contactPhone": "08087654321",
    "isActive": true,
    "ownerId": "665f0f005a4b3c1d2e3f4000",
    "createdAt": "2026-02-01T10:00:00.000Z"
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed or the vendor already has a shop

```json
{ "success": false, "message": "You already have a registered shop", "data": null }
```

### `PATCH /api/v1/shops/me`

**Description:** Updates the authenticated vendor's shop.

**Authentication:** Required

**Role:** Vendor

#### Request Body

```json
{
  "name": "Chidi Foods & Groceries",
  "contactPhone": "08087654322"
}
```

#### Validation

- `name` (when present) cannot be empty.
- `logo` (when present) must be a valid URL.
- `contactEmail` (when present) must be a valid email.

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Shop updated successfully",
  "data": { "id": "665f15005a4b3c1d2e3f4a10", "name": "Chidi Foods & Groceries" }
}
```

#### Error Responses

**Status:** 404 Not Found — the vendor has no shop

```json
{ "success": false, "message": "You do not have a registered shop yet", "data": null }
```

### `GET /api/v1/shops/me/dashboard`

**Description:** Returns the authenticated vendor's shop plus product counts. Order and
sales figures are placeholders.

**Authentication:** Required

**Role:** Vendor

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Vendor dashboard fetched successfully",
  "data": {
    "shop": { "id": "665f15005a4b3c1d2e3f4a10", "name": "Chidi Foods", "isActive": true },
    "totalProducts": 20,
    "activeProducts": 18,
    "totalOrders": null,
    "totalSales": null
  }
}
```

#### Error Responses

**Status:** 404 Not Found — the vendor has no shop.

### `GET /api/v1/shops/:id`

**Description:** Returns a shop by shop id. Only visible when the shop is active and
its owner is an active, non-deleted vendor.

**Authentication:** Not required

**Role:** Public

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Shop fetched successfully",
  "data": {
    "id": "665f15005a4b3c1d2e3f4a10",
    "name": "Chidi Foods",
    "description": "Fresh produce and groceries",
    "logo": "https://res.cloudinary.com/.../logo.png",
    "contactEmail": "hello@chidifoods.example",
    "contactPhone": "08087654321",
    "isActive": true,
    "ownerId": "665f0f005a4b3c1d2e3f4000",
    "createdAt": "2026-02-01T10:00:00.000Z",
    "productCount": 18
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — invalid shop id.

**Status:** 404 Not Found — shop missing, inactive, or owner unavailable.

### `GET /api/v1/shops/vendor/:vendorId`

**Description:** Returns the shop belonging to a vendor, with the same visibility rules
as `GET /api/v1/shops/:id`.

**Authentication:** Not required

**Role:** Public

#### Success Response

**Status:** 200 OK — same shape as `GET /api/v1/shops/:id`.

#### Error Responses

**Status:** 400 Bad Request — invalid vendor id.

**Status:** 404 Not Found — no visible shop for that vendor.

## 7. Cart

The cart is per customer and requires a customer token. All cart routes are mounted at
the API root (`/api/v1/cart...`) via the order router.

### `GET /api/v1/cart`

**Description:** Returns the authenticated customer's cart, creating an empty one on
first access.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Cart retrieved",
  "data": {
    "_id": "665f30005a4b3c1d2e3f4b00",
    "userId": "665f1c2e5a4b3c1d2e3f4a5b",
    "items": [
      { "productId": "665f20005a4b3c1d2e3f4a60", "quantity": 2, "price": 15000 }
    ],
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-01T10:00:00.000Z"
  }
}
```

#### Error Responses

**Status:** 401 Unauthorized — missing/invalid token.

**Status:** 403 Forbidden — caller is not a customer.

### `POST /api/v1/cart/items`

**Description:** Adds a product to the cart, or increases the quantity if the product is
already present. Stock is verified.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{ "productId": "665f20005a4b3c1d2e3f4a60", "quantity": 2 }
```

#### Validation

- `productId` must be a valid ObjectId.
- `quantity` must be an integer ≥ 1.

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { "userId": "665f1c2e5a4b3c1d2e3f4a5b", "items": [] }
}
```

#### Error Responses

**Status:** 404 Not Found — product not found or unavailable (inactive product/vendor/shop)

```json
{ "success": false, "message": "Product not found or unavailable", "data": null }
```

**Status:** 400 Bad Request — insufficient stock

```json
{ "success": false, "message": "Insufficient stock. Only 3 available", "data": null }
```

### `PUT /api/v1/cart/items/:itemId`

**Description:** Sets the quantity of a cart item. Stock is verified.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{ "quantity": 5 }
```

#### Validation

- `itemId` must be a valid ObjectId.
- `quantity` must be an integer ≥ 1.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Cart item updated", "data": { "items": [] } }
```

#### Error Responses

**Status:** 404 Not Found — cart not found, or item not in cart.

**Status:** 400 Bad Request — insufficient stock.

### `DELETE /api/v1/cart/items/:itemId`

**Description:** Removes one item from the cart.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Item removed from cart", "data": { "items": [] } }
```

#### Error Responses

**Status:** 404 Not Found — cart not found, or item not in cart.

### `DELETE /api/v1/cart`

**Description:** Clears all items from the cart.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Cart cleared", "data": { "items": [] } }
```

#### Error Responses

**Status:** 404 Not Found — cart not found.

## 7b. Addresses

Addresses are per customer. A customer may have multiple addresses and mark one as
default. All address routes require a customer token.

### `POST /api/v1/addresses`

**Description:** Creates an address for the authenticated customer. When `isDefault` is
true, all other addresses for that customer are set to non-default.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{
  "fullName": "Ada Okafor",
  "phone": "08012345678",
  "street": "12 Marina Road",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "isDefault": true
}
```

#### Validation

- `fullName`, `phone`, `street`, `city`, and `state` are required and non-empty.
- `country` is optional.
- `isDefault` is optional and must be a boolean.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "id": "665f70005a4b3c1d2e3f5400",
    "fullName": "Ada Okafor",
    "phone": "08012345678",
    "street": "12 Marina Road",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "isDefault": true
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed or invalid id.

### `GET /api/v1/addresses`

**Description:** Lists the authenticated customer's active addresses, default first.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Addresses fetched successfully",
  "data": [
    {
      "id": "665f70005a4b3c1d2e3f5400",
      "fullName": "Ada Okafor",
      "phone": "08012345678",
      "street": "12 Marina Road",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "isDefault": true
    }
  ]
}
```

### `PATCH /api/v1/addresses/:id`

**Description:** Updates one of the authenticated customer's addresses. Setting
`isDefault` true clears the default on the customer's other addresses.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{ "city": "Abuja", "isDefault": false }
```

#### Validation

- All fields are optional, but each supplied field must be non-empty.
- `isDefault` must be a boolean.

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": { "id": "665f70005a4b3c1d2e3f5400", "city": "Abuja", "isDefault": false }
}
```

#### Error Responses

**Status:** 404 Not Found — address not found for this customer.

### `DELETE /api/v1/addresses/:id`

**Description:** Deletes one of the authenticated customer's addresses.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Address deleted successfully", "data": null }
```

#### Error Responses

**Status:** 404 Not Found — address not found for this customer.

> Address removal here is a hard delete of that address document. Account-level
> deactivation instead soft-hides addresses (`isActive: false`), and orders keep their
> own inline shipping-address snapshot, so order history is unaffected.

## 8. Orders

Checkout converts a customer's cart into orders. Because the marketplace is
multi-vendor, **checkout produces one order per vendor (per shop)**. Checkout runs
inside a MongoDB session/transaction, so it is all-or-nothing on a deployment that
supports transactions (a replica set or an Atlas cluster). On a standalone `mongod`,
transactions are unavailable and checkout cannot complete.

### `POST /api/v1/orders`

**Description:** Checks out the authenticated customer's cart. Validates every product,
vendor, and shop, decrements stock atomically, creates one order per vendor with a
shipping-address snapshot and per-item purchase-price snapshot, then clears the cart.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{
  "shippingAddress": {
    "fullName": "Ada Okafor",
    "phone": "08012345678",
    "street": "12 Marina Road",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria"
  },
  "paymentMethod": "cash_on_delivery"
}
```

#### Validation

- `shippingAddress` is required, with non-empty `fullName`, `phone`, `street`, `city`,
  `state`; `country` is optional (defaults to `Nigeria`).
- `paymentMethod` must be one of `credit_card`, `bank_transfer`, `cash_on_delivery`.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "2 order(s) created successfully",
  "data": {
    "orders": [
      { "orderId": "665f40005a4b3c1d2e3f5000", "vendorName": "Chidi Foods", "totalAmount": 30000, "itemCount": 2 },
      { "orderId": "665f40005a4b3c1d2e3f5001", "vendorName": "Ada Electronics", "totalAmount": 45000, "itemCount": 1 }
    ],
    "totalOrders": 2,
    "summary": "Your checkout was split into 2 order(s), one per vendor"
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — missing/incomplete shipping address, invalid payment
method, or empty cart

```json
{ "success": false, "message": "Cart is empty", "data": null }
```

**Status:** 409 Conflict — a product/vendor is no longer available, or stock changed

```json
{ "success": false, "message": "A cart product or its vendor is no longer available", "data": null }
```

```json
{ "success": false, "message": "Wireless Mouse no longer has enough stock", "data": null }
```

> On any 409 the transaction is rolled back: no orders are created and no stock is
> deducted.

### `GET /api/v1/orders`

**Description:** Lists the authenticated customer's orders, newest first, with
pagination.

**Authentication:** Required

**Role:** Customer

#### Query Parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `page` | integer ≥1 | Default 1 |
| `limit` | integer 1–50 | Default 10 |

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": {
    "items": [
      {
        "_id": "665f40005a4b3c1d2e3f5000",
        "customerId": "665f1c2e5a4b3c1d2e3f4a5b",
        "shopId": "665f15005a4b3c1d2e3f4a10",
        "status": "pending",
        "totalAmount": 30000,
        "shippingAddress": { "fullName": "Ada Okafor", "city": "Lagos", "state": "Lagos" },
        "paymentMethod": "cash_on_delivery",
        "createdAt": "2026-02-03T12:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### `GET /api/v1/orders/:orderId`

**Description:** Returns one order with its line items (product name and images
populated). Only the owning customer can view it.

**Authentication:** Required

**Role:** Customer

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Order retrieved",
  "data": {
    "_id": "665f40005a4b3c1d2e3f5000",
    "status": "pending",
    "totalAmount": 30000,
    "items": [
      {
        "_id": "665f41005a4b3c1d2e3f5100",
        "orderId": "665f40005a4b3c1d2e3f5000",
        "productId": { "_id": "665f20005a4b3c1d2e3f4a60", "name": "Wireless Mouse", "images": [] },
        "quantity": 2,
        "priceAtPurchase": 15000
      }
    ]
  }
}
```

#### Error Responses

**Status:** 403 Forbidden — not the owner

```json
{ "success": false, "message": "You can only view your own orders", "data": null }
```

**Status:** 404 Not Found — order not found.

### `GET /api/v1/vendors/orders`

**Description:** Lists orders placed against the authenticated vendor's shop, newest
first, with optional status filter and pagination.

**Authentication:** Required

**Role:** Vendor

#### Query Parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `status` | enum | `pending`, `processing`, `shipped`, `delivered` |
| `page` | integer ≥1 | Default 1 |
| `limit` | integer 1–50 | Default 10 |

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Vendor orders retrieved",
  "data": { "items": [], "page": 1, "limit": 10, "total": 0, "pages": 0 }
}
```

#### Error Responses

**Status:** 404 Not Found — the vendor has no shop

```json
{ "success": false, "message": "Shop not found", "data": null }
```

### `PUT /api/v1/orders/:orderId/status`

**Description:** Updates the status of an order belonging to the authenticated vendor's
shop.

**Authentication:** Required

**Role:** Vendor

#### Request Body

```json
{ "status": "shipped" }
```

#### Validation

- `status` must be one of `pending`, `processing`, `shipped`, `delivered`.

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Order status updated", "data": { "status": "shipped" } }
```

#### Error Responses

**Status:** 403 Forbidden — the order is not from the vendor's shop

```json
{ "success": false, "message": "You can only update orders from your shop", "data": null }
```

**Status:** 404 Not Found — order not found.

> Order cancellation is not implemented. Order status is the only mutable field.

## 9. Reviews & Ratings

Customers submit reviews; reviews are public to read and can be deleted by their author
or an admin. There is no update endpoint for reviews.

### `POST /api/v1/reviews`

**Description:** Creates a review for a product. Only customers may review, only one
review per customer per product, and the product's vendor must be available.

**Authentication:** Required

**Role:** Customer

#### Request Body

```json
{
  "product": "665f20005a4b3c1d2e3f4a60",
  "rating": 5,
  "comment": "Excellent product."
}
```

#### Validation

- `product` must be a valid ObjectId.
- `rating` must be an integer between 1 and 5.
- `comment` is optional and trimmed.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "id": "665f50005a4b3c1d2e3f5200",
    "rating": 5,
    "comment": "Excellent product.",
    "productId": "665f20005a4b3c1d2e3f4a60",
    "user": { "id": "665f1c2e5a4b3c1d2e3f4a5b" },
    "createdAt": "2026-02-04T08:00:00.000Z"
  }
}
```

#### Error Responses

**Status:** 403 Forbidden — caller is not a customer

```json
{ "success": false, "message": "Only customers can submit product reviews", "data": null }
```

**Status:** 400 Bad Request — already reviewed this product

```json
{ "success": false, "message": "You have already reviewed this product", "data": null }
```

**Status:** 404 Not Found — product missing, inactive, or its vendor is unavailable.

### `GET /api/v1/reviews/product/:productId`

**Description:** Lists active reviews for a product written by active, non-deleted
customers, newest first, with the reviewer's name.

**Authentication:** Not required

**Role:** Public

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [
    {
      "id": "665f50005a4b3c1d2e3f5200",
      "rating": 5,
      "comment": "Excellent product.",
      "productId": "665f20005a4b3c1d2e3f4a60",
      "user": { "id": "665f1c2e5a4b3c1d2e3f4a5b", "name": "Ada Okafor" },
      "createdAt": "2026-02-04T08:00:00.000Z"
    }
  ]
}
```

#### Error Responses

**Status:** 400 Bad Request — invalid product id.

**Status:** 404 Not Found — product/product vendor unavailable.

### `DELETE /api/v1/reviews/:id`

**Description:** Deletes a review. Allowed for the review's author or an admin. The
product's rating is recalculated afterwards.

**Authentication:** Required

**Role:** Customer (author) or Admin

#### Success Response

**Status:** 200 OK

```json
{ "success": true, "message": "Review deleted successfully", "data": null }
```

#### Error Responses

**Status:** 403 Forbidden — not the author and not an admin

```json
{ "success": false, "message": "You can only delete your own reviews", "data": null }
```

**Status:** 404 Not Found — review not found.

### Rating calculation

A product's `ratingsAverage` (rounded to one decimal) and `ratingsCount` are recalculated
after any review is created or deleted, and after any account lifecycle change that
affects a reviewer. A review contributes to the product rating only when:

- the review is active (`isActive: true`), and
- the reviewer is a customer whose account is active (`isActive: true`) and not deleted
  (`deletedAt: null`).

This rule is implemented once, in `src/utils/productRating.js`, and reused by the review
controller and the account-lifecycle cascade. When no qualifying reviews remain, the
rating resets to `0` with `ratingsCount: 0`.

> Reviews are not collected into a separate "update" endpoint; a customer who wants to
> change a rating deletes their review and submits a new one.

## 10. Admin

Every admin route requires an admin token. The router applies `protect` and
`restrictTo('admin')` to all routes.

### `POST /api/v1/admin/create-admin`

**Description:** Creates a new admin account.

**Authentication:** Required

**Role:** Admin

#### Request Body

```json
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "phoneNumber": "08000000000",
  "password": "Str0ng!Pass"
}
```

#### Validation

- `name`, `email`, `phoneNumber`, and `password` are all required.
- `email` must be valid; phone and email must be unique across accounts.
- `password` must be at least 8 characters and contain a lowercase letter, an uppercase
  letter, a number, and a special character.

#### Success Response

**Status:** 201 Created

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "665f60005a4b3c1d2e3f5300",
    "name": "Super Admin",
    "email": "admin@example.com",
    "phoneNumber": "08000000000",
    "role": "admin",
    "isActive": true,
    "deletedAt": null
  }
}
```

#### Error Responses

**Status:** 400 Bad Request — validation failed.

**Status:** 409 Conflict — email or phone already exists

```json
{ "success": false, "message": "An account with this Email already exists", "data": null }
```

### `GET /api/v1/admin/vendors`

**Description:** Lists vendors with pagination and an optional status filter, including
a shop summary for each vendor.

**Authentication:** Required

**Role:** Admin

#### Query Parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `status` | `active` \| `inactive` | Optional filter on `isActive` |
| `page` | integer ≥1 | Default 1 |
| `limit` | integer 1–50 | Default 20 |

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Vendors fetched successfully",
  "data": {
    "vendors": [
      {
        "id": "665f0f005a4b3c1d2e3f4000",
        "name": "Chidi Foods",
        "email": "chidi@example.com",
        "isActive": true,
        "createdAt": "2026-02-01T10:00:00.000Z",
        "shop": { "id": "665f15005a4b3c1d2e3f4a10", "name": "Chidi Foods", "isActive": true }
      }
    ],
    "pagination": { "total": 1, "page": 1, "pages": 1, "limit": 20 }
  }
}
```

### `GET /api/v1/admin/customers`

**Description:** Lists customers with pagination.

**Authentication:** Required

**Role:** Admin

#### Query Parameters

| Parameter | Type | Notes |
| --- | --- | --- |
| `page` | integer ≥1 | Default 1 |
| `limit` | integer 1–50 | Default 20 |

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Customers fetched successfully",
  "data": {
    "customers": [
      { "id": "665f1c2e5a4b3c1d2e3f4a5b", "name": "Ada Okafor", "email": "ada@example.com", "isActive": true, "createdAt": "2026-02-01T10:00:00.000Z" }
    ],
    "pagination": { "total": 1, "page": 1, "pages": 1, "limit": 20 }
  }
}
```

### `PATCH /api/v1/admin/vendors/:id/status`

**Description:** Activates or deactivates a vendor. Cascades the state to the vendor's
related resources (shop and reviews) exactly like self-service deactivation, so public
visibility is identical regardless of who triggers it. Permanently deleted vendors
cannot be reactivated.

**Authentication:** Required

**Role:** Admin

#### Request Body

```json
{ "isActive": false }
```

#### Validation

- `id` must be a valid vendor ObjectId.
- `isActive` must be a JSON boolean (`true`/`false`, not the strings `"true"`/`"false"`).

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Vendor deactivated successfully",
  "data": { "id": "665f0f005a4b3c1d2e3f4000", "isActive": false }
}
```

#### Error Responses

**Status:** 400 Bad Request — `isActive` is not a boolean, or the vendor is permanently
deleted

```json
{ "success": false, "message": "Permanently deleted vendors cannot be reactivated", "data": null }
```

**Status:** 404 Not Found — vendor not found.

### `GET /api/v1/admin/analytics`

**Description:** Returns platform counts. Revenue and top-vendor figures are
placeholders pending order-domain reporting.

**Authentication:** Required

**Role:** Admin

#### Success Response

**Status:** 200 OK

```json
{
  "success": true,
  "message": "Platform analytics fetched successfully",
  "data": {
    "totalUsers": 120,
    "totalVendors": 30,
    "totalCustomers": 88,
    "totalShops": 28,
    "totalProducts": 240,
    "totalRevenue": null,
    "topVendors": null
  }
}
```

> `totalProducts` counts only active products belonging to active, non-deleted vendors.

> Admins cannot self-deactivate or self-delete through the user endpoints; those return
> `403`.

## 11. Error Handling

All errors use the shared envelope:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

Status codes actually returned by the implementation:

| Status | Meaning | Typical cause |
| --- | --- | --- |
| 400 | Bad Request | Validation failure, invalid id, bad payment method, insufficient stock, duplicate review |
| 401 | Unauthorized | Missing/invalid/expired token; wrong login credentials; deleted account; `protect` rejects inactive/deleted users |
| 403 | Forbidden | Wrong role for the route; not the resource owner; deactivated login; admin self-management blocked |
| 404 | Not Found | Missing/soft-deleted resource, or an unavailable vendor/shop behind it; unmatched route |
| 409 | Conflict | Duplicate email/phone; checkout product/vendor/stock conflict |
| 500 | Internal Server Error | Unexpected failure; email delivery failure |

Details:

- **Validation errors** from express-validator routes are converted to a `400` with a
  single joined message. Zod routes return `400` with `message:
  "Input data did not pass validation"` plus an `errors` array of
  `{ path, errorMessage }` objects and `data: null`.
- **Authentication errors** are `401` with a `message` such as
  `"Invalid or expired token"` or `"Account has been deactivated"`.
- **Authorization errors** are `403`.
- **Account-status errors:** deactivated login → `403`; `protect` on an inactive or
  deleted account → `401`.
- **Unknown routes** return a JSON `404`:
  `{"success": false, "message": "Route not found: GET /api/v1/nope", "data": null}`.
- Mongoose duplicate-key errors are converted to `400` with a message such as
  `"email 'x@y.com' already exists"`.
- Mongoose validation/cast errors are converted to `400`.

## 12. Pagination, Filtering & Searching

**Pagination** is used on: products, customer orders, vendor orders, admin vendors, and
admin customers.

| Endpoint | `page` default | `limit` default | `limit` max | Response metadata |
| --- | --- | --- | --- | --- |
| `GET /products` | 1 | 12 | 50 | `data.pagination` |
| `GET /orders` | 1 | 10 | 50 | `data.page/limit/total/pages` |
| `GET /vendors/orders` | 1 | 10 | 50 | `data.page/limit/total/pages` |
| `GET /admin/vendors` | 1 | 20 | 50 | `data.pagination` |
| `GET /admin/customers` | 1 | 20 | 50 | `data.pagination` |

The `pagination` object for products is `{ total, page, pages, limit }`. When there are
no active vendors, products returns an empty list with the requested page and limit
preserved.

**Filtering and search** apply to `GET /products` (`category`, `vendor`, `minPrice`,
`maxPrice`, `minRating`, `inStock`, `search`) and `GET /vendors/orders` / `GET
/admin/vendors` (`status`). See each endpoint for details.

**Sorting** applies to `GET /products` through `sort` with the values `newest`
(default), `price_asc`, `price_desc`, and `rating`.

## 13. File Uploads

Product images are the only file upload in the API.

- **Endpoints:** `POST /api/v1/products` and `PUT /api/v1/products/:id`.
- **Content type:** `multipart/form-data`.
- **Field name:** `images` (accepts up to 5 files per request).
- **Type/size limits:** image mimetypes only (`image/*`), maximum 5 MB per file.
- **Storage:** files are held in memory by multer and streamed to Cloudinary. No files
  are written to the server's disk.
- **Cloudinary:** uploaded images return `secure_url` values stored on `Product.images`;
  the Cloudinary `public_id`s are stored on `Product.imagePublicIds` (`select: false`,
  stripped from JSON output). Replacing images on update deletes the old images from
  Cloudinary. If an upload fails midway, images already uploaded for that request are
  cleaned up.
- **Error behavior:** a non-image file returns `400 "Only image files are allowed"`;
  files over 5 MB return a multer error (`400`). A product create without any image
  returns `400 "At least one product image is required"`.

## 14. Account Lifecycle

An account is described by two fields:

| State | `isActive` | `deletedAt` |
| --- | --- | --- |
| Active | `true` | `null` |
| Deactivated | `false` | `null` |
| Deleted (soft) | `false` | `<date>` |

How each state affects behavior (as implemented):

- **Login:** deleted → `401 "Invalid email or password"`; deactivated → `403 "This
  account has been deactivated"`; active → token issued.
- **Protected routes:** `protect` rejects deleted accounts (`401`) and deactivated
  accounts (`401`).
- **Vendor public visibility:** inactive or deleted vendors are hidden — their shop and
  products are not returned by public endpoints (product listing/detail, shop lookup,
  reviews, category counts, analytics).
- **Products:** visibility is derived from the vendor's state; a vendor's products
  reappear when the vendor is reactivated only if the product itself is active
  (`isActive: true`). A soft-deleted product stays deleted.
- **Automatic deactivation (on account deactivate/delete):** the user's addresses, shop,
  and reviews are set inactive, and affected product ratings are recalculated. Deleting
  an account cannot be undone through the reactivation flow.
- **Reactivation:** only deactivated (not deleted) accounts can be reactivated, via the
  OTP reactivation flow. Success restores the user's related resources (addresses, shop,
  reviews) and recalculates ratings.
- **Admin operations:** an admin can activate/deactivate a vendor; the cascade matches
  self-service behavior. Permanently deleted vendors cannot be reactivated. Admins cannot
  self-deactivate or self-delete through the user endpoints.
- **Order history and cart:** historical orders are preserved. Deactivating or deleting
  an account does not delete orders. The cart requires an active, authenticated customer.

## 15. Response Examples

Register a customer:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"role":"customer","name":"Ada Okafor","email":"ada@example.com","phoneNumber":"08012345678","password":"Passw0rd!"}'
```

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "_id": "665f1c2e5a4b3c1d2e3f4a5b", "name": "Ada Okafor", "email": "ada@example.com", "phoneNumber": "08012345678", "role": "customer", "isActive": true, "deletedAt": null }
}
```

Login:

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"Passw0rd!"}'
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "<jwt>", "user": { "email": "ada@example.com", "role": "customer", "isActive": true, "deletedAt": null } }
}
```

Create a product (vendor):

```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer <vendor-token>" \
  -F "name=Wireless Mouse" \
  -F "description=Ergonomic wireless mouse" \
  -F "price=15000" \
  -F "stock=40" \
  -F "category=665f10005a4b3c1d2e3f4a00" \
  -F "images=@mouse.jpg"
```

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "id": "665f20005a4b3c1d2e3f4a60", "name": "Wireless Mouse", "price": 15000, "inStock": true, "vendorId": "665f0f005a4b3c1d2e3f4000", "rating": 0, "reviewCount": 0 }
}
```

Checkout (customer):

```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Authorization: Bearer <customer-token>" \
  -H "Content-Type: application/json" \
  -d '{"shippingAddress":{"fullName":"Ada Okafor","phone":"08012345678","street":"12 Marina Road","city":"Lagos","state":"Lagos"},"paymentMethod":"cash_on_delivery"}'
```

```json
{
  "success": true,
  "message": "1 order(s) created successfully",
  "data": { "orders": [{ "orderId": "665f40005a4b3c1d2e3f5000", "vendorName": "Chidi Foods", "totalAmount": 30000, "itemCount": 2 }], "totalOrders": 1, "summary": "Your checkout was split into 1 order(s), one per vendor" }
}
```

Error (authentication):

```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

## 16. Environment Configuration

Variable **names** only. Values are never shown. Provide them in `backend/.env`
(see `backend/.env.example`).

| Name | Purpose |
| --- | --- |
| `PORT` | HTTP port the server listens on (default `5000`) |
| `NODE_ENV` | Environment name |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `EXPIRES_IN` | JWT lifetime (e.g. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username / sender address |
| `SMTP_PASS` | SMTP password |
| `APP_NAME` | Display name used in outgoing email |
| `SEED_ADMIN_PASSWORD` | Password used by the first-admin seed script |
| `TEST_MONGODB_URI` | MongoDB URI used only by the integration tests |

`JWT_SECRET` and `EXPIRES_IN` are validated at startup. Missing SMTP configuration does
not prevent the server from starting; it only affects sending OTP emails.

> ⚠️ **Flagged for team decision (not changed):** the route path
> `PUT /api/v1/user/change-Password` uses a capital `P`, unlike the rest of the API
> (lower-case/kebab-case). It is documented above exactly as implemented. Renaming it
> would be a breaking API change, so it was left as-is.

> ⚠️ **Flagged for team decision (not changed):** the Cart/Order schema uses `userId`,
> `customerId`, `productId`, and `shopId`, while `Product` uses the bare field `vendor`.
> These are existing persisted field names; renaming them would break stored data and the
> public contract, so they were documented as-is.