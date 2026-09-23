export default function CategoryBar({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto border-b border-gray-200 pb-3 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}