import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/products";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import CartBar from "./components/CartBar";
import ProductDetail from "./components/ProductDetail";
import VendorDetail from "./components/VendorDetail";
import { useCart } from "./hooks/useCart";
import { useProductFilters } from "./hooks/useProductFilters";
import { categoriesList, dummyProducts, dummyVendors } from "./data/productsData";

export default function App() {
  const [products] = useState(dummyProducts);
  const [cartViewed, setCartViewed] = useState(false);

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

  const marketplacePage = (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Search Bar */}
      <div>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* 2. Category Bar with top/bottom separation */}
      <div className="py-2">
        <CategoryBar
          categories={categoriesList}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 3. Main Grid & Filters */}
      <div className="flex flex-col gap-8 md:flex-row pt-2">
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
            cartItems={cartItems}
            onAddToCart={addToCart}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
          />
        </div>
      </div>

      {/* 4. Cart Sidebar / Drawer */}
      <CartBar
        cartItems={cartItems}
        onClearCart={handleClearCart}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </main>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Persistent Navbar across all routes */}
      <Navbar
        cartCount={cartViewed ? 0 : cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartViewed(true)}
      />

      {/* Routes setup */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={marketplacePage} />
        <Route path="/marketplace" element={marketplacePage} />
        <Route
          path="/cart"
          element={
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>
              <CartBar
                cartItems={cartItems}
                onClearCart={handleClearCart}
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </main>
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
                onIncreaseQuantity={increaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </main>
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
                className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors"
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