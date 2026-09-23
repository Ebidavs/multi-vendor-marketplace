import { useState } from 'react';
import CartBar from './components/CartBar';
import CategoryBar from './components/CategoryBar';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import SearchBar from './components/SearchBar';
import { categoriesList, dummyProducts } from './data/productsData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
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

  // Filter & Sort Logic
  const filteredProducts = dummyProducts
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesStock = !inStockOnly || product.inStock;

      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(500000);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse through categories to find items from verified vendors.
          </p>
        </header>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <CategoryBar
          categories={categoriesList}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FilterSidebar
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            onResetFilters={handleResetFilters}
          />
          <main className="flex-1">
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />
          </main>
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <CartBar cartItems={cartItems} onClearCart={handleClearCart} />
    </div>
  );
}