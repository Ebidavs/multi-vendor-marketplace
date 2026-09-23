export default function ProductCard({ product, onAddToCart }) {
  const { title, price, image, category, inStock } = product;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      <div>
        {/* Image & Stock Badge */}
        <div className="relative mb-3.5 h-48 w-full overflow-hidden rounded-xl bg-gray-100">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              inStock
                ? "bg-emerald-100/90 text-emerald-800 backdrop-blur-sm"
                : "bg-rose-100/90 text-rose-800 backdrop-blur-sm"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Category & Title */}
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
          {category}
        </p>
        <h3 className="mt-1 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-700">
          {title}
        </h3>
      </div>

      {/* Price & Add to Cart */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div>
          <span className="text-[10px] font-medium text-gray-400">Price</span>
          <p className="text-base font-bold text-gray-900">
            ₦{price.toLocaleString()}
          </p>
        </div>

        <button
          disabled={!inStock}
          onClick={() => onAddToCart(product)}
          className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 active:scale-95 ${
            inStock
              ? "bg-gray-900 text-white hover:bg-emerald-600 focus:ring-emerald-400 shadow-sm"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          }`}
        >
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}