export default function FilterSidebar({
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}) {
  const MAX_LIMIT = 5000000;

  // Handlers with validation clamping
  const handleMinChange = (value) => {
    const numericValue = Number(value);
    // Ensure min price never exceeds the current max price
    if (numericValue > maxPrice) {
      onMinPriceChange(maxPrice);
    } else {
      onMinPriceChange(Math.max(0, numericValue));
    }
  };

  const handleMaxChange = (value) => {
    const numericValue = Number(value);
    // Ensure max price never drops below current min price or exceeds overall cap
    if (numericValue < minPrice) {
      onMaxPriceChange(minPrice);
    } else {
      onMaxPriceChange(Math.min(MAX_LIMIT, numericValue));
    }
  };

  return (
    <aside className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:w-64">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-base font-semibold text-gray-800">Filters</h2>
        <button
          onClick={onResetFilters}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Price Range (₦)
        </h3>

        {/* Min & Max Numeric Inputs */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label className="text-xs text-gray-400">Min</label>
            <input
              type="number"
              min="0"
              max={maxPrice} // Dynamic cap: cannot exceed maxPrice
              value={minPrice}
              onChange={(e) => handleMinChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <span className="mt-5 text-gray-400">-</span>
          <div className="flex-1">
            <label className="text-xs text-gray-400">Max</label>
            <input
              type="number"
              min={minPrice} // Dynamic floor: cannot drop below minPrice
              max={MAX_LIMIT}
              value={maxPrice}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Min Price Range Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Min Slider</span>
            <span>₦{minPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max={maxPrice}
            step="10000"
            value={minPrice}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Max Price Range Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Max Slider</span>
            <span>₦{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={minPrice}
            max={MAX_LIMIT}
            step="10000"
            value={maxPrice}
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}