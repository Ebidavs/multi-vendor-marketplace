import { useState, useMemo } from "react";
import {
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  DEFAULT_CATEGORY,
  DEFAULT_SORT,
} from "../utils/constants";

export function useProductFilters(initialProducts = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const titleMatch = (product.title || product.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === DEFAULT_CATEGORY ||
          product.category === selectedCategory;
        const matchesPrice =
          product.price >= minPrice && product.price <= maxPrice;
        const matchesStock = inStockOnly ? product.inStock : true;

        return titleMatch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name")
          return (a.title || a.name || "").localeCompare(b.title || b.name || "");
        return 0;
      });
  }, [initialProducts, searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(DEFAULT_CATEGORY);
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setInStockOnly(false);
    setSortBy(DEFAULT_SORT);
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    // Derived Data & Actions
    filteredProducts,
    handleResetFilters,
  };
}