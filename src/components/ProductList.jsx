import React, { useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { PackageX, Sparkles } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

export function ProductList({
  products,
  category,
  searchQuery,
  maxPrice,
  sortBy,
  onAddToCart,
  onQuickView
}) {
  /**
   * HOOK: useMemo
   * 
   * WHY USE IT:
   * Filtering and sorting a collection of items can be computationally intensive,
   * especially as a product catalog expands to hundreds of items.
   * By wrapping this in useMemo with the filter dependencies,
   * React only recalculates the filtered array when one of the actual filtering
   * parameters changes — not when unrelated states (like timers, cart totals, or modals) update.
   */
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filter by category
    let result = products.filter((item) => {
      if (category !== 'All' && item.category !== category) return false;
      return true;
    });

    // 2. Filter by search query (case-insensitive search in name, description, and tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 3. Filter by price ceiling
    result = result.filter((item) => item.price <= maxPrice);

    // 4. Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // Flash deals first, then id
        result.sort((a, b) => (b.isFlashDeal ? 1 : 0) - (a.isFlashDeal ? 1 : 0));
        break;
    }

    return result;
  }, [products, category, searchQuery, maxPrice, sortBy]);

  /**
   * HOOK: useMemo
   * Additional calculation memoized to provide instant metrics
   */
  const metrics = useMemo(() => {
    const count = filteredAndSortedProducts.length;
    const avgPrice = count > 0 
      ? filteredAndSortedProducts.reduce((sum, p) => sum + p.price, 0) / count 
      : 0;
    return { count, avgPrice: avgPrice.toFixed(2) };
  }, [filteredAndSortedProducts]);

  return (
    <section className="product-list-section">
      <div className="product-list-header">
        <div>
          <h2 className="section-title">
            Explore Catalog <span className="item-count">({metrics.count} items)</span>
          </h2>
          <p className="section-subtitle">
            Average price in view: <strong>${metrics.avgPrice}</strong>
          </p>
        </div>
        <HooksBadge hooks={['useMemo (filtered & sorted)', 'useMemo (catalog metrics)']} />
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="empty-catalog">
          <PackageX size={48} className="empty-icon" />
          <h3>No products match your criteria</h3>
          <p>Try adjusting your search terms, raising the max price, or switching categories.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </section>
  );
}
