import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, Zap, ShieldCheck, Truck } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

/**
 * HOOK: useImperativeHandle + forwardRef
 * 
 * WHY USE IT:
 * In React, data normally flows downwards via props. However, certain UI components
 * like dialogs, video players, or canvas overlays are inherently imperative.
 * With useImperativeHandle, this component exposes a clean custom API to its parent:
 * - ref.current.open(product)
 * - ref.current.close()
 * - ref.current.shake()
 * 
 * This keeps the parent component cleanly decoupled from the modal's internal
 * animation triggers and quantity state!
 */
export const QuickViewModal = forwardRef(function QuickViewModal({ onAddToCart }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isShaking, setIsShaking] = useState(false);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    open: (targetProduct) => {
      setProduct(targetProduct);
      setQuantity(1);
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
    shake: () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  }), []);

  /**
   * HOOK: useEffect
   * Side effects for Modal:
   * 1. Close on Escape key press
   * 2. Lock background window scroll while modal is visible
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else {
      // Trigger imperative shake animation if user exceeds available stock
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddAndClose = () => {
    onAddToCart(product, quantity);
    setIsOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
      <div
        className={`modal-dialog ${isShaking ? 'animate-shake' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-content-grid">
          {/* Product Image */}
          <div className="modal-image-wrapper">
            <img src={product.image} alt={product.name} className="modal-image" />
            {product.isFlashDeal && (
              <span className="modal-deal-tag">
                <Zap size={14} /> Flash Deal Item
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="modal-details">
            <div className="modal-header">
              <span className="modal-category">{product.category}</span>
              <h2 className="modal-product-title">{product.name}</h2>
              <div className="modal-ratings-row">
                <Star size={16} className="star-filled" />
                <span className="rating-bold">{product.rating}</span>
                <span className="reviews-gray">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <div className="modal-price-row">
              <span className="modal-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="modal-original-price">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="modal-stock-badge">
                {product.stock} in stock
              </span>
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Tags */}
            <div className="modal-tags">
              {product.tags?.map((tag) => (
                <span key={tag} className="product-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-control-group">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-box">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="qty-subtotal">
                Subtotal: <strong>${(product.price * quantity).toFixed(2)}</strong>
              </span>
            </div>

            {/* Actions */}
            <div className="modal-actions-row">
              <button
                type="button"
                className="modal-add-btn"
                onClick={handleAddAndClose}
              >
                <ShoppingBag size={18} /> Add {quantity} to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="trust-features">
              <div className="trust-item">
                <Truck size={15} /> Free express shipping over $150
              </div>
              <div className="trust-item">
                <ShieldCheck size={15} /> 30-day money-back guarantee
              </div>
            </div>

            <div className="modal-hooks-explanation">
              <HooksBadge hooks={['useImperativeHandle', 'forwardRef', 'useEffect (keys & scroll)', 'useState']} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
