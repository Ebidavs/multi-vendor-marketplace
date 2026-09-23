import { useState } from "react";
import SearchBar from "./components/SearchBar";
import CategoryBar from "./components/CategoryBar";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import CartBar from "./components/CartBar";

// Sample product mock data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: "Wireless Noise-Canceling Headphones",
    price: 150000,
    category: "Electronics",
    inStock: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Ergonomic Mechanical Keyboard",
    price: 85000,
    category: "Electronics",
    inStock: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Minimalist Leather Backpack",
    price: 45000,
    category: "Fashion",
    inStock: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Ultra-Wide Gaming Monitor 34\"",
    price: 420000,
    category: "Electronics",
    inStock: true,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    title: "Smart Fitness Watch Series 5",
    price: 120000,
    category: "Gadgets",
    inStock: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
  },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Gadgets"];

export default function App() {
  // State variables
  const [products] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [cartItems, setCartItems] = useState([]);

  // Filter and Search logic
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;
      const matchesStock = inStockOnly ? product.inStock : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  // Cart Handler Actions
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleClearCart = () => setCartItems([]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(5000000);
    setInStockOnly(false);
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28 text-gray-900 antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
            Storefront <span className="text-emerald-600">Discovery</span>
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <CategoryBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Sidebar + Product Grid Layout */}
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

      {/* Floating Bottom Cart Bar */}
      <CartBar cartItems={cartItems} onClearCart={handleClearCart} />
    </div>
  );
}