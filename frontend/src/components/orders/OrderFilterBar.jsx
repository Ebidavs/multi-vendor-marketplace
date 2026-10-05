const FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered'];

export default function OrderFilterBar({ activeFilter, onFilterChange, searchTerm, onSearchChange }) {
  return (
    <div className="ord-filter">
      <input
        type="text"
        placeholder="Search by order ID..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="ord-search"
      />
      <div className="ord-filter-buttons">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`ord-filter-btn ${activeFilter === filter ? 'ord-filter-btn--active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}