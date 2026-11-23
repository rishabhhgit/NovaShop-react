import React, { useId, useTransition } from 'react';
import { CATEGORIES } from '../data/products';
import { Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

export function ProductFilters({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
  sortBy,
  onSortChange,
  isTransitionPending
}) {
  /**
   * HOOK: useId
   * 
   * WHY USE IT:
   * Generates unique, stable, clash-free IDs for form controls and accessibility labels.
   * Eliminates hardcoded IDs like 'price-input' that cause duplicate ID collisions
   * if multiple instances of this filter are mounted (e.g. mobile drawer + desktop sidebar).
   */
  const priceRangeId = useId();
  const sortSelectId = useId();

  return (
    <div className="filters-card">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={18} />
          <span>Catalog Filters</span>
          {isTransitionPending && (
            <span className="transition-pending-badge" title="useTransition isPending in action">
              <Loader2 size={13} className="animate-spin" /> Updating...
            </span>
          )}
        </div>
        <HooksBadge hooks={['useTransition', 'useId']} />
      </div>

      {/* Category Pills */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <div className="category-pills">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`category-pill ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="filter-group">
        <div className="filter-label-row">
          <label htmlFor={priceRangeId} className="filter-label">
            Max Price: <span className="highlight-price">${maxPrice}</span>
          </label>
        </div>
        <input
          id={priceRangeId}
          type="range"
          min="30"
          max="350"
          step="10"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="price-slider"
        />
        <div className="slider-limits">
          <span>$30</span>
          <span>$350</span>
        </div>
      </div>

      {/* Sort Options */}
      <div className="filter-group">
        <label htmlFor={sortSelectId} className="filter-label">
          Sort By
        </label>
        <div className="select-wrapper">
          <SlidersHorizontal size={15} className="select-icon" />
          <select
            id={sortSelectId}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="featured">Featured / Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
