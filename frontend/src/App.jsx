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

export default function App() {
  // State variables
  const [products] = useState(dummyProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter and Search logic
  const filteredProducts = products
    .filter((product) => {
      const titleMatch = (product.title || product.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;
      const matchesStock = inStockOnly ? product.inStock : true;

      return titleMatch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name")
        return (a.title || a.name || "").localeCompare(b.title || b.name || "");
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
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(5000000);
    setInStockOnly(false);
    setSortBy("default");
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