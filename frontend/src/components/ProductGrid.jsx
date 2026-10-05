import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  cartItems,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  const getPageSize = () => {
    if (window.matchMedia("(max-width: 639px)").matches) return 4;
    if (window.matchMedia("(max-width: 1023px)").matches) return 8;
    return 12;
  };
  const [pageSize, setPageSize] = useState(getPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil((products?.length || 0) / pageSize);
  const pageProducts = products?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const updatePageSize = () => setPageSize(getPageSize());
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [products, pageSize]);

  useEffect(() => {
    if (currentPage > pageCount && pageCount > 0) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  if (!products || products.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          🔍
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          No products found
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Try adjusting your search terms, price limits, or active filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            cartItems={cartItems}
            onAddToCart={onAddToCart}
            onIncreaseQuantity={onIncreaseQuantity}
            onDecreaseQuantity={onDecreaseQuantity}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Product pages"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              onClick={() => setCurrentPage(page)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                currentPage === page
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
}