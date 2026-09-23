import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAddToCart }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No products found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}