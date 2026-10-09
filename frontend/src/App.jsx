
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Public / Customer Pages
import Home from "./pages/Home";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/ResetPassword";
import AccountReactivation from "./pages/AccountReactivation";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

// Marketplace Components
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import CartBar from "./components/CartBar";
import CartPage from "./components/CartPage";
import Checkout from "./components/Checkout";
import ProductDetail from "./components/ProductDetail";
import VendorDetail from "./components/VendorDetail";

// Marketplace Hooks / Data
import { useCart } from "./hooks/useCart";
import { useCategories } from "./hooks/useCategories";
import { useProductFilters } from "./hooks/useProductFilters";
import { dummyVendors } from "./data/productsData";
import { getProducts } from "./services/api";
import { toProduct } from "./services/mappers";
import { ALL_CATEGORY } from "./utils/constants";

// Vendor Pages
import VendorRegister from "./pages/vendor/VendorRegister";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorStoreSetup from "./pages/vendor/VendorStoreSetup";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorPersonalProfile from "./pages/vendor/VendorPersonalProfile";
import VendorProducts from "./pages/vendor/VendorProducts";
import AddProduct from "./pages/vendor/AddProduct";
import EditProduct from "./pages/vendor/EditProduct";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorOrderDetails from "./pages/vendor/VendorOrderDetails";
import VendorCustomers from "./pages/vendor/VendorCustomers";
import VendorAnalytics from "./pages/vendor/VendorAnalytics";
import VendorStoreProfile from "./pages/vendor/VendorStoreProfile";
import VendorReviews from "./pages/vendor/VendorReviews";
import VendorSettings from "./pages/vendor/VendorSettings";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

// Responsive pagination
const getPageSize = () => {
  if (window.innerWidth < 640) return 4;
  if (window.innerWidth < 1024) return 8;
  return 12;
};

export default function App() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [productsRetry, setProductsRetry] = useState(0);

  const [cartViewed, setCartViewed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(getPageSize);

  // Cart (localStorage guest cart / backend cart for customers)
  const {
    cartItems,
    cartError,
    notice,
    pendingSync,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
    retryCartSync,
    dismissCartError,
    dismissNotice,
  } = useCart();

  const addToCart = (...args) => {
    setCartViewed(false);
    handleAddToCart(...args);
  };

  const increaseQuantity = (...args) => {
    setCartViewed(false);
    handleIncreaseQuantity(...args);
  };

  // Product filtering
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceFloor,
    priceCeiling,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    filteredProducts,
    handleResetFilters,
  } = useProductFilters(products);

  // Backend categories for the product listing
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    categories: backendCategories,
    loading: categoriesLoading,
    error: categoriesError,
    retry: retryCategories,
  } = useCategories();

  const categoryOptions = useMemo(
    () => [
      { id: ALL_CATEGORY, name: ALL_CATEGORY },
      ...backendCategories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    ],
    [backendCategories]
  );

  // The ?category= query param is the single source of truth so
  // Home category links (/products?category=<id>) and the
  // category bar stay in sync.
  useEffect(() => {
    const categoryParam =
      searchParams.get("category") || ALL_CATEGORY;

    setSelectedCategory((current) =>
      current === categoryParam ? current : categoryParam
    );
    setCurrentPage((page) => (page === 1 ? page : 1));
  }, [searchParams, setSelectedCategory]);

  const handleSelectCategory = (categoryId) => {
    setCurrentPage(1);

    if (categoryId === ALL_CATEGORY) {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  // Pagination
  const pageCount = Math.ceil(
    filteredProducts.length / pageSize
  );

  const pageStart = (currentPage - 1) * pageSize;

  const paginatedProducts = filteredProducts.slice(
    pageStart,
    pageStart + pageSize
  );

  const firstVisiblePage = Math.max(
    1,
    Math.min(currentPage - 2, pageCount - 4)
  );

  const visiblePages = Array.from(
    {
      length: Math.min(pageCount, 5),
    },
    (_, index) => firstVisiblePage + index
  );

  // Load marketplace products (server-side category filtering)
  useEffect(() => {
    let isCurrent = true;

    const categoryQuery =
      selectedCategory !== ALL_CATEGORY
        ? `&category=${encodeURIComponent(selectedCategory)}`
        : "";

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        const firstPage = await getProducts(
          `?page=1&limit=50${categoryQuery}`
        );

        if (!Array.isArray(firstPage?.products)) {
          throw new Error(
            "The product service returned an invalid response."
          );
        }

        const totalPages =
          Number(firstPage.pagination?.pages) || 1;

        const fetchedProducts = [
          ...firstPage.products,
        ];

        for (
          let page = 2;
          page <= totalPages;
          page += 1
        ) {
          const pageResult = await getProducts(
            `?page=${page}&limit=50${categoryQuery}`
          );

          if (!Array.isArray(pageResult?.products)) {
            throw new Error(
              "The product service returned an invalid response."
            );
          }

          fetchedProducts.push(
            ...pageResult.products
          );
        }

        if (isCurrent) {
          setProducts(
            fetchedProducts.map(toProduct)
          );
        }
      } catch (error) {
        if (isCurrent) {
          setProductsError(
            error.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (isCurrent) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, [productsRetry, selectedCategory]);

  // Responsive page size
  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(getPageSize());
    };

    window.addEventListener(
      "resize",
      updatePageSize
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePageSize
      );
    };
  }, []);

  // Marketplace
  const marketplacePage = (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Search */}
      <div>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Categories (loaded from the backend) */}
      <div className="py-2">
        {categoriesError ? (
          <div
            className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
            role="alert"
          >
            <span>{categoriesError}</span>
            <button
              type="button"
              onClick={retryCategories}
              className="shrink-0 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {categoriesLoading && (
              <p
                className="mb-1 text-center text-xs text-gray-400"
                role="status"
              >
                Loading categories...
              </p>
            )}
            <CategoryBar
              categories={categoryOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </>
        )}
      </div>

      {/* Products and filters */}
      <div className="flex flex-col gap-8 pt-2 xl:flex-row">
        <FilterSidebar
          priceFloor={priceFloor}
          priceCeiling={priceCeiling}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          onResetFilters={handleResetFilters}
        />

        <div className="flex-1">
          {productsLoading ? (
            <p
              className="py-8 text-center text-sm text-gray-500"
              role="status"
            >
              Loading products...
            </p>
          ) : productsError ? (
            <div
              className="py-8 text-center"
              role="alert"
            >
              <p className="text-sm text-gray-600">
                {productsError}
              </p>

              <button
                type="button"
                onClick={() =>
                  setProductsRetry(
                    (retry) => retry + 1
                  )
                }
                className="mt-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          ) : (
            <ProductGrid
              products={paginatedProducts}
              cartItems={cartItems}
              onAddToCart={addToCart}
              onIncreaseQuantity={
                increaseQuantity
              }
              onDecreaseQuantity={
                handleDecreaseQuantity
              }
            />
          )}

          {/* Pagination */}
          {!productsLoading &&
            !productsError &&
            pageCount > 1 && (
              <nav
                aria-label="Product pages"
                className="mt-8 flex flex-wrap justify-center gap-1 sm:gap-2"
              >
                {pageCount > 5 && (
                  <>
                    <button
                      type="button"
                      aria-label="First page"
                      onClick={() =>
                        setCurrentPage(1)
                      }
                      disabled={
                        currentPage === 1
                      }
                      className="h-11 min-w-11 rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      |&lt;
                    </button>

                    <button
                      type="button"
                      aria-label="Previous page"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1
                            )
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                      className="h-11 min-w-11 rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      &lt;
                    </button>
                  </>
                )}

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    aria-label={`Page ${page}`}
                    aria-current={
                      currentPage === page
                        ? "page"
                        : undefined
                    }
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`h-11 min-w-11 rounded-md border px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-emerald-600 hover:text-emerald-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {pageCount > 5 && (
                  <>
                    <button
                      type="button"
                      aria-label="Next page"
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              pageCount,
                              page + 1
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        pageCount
                      }
                      className="h-11 min-w-11 rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      &gt;
                    </button>

                    <button
                      type="button"
                      aria-label="Last page"
                      onClick={() =>
                        setCurrentPage(
                          pageCount
                        )
                      }
                      disabled={
                        currentPage ===
                        pageCount
                      }
                      className="h-11 min-w-11 rounded-md border border-gray-200 bg-white px-2 text-gray-700 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      &gt;|
                    </button>
                  </>
                )}
              </nav>
            )}
        </div>
      </div>

      {/* Cart feedback banner (errors keep a Retry action while a
          guest cart is still waiting to sync) */}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2">
        {notice && (
          <div
            role="status"
            className="pointer-events-auto flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg"
          >
            <span>{notice.text}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={dismissNotice}
              className="shrink-0 font-bold text-emerald-700 hover:text-emerald-900"
            >
              ✕
            </button>
          </div>
        )}

        {cartError && (
          <div
            role="alert"
            className="pointer-events-auto flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg"
          >
            <span>{cartError}</span>
            <div className="flex shrink-0 items-center gap-2">
              {pendingSync && (
                <button
                  type="button"
                  onClick={retryCartSync}
                  className="font-semibold underline"
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={dismissCartError}
                className="font-bold text-red-700 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart bar */}
      <CartBar
        cartItems={cartItems}
        onClearCart={handleClearCart}
        onIncreaseQuantity={
          handleIncreaseQuantity
        }
        onDecreaseQuantity={
          handleDecreaseQuantity
        }
        onRemoveItem={handleRemoveItem}
        onCheckout={() =>
          navigate("/checkout")
        }
      />
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar
        cartCount={
          cartViewed
            ? 0
            : cartItems.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              )
        }
        onCartClick={() =>
          setCartViewed(true)
        }
      />

      <Routes>
        {/* PUBLIC / CUSTOMER */}

        <Route
          path="/"
          element={<Home onAddToCart={addToCart} />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* New account reactivation page */}
        <Route
          path="/reactivate-account"
          element={<AccountReactivation />}
        />

        <Route
          path="/products"
          element={marketplacePage}
        />

        <Route
          path="/marketplace"
          element={marketplacePage}
        />

        <Route
          path="/orders"
          element={<OrderHistoryPage />}
        />

        <Route
          path="/orders/:orderId"
          element={<OrderTrackingPage />}
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              onClearCart={handleClearCart}
              onIncreaseQuantity={
                handleIncreaseQuantity
              }
              onDecreaseQuantity={
                handleDecreaseQuantity
              }
              onRemoveItem={
                handleRemoveItem
              }
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              onClearCart={handleClearCart}
            />
          }
        />

        <Route
          path="/products/:id"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <ProductDetail
                products={products}
                onAddToCart={addToCart}
              />
            </main>
          }
        />

        <Route
          path="/vendors/:id"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <VendorDetail
                vendors={dummyVendors}
                products={products}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onIncreaseQuantity={
                  increaseQuantity
                }
                onDecreaseQuantity={
                  handleDecreaseQuantity
                }
              />
            </main>
          }
        />

        {/* VENDOR AUTHENTICATION */}

        <Route
          path="/vendor/login"
          element={<VendorLogin />}
        />

        <Route
          path="/vendor/register"
          element={<VendorRegister />}
        />

        {/* PROTECTED VENDOR ROUTES */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="vendor"
            />
          }
        >
          <Route
            path="/vendor"
            element={
              <Navigate
                to="/vendor/dashboard"
                replace
              />
            }
          />

          <Route
            path="/vendor/setup"
            element={<VendorStoreSetup />}
          />

          <Route
            path="/vendor/dashboard"
            element={<VendorDashboard />}
          />

          <Route
            path="/vendor/personal-profile"
            element={
              <VendorPersonalProfile />
            }
          />

          <Route
            path="/vendor/products"
            element={<VendorProducts />}
          />

          <Route
            path="/vendor/products/new"
            element={<AddProduct />}
          />

          <Route
            path="/vendor/products/:id/edit"
            element={<EditProduct />}
          />

          <Route
            path="/vendor/orders"
            element={<VendorOrders />}
          />

          <Route
            path="/vendor/orders/:orderId"
            element={
              <VendorOrderDetails />
            }
          />

          <Route
            path="/vendor/profile"
            element={<VendorStoreProfile />}
          />

          <Route
            path="/vendor/customers"
            element={<VendorCustomers />}
          />

          <Route
            path="/vendor/analytics"
            element={<VendorAnalytics />}
          />

          <Route
            path="/vendor/reviews"
            element={<VendorReviews />}
          />

          <Route
            path="/vendor/settings"
            element={<VendorSettings />}
          />
        </Route>

        {/* ADMIN AUTHENTICATION */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN ROUTES */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="admin"
            />
          }
        >
          <Route
            path="/admin"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/vendors"
            element={<AdminVendors />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/reports"
            element={<AdminReports />}
          />

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />
        </Route>

        {/* PROTECTED CUSTOMER ACCOUNT ROUTES */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="customer"
            />
          }
        >
          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

          <Route
            path="/help"
            element={<HelpPage />}
          />
        </Route>

        {/* 404 PAGE */}

        <Route
          path="*"
          element={
            <main className="mx-auto max-w-7xl px-4 py-16 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900">
                404
              </h1>

              <p className="mt-2 text-gray-600">
                Page Not Found
              </p>

              <Link
                to="/products"
                className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
              >
                Back to Marketplace
              </Link>
            </main>
          }
        />
      </Routes>
    </div>
  );
}
