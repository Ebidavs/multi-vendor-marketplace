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

  const sanitizePrice = (value, fallback) => {
    if (value === '' || value === null || value === undefined) return fallback;

    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;

    return Math.max(0, Math.min(num, MAX_LIMIT));
  };

  const handleMinChange = (val) => {
    const nextMin = sanitizePrice(val, 0);
    const safeMin = nextMin > maxPrice ? maxPrice : nextMin;
    onMinPriceChange(Math.max(0, safeMin));
  };

  const handleMaxChange = (val) => {
    const nextMax = sanitizePrice(val, MAX_LIMIT);
    const safeMax = nextMax < minPrice ? minPrice : nextMax;
    onMaxPriceChange(Math.min(MAX_LIMIT, safeMax));
  };

  return (
    <aside className="w-full rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all md:w-64">
      <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3.5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
          Filters
        </h2>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Price Range (₦)
        </h3>

        {/* Inputs */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-gray-400">
              Min
            </label>
            <input
              type="number"
              min="0"
              max={maxPrice}
              value={minPrice}
              onChange={(e) => handleMinChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-medium text-gray-800 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <span className="mt-4 text-gray-300">-</span>
          <div className="flex-1">
            <label className="text-[10px] font-semibold uppercase text-gray-400">
              Max
            </label>
            <input
              type="number"
              min={minPrice}
              max={MAX_LIMIT}
              value={maxPrice}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-xs font-medium text-gray-800 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="mb-1 flex justify-between text-[11px] font-medium text-gray-500">
              <span>Min Slider</span>
              <span className="font-semibold text-gray-700">
                ₦{(minPrice || 0).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice}
              step="10000"
              value={minPrice || 0}
              onChange={(e) => handleMinChange(e.target.value)}
              className="w-full cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between text-[11px] font-medium text-gray-500">
              <span>Max Slider</span>
              <span className="font-semibold text-gray-700">
                ₦{(maxPrice || 0).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={minPrice}
              max={MAX_LIMIT}
              step="10000"
              value={maxPrice || MAX_LIMIT}
              onChange={(e) => handleMaxChange(e.target.value)}
              className="w-full cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Stock Checkbox */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <label className="group flex cursor-pointer items-center space-x-3">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 transition focus:ring-emerald-500"
          />
          <span className="text-xs font-medium text-gray-700 transition-colors group-hover:text-emerald-700">
            In Stock Only
          </span>
        </label>
      </div>
    </aside>
  );
}