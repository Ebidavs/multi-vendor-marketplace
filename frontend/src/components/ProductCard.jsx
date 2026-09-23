export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <div>
        <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <span className="absolute top-2 right-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>

        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {product.category}
        </span>
        <h3 className="line-clamp-1 text-base font-semibold text-gray-800 transition-colors group-hover:text-emerald-600">
          {product.title}
        </h3>

        <p className="mt-0.5 text-xs font-medium text-emerald-600">
          By {product.vendorName}
        </p>

        <div className="my-2 flex items-center space-x-1 text-xs">
          <span className="text-amber-400">★</span>
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span className="text-gray-400">({product.reviewsCount})</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-xs text-gray-400">Price</span>
          <p className="text-lg font-bold text-gray-900">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition-colors ${
            product.inStock
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}