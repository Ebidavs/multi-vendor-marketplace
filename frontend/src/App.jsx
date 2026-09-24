import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// Components
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import CartBar from "./components/CartBar";
import ProductDetail from "./components/ProductDetail";

// Data
import { categoriesList, dummyProducts } from "./data/productsData";
import {
  ALL_CATEGORY,
  CART_STORAGE_KEY,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_SORT,
  SORT_OPTIONS,
} from "./utils/constants";

export default function App() {
  // State variables
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter and Search logic
  const filteredProducts = products
    .filter((product) => {
      const titleMatch = (product.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === ALL_CATEGORY || product.category === selectedCategory;
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;
      const matchesStock = inStockOnly ? product.inStock : true;

      return titleMatch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === SORT_OPTIONS.PRICE_LOW) return a.price - b.price;
      if (sortBy === SORT_OPTIONS.PRICE_HIGH) return b.price - a.price;
      if (sortBy === SORT_OPTIONS.NAME) return a.title.localeCompare(b.title);
      return 0;
    });

  // Cart Handler Actions
  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });
  };

  const handleClearCart = () => setCartItems([]);

  const handleIncreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORY);
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setInStockOnly(false);
    setSortBy(DEFAULT_SORT);
  };

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
          {/* Redirect / to /products */}
          <Route path="/" element={<Navigate to="/products" replace />} />

          {/* Main Product Listing */}
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

          {/* Product Detail Route */}
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
            path="*"
            element={
              <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  404 Error
                </p>
                <h1 className="mt-4 text-4xl font-black text-gray-900">
                  Page Not Found
                </h1>
                <p className="mt-3 text-sm text-gray-600">
                  The page you are looking for does not exist or has moved.
                </p>
                <Link
                  to="/products"
                  className="mt-6 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Back to Marketplace
                </Link>
              </div>
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