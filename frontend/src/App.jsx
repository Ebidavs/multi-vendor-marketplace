import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// Components
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import CartBar from "./components/CartBar";
import ProductDetail from "./components/ProductDetail";
import VendorDetail from "./components/VendorDetail";

// Custom Hooks
import { useCart } from "./hooks/useCart";
import { useProductFilters } from "./hooks/useProductFilters";

// Data & Constants
import { categoriesList, dummyProducts, dummyVendors } from "./data/productsData";

export default function App() {
  const [products] = useState(dummyProducts);

  // Extract Cart State & Actions from Custom Hook
  const {
    cartItems,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  } = useCart();

  // Extract Filter State & Actions from Custom Hook
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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50/60 pb-28 text-gray-900 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link
              to="/products"
              className="text-xl font-extrabold tracking-tight text-gray-900"
            >
              multi-vendor <span className="text-emerald-600">marketplace</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />

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
            element={
              <ProductDetail
                products={products}
                onAddToCart={handleAddToCart}
              />
            }
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

        {/* Floating Bottom Cart Bar */}
        <CartBar
          cartItems={cartItems}
          onClearCart={handleClearCart}
          onIncreaseQuantity={handleIncreaseQuantity}
          onDecreaseQuantity={handleDecreaseQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </BrowserRouter>
  );
}