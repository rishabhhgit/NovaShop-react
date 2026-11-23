import React, { useState, useRef, useEffect, useId } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { HooksBadge } from './HooksBadge';

export function CartDrawer({ isOpen, onClose, onOpenCheckout }) {
  const { cart, summary, coupon, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  /**
   * HOOK: useId
   * Accessible unique ID for promo code input
   */
  const couponInputId = useId();

  /**
   * HOOK: useRef
   * Auto-focus the checkout button when drawer slides in for keyboard accessibility
   */
  const checkoutBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus checkout button if items exist
      setTimeout(() => {
        checkoutBtnRef.current?.focus();
      }, 200);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    if (['SAVE20', 'HALFOFF', 'FREESHIP'].includes(code)) {
      applyCoupon(code);
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try: SAVE20, HALFOFF, or FREESHIP');
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} />
            <h2 className="drawer-title">Shopping Cart</h2>
            <span className="drawer-count-badge">({summary.totalItems})</span>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Hook indicator */}
        <div className="drawer-hook-bar">
          <HooksBadge hooks={['useCart (useReducer + useContext)', 'useId', 'useRef', 'useEffect', 'useState']} />
        </div>

        {/* Cart Items List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button type="button" className="empty-shop-btn" onClick={onClose}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        type="button"
                        className="item-delete-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-price">${item.price.toFixed(2)}</div>

                    <div className="cart-item-bottom">
                      <div className="cart-qty-pill">
                        <button
                          type="button"
                          className="qty-step-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-step-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary, Coupons & Checkout) */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo code form */}
            <form onSubmit={handleApplyCoupon} className="coupon-form">
              <label htmlFor={couponInputId} className="sr-only">Promo Code</label>
              <div className="coupon-input-wrapper">
                <Tag size={16} className="coupon-icon" />
                <input
                  id={couponInputId}
                  type="text"
                  placeholder="Promo code (SAVE20, HALFOFF)"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError('');
                  }}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-apply-btn">
                  Apply
                </button>
              </div>
              {couponError && <p className="coupon-error-text">{couponError}</p>}
            </form>

            {/* Active Coupon Badge */}
            {coupon && (
              <div className="active-coupon-badge">
                <span>Applied: <strong>{coupon.code}</strong> ({coupon.label})</span>
                <button type="button" onClick={removeCoupon} className="remove-coupon-btn">
                  Remove
                </button>
              </div>
            )}

            {/* Financial Summary */}
            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${summary.subtotal.toFixed(2)}</span>
              </div>

              {summary.discount > 0 && (
                <div className="summary-row discount">
                  <span>Coupon Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {summary.shipping === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    `$${summary.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Grand Total</span>
                <span className="total-amount">${summary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout & Clear Buttons */}
            <div className="drawer-buttons-group">
              <button
                ref={checkoutBtnRef}
                type="button"
                className="checkout-btn"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                Proceed to Checkout <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>

            <div className="drawer-trust-hint">
              <ShieldCheck size={14} /> 256-bit Encrypted Checkout • Free 30-Day Returns
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
