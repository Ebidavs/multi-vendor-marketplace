export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="no-scrollbar mb-6 flex space-x-2 overflow-x-auto pb-2">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all focus:outline-none ${
              isSelected
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}