import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Check, Zap } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

/**
 * React.memo Optimization
 * 
 * WHY:
 * Wraps the component so it only re-renders if its props change.
 * When parent component re-renders (e.g. typing in search, updating a timer),
 * because parent passed memoized `onAddToCart` and `onQuickView` via useCallback,
 * these cards skip unnecessary re-renders.
 */
export const ProductCard = React.memo(function ProductCard({ product, onAddToCart, onQuickView }) {
  /**
   * HOOK: useState
   * WHY USE IT:
   * Local ephemeral UI state to show visual button confirmation ("Added! ✓")
   * for 1.2 seconds without bloating global or parent state.
   */
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="product-card group">
      {/* Product Image & Badges */}
      <div className="product-image-container" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-image"
        />
        
        {product.isFlashDeal && (
          <span className="product-badge-deal">
            <Zap size={12} /> Hot Deal
          </span>
        )}

        <span className="product-badge-category">{product.category}</span>

        {/* Quick View Overlay Button */}
        <button
          type="button"
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          title="Quick View (Demonstrates useImperativeHandle)"
        >
          <Eye size={16} /> Quick View
        </button>
      </div>

      {/* Content */}
      <div className="product-body">
        <div className="product-rating">
          <div className="stars">
            <Star size={14} className="star-filled" />
            <span className="rating-score">{product.rating}</span>
          </div>
          <span className="reviews-count">({product.reviewsCount} reviews)</span>
          <span className={`stock-status ${product.stock <= 10 ? 'low-stock' : ''}`}>
            {product.stock <= 10 ? `Only ${product.stock} left!` : 'In Stock'}
          </span>
        </div>

        <h3 className="product-title" onClick={() => onQuickView(product)}>
          {product.name}
        </h3>

        <p className="product-description">{product.description}</p>

        {/* Pricing & Add to Cart */}
        <div className="product-footer">
          <div className="price-block">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            className={`add-cart-btn ${justAdded ? 'success' : ''}`}
            onClick={handleAdd}
            disabled={justAdded}
            title="Add to shopping cart"
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>

        <div className="card-hook-tag">
          <HooksBadge hooks={['React.memo', 'useState', 'useCallback (consumer)']} />
        </div>
      </div>
    </article>
  );
});
