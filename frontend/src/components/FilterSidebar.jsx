export default function FilterSidebar({
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}) {
  return (
    <aside className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:w-64 md:shrink-0">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onResetFilters}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          Reset All
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {/* Price Range Filter */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Price Range (₦)
          </label>

          {/* Min & Max Number Inputs */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[10px] text-gray-400">Min</span>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            <span className="mt-3 text-gray-400">-</span>
            <div className="flex-1">
              <span className="text-[10px] text-gray-400">Max</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                placeholder="500000"
              />
            </div>
          </div>

          {/* Slider for Max Price (Starts at 0, steps by 1000) */}
          <input
            type="range"
            min="0"
            max="500000"
            step="1000"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>₦0</span>
            <span>₦500,000</span>
          </div>
        </div>

        {/* Stock Status Toggle */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-medium text-gray-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
        </div>
      </div>
    </aside>
  );
}