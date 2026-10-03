import { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

// Shared Components
import Navbar from "./components/Navbar";
import CartBar from "./components/CartBar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/ResetPassword";

// Marketplace Components
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import ProductDetail from "./components/ProductDetail";
import VendorDetail from "./components/VendorDetail";

// Custom Hooks
import { useCart } from "./hooks/useCart";
import { useProductFilters } from "./hooks/useProductFilters";

// Data
import { categoriesList, dummyProducts, dummyVendors } from "./data/productsData";

export default function App() {
  const location = useLocation();
  const [products] = useState(dummyProducts);

  const {
    cartItems,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCart();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
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

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28 text-gray-900 antialiased">
      {/* Global persistent Navbar */}
      <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      {/* All app routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/products"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <CategoryBar
                categories={categoriesList}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <div className="flex flex-col gap-8 md:flex-row">
                <FilterSidebar
                  minPrice={minPrice}
                  onMinPriceChange={setMinPrice}
                  maxPrice={maxPrice}
                  onMaxPriceChange={setMaxPrice}
                  inStockOnly={inStockOnly}
                  onInStockChange={setInStockOnly}
                  onResetFilters={handleResetFilters}
                />

                <div className="flex-1">
                  <ProductGrid
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              </div>
            </main>
          }
        />

        <Route
          path="/products/:id"
          element={<ProductDetail products={products} onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/vendors/:id"
          element={
            <VendorDetail
              vendors={dummyVendors}
              products={products}
              onAddToCart={handleAddToCart}
            />
          }
        />

        <Route
          path="/marketplace"
          element={<Navigate to="/products" replace />}
        />

        <Route
          path="*"
          element={
            <main className="mx-auto max-w-7xl px-4 py-16 text-center">
              <h1 className="text-4xl font-extrabold text-gray-900">404</h1>
              <p className="mt-2 text-gray-600">Page Not Found</p>
              <Link
                to="/products"
                className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Back to Marketplace
              </Link>
            </main>
          }
        />
      </Routes>

      <CartBar
        cartItems={cartItems}
        onClearCart={handleClearCart}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}