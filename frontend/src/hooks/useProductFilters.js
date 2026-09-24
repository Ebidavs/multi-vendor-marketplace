import { useMemo, useState } from 'react';

import {
  ALL_CATEGORY,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_SORT,
  SORT_OPTIONS,
} from '../utils/constants';

const sanitizePrice = (value, fallback) => {
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }

  return Math.max(0, Math.min(num, DEFAULT_MAX_PRICE));
};

export function useProductFilters(products) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const handleMinPriceChange = (value) => {
    const nextMin = sanitizePrice(value, DEFAULT_MIN_PRICE);
    setMinPrice(nextMin > maxPrice ? maxPrice : nextMin);
  };

  const handleMaxPriceChange = (value) => {
    const nextMax = sanitizePrice(value, DEFAULT_MAX_PRICE);
    setMaxPrice(nextMax < minPrice ? minPrice : nextMax);
  };

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => {
        const titleMatch = (product.title || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === ALL_CATEGORY || product.category === selectedCategory;

        const matchesPrice =
          product.price >= minPrice && product.price <= maxPrice;

        const matchesStock = inStockOnly ? product.inStock : true;

        return titleMatch && matchesCategory && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === SORT_OPTIONS.PRICE_LOW) return a.price - b.price;
        if (sortBy === SORT_OPTIONS.PRICE_HIGH) return b.price - a.price;
        if (sortBy === SORT_OPTIONS.NAME) return a.title.localeCompare(b.title);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(ALL_CATEGORY);
    setMinPrice(DEFAULT_MIN_PRICE);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setInStockOnly(false);
    setSortBy(DEFAULT_SORT);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice: handleMinPriceChange,
    maxPrice,
    setMaxPrice: handleMaxPriceChange,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    filteredProducts,
    handleResetFilters,
  };
}
