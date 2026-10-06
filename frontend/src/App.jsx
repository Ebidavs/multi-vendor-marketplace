import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Public / Customer Pages
import Home from "./pages/Home";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/ResetPassword";

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
import { useProductFilters } from "./hooks/useProductFilters";
import {
  categoriesList,
  dummyVendors,
} from "./data/productsData";
import { getProducts } from "./services/api";
import { toProduct } from "./services/mappers";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

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

  const {
    cartItems,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCart();

  const addToCart = (...args) => {
    setCartViewed(false);
    handleAddToCart(...args);
  };

  const increaseQuantity = (...args) => {
    setCartViewed(false);
    handleIncreaseQuantity(...args);
  };

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

  const pageCount = Math.ceil(
    filteredProducts.length / pageSize
  );

  const pageStart =
    (currentPage - 1) * pageSize;

  const paginatedProducts =
    filteredProducts.slice(
      pageStart,
      pageStart + pageSize
    );

  const firstVisiblePage = Math.max(
    1,
    Math.min(
      currentPage - 2,
      pageCount - 4
    )
  );

  const visiblePages = Array.from(
    {
      length: Math.min(pageCount, 5),
    },
    (_, index) =>
      firstVisiblePage + index
  );

  useEffect(() => {
    let isCurrent = true;

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        const firstPage = await getProducts("?page=1&limit=50");
        if (!Array.isArray(firstPage?.products)) {
          throw new Error("The product service returned an invalid response.");
        }

        const totalPages = Number(firstPage.pagination?.pages) || 1;
        const fetchedProducts = [...firstPage.products];

        for (let page = 2; page <= totalPages; page += 1) {
          const pageResult = await getProducts(`?page=${page}&limit=50`);
          if (!Array.isArray(pageResult?.products)) {
            throw new Error("The product service returned an invalid response.");
          }
          fetchedProducts.push(...pageResult.products);
        }

        if (isCurrent) {
          setProducts(fetchedProducts.map(toProduct));
        }
      } catch (error) {
        if (isCurrent) {
          setProductsError(error.message || "Unable to load products.");
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
  }, [productsRetry]);

  useEffect(() => {
    const updatePageSize = () =>
      setPageSize(getPageSize());

    window.addEventListener(
      "resize",
      updatePageSize
    );

    return () =>
      window.removeEventListener(
        "resize",
        updatePageSize
      );
  }, []);

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

      {/* Categories */}
      <div className="py-2">
        <CategoryBar
          categories={categoriesList}
          selectedCategory={
            selectedCategory
          }
          onSelectCategory={
            setSelectedCategory
          }
        />
      </div>

      {/* Products / Filters */}
      <div className="flex flex-col gap-8 pt-2 xl:flex-row">
        <FilterSidebar
          priceFloor={priceFloor}
          priceCeiling={priceCeiling}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          inStockOnly={inStockOnly}
          onInStockChange={
            setInStockOnly
          }
          onResetFilters={
            handleResetFilters
          }
        />

        <div className="flex-1">
          {productsLoading ? (
            <p className="py-8 text-center text-sm text-gray-500" role="status">
              Loading products...
            </p>
          ) : productsError ? (
            <div className="py-8 text-center" role="alert">
              <p className="text-sm text-gray-600">{productsError}</p>
              <button
                type="button"
                onClick={() => setProductsRetry((retry) => retry + 1)}
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

          {!productsLoading && !productsError && pageCount > 1 && (
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

              {visiblePages.map(
                (page) => (
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
                )
              )}

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

      <CartBar
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
        onCheckout={() =>
          navigate("/checkout")
        }
      />
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Current main navigation */}
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
        {/* =========================
            PUBLIC / CUSTOMER
        ========================= */}

        <Route
          path="/"
          element={<Home />}
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
              onClearCart={
                handleClearCart
              }
              onIncreaseQuantity={
                increaseQuantity
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
              onClearCart={
                handleClearCart
              }
            />
          }
        />

        <Route
          path="/products/:id"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <ProductDetail
                products={products}
                onAddToCart={
                  addToCart
                }
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
                onAddToCart={
                  addToCart
                }
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

        {/* =========================
            VENDOR
        ========================= */}

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
          path="/vendor/dashboard"
          element={
            <VendorDashboard />
          }
        />

        <Route
          path="/vendor/products"
          element={
            <VendorProducts />
          }
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
          element={
            <VendorStoreProfile />
          }
        />

        <Route
          path="/vendor/customers"
          element={
            <VendorCustomers />
          }
        />

        <Route
          path="/vendor/analytics"
          element={
            <VendorAnalytics />
          }
        />

        <Route
          path="/vendor/reviews"
          element={<VendorReviews />}
        />

        <Route
          path="/vendor/settings"
          element={<VendorSettings />}
        />

        {/* =========================
            ADMIN
        ========================= */}

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
          element={
            <AdminDashboard />
          }
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
          element={
            <AdminCategories />
          }
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

        {/* =========================
            404
        ========================= */}

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