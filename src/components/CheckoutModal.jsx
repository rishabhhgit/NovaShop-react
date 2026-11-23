import React, { useState, useId, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Lock, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { HooksBadge } from './HooksBadge';

export function CheckoutModal({ isOpen, onClose }) {
  const { summary, clearCart } = useCart();
  const { showNotification } = useNotification();

  /**
   * HOOK: useId
   * 
   * WHY USE IT:
   * Generates reliable unique IDs prefixing each form field and its <label>.
   * Ensures 100% WCAG accessibility compliance without hardcoding IDs or
   * risking clashes with other forms on the page.
   */
  const nameId = useId();
  const emailId = useId();
  const addressId = useId();
  const cardId = useId();
  const expiryId = useId();

  const [formData, setFormData] = useState({
    name: 'Alex Developer',
    email: 'alex@reactmastery.dev',
    address: '742 Evergreen Terrace, Tech City',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOrderComplete(false);
      setIsSubmitting(false);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async payment gateway call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
      showNotification(`Order placed successfully! Amount: $${summary.total.toFixed(2)}`, 'success');
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-dialog" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close checkout">
          <X size={20} />
        </button>

        {orderComplete ? (
          <div className="order-success-screen">
            <div className="success-icon-badge">
              <CheckCircle size={48} />
            </div>
            <h2>Order Confirmed!</h2>
            <p className="order-number">Order #ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
            <p className="order-thankyou">
              Thank you, <strong>{formData.name}</strong>! We sent the receipt and tracking info to{' '}
              <strong>{formData.email}</strong>.
            </p>
            <div className="success-hooks-note">
              <Sparkles size={16} /> Order placed using React State + Reducer reset!
            </div>
            <button type="button" className="continue-shopping-btn" onClick={onClose}>
              Back to Store
            </button>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-header">
              <h2>Secure Checkout</h2>
              <p>Complete your purchase of <strong>{summary.totalItems} items</strong>.</p>
              <HooksBadge hooks={['useId (all form inputs)', 'useState', 'useCart', 'useNotification']} />
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Customer Info */}
              <div className="form-section">
                <h4 className="form-section-title">1. Shipping Information</h4>
                
                <div className="form-field">
                  <label htmlFor={nameId}>Full Name</label>
                  <input
                    id={nameId}
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor={emailId}>Email Address</label>
                  <input
                    id={emailId}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor={addressId}>Shipping Address</label>
                  <input
                    id={addressId}
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="form-section">
                <h4 className="form-section-title">2. Payment Method</h4>
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor={cardId}>Card Number</label>
                    <div className="input-with-icon">
                      <CreditCard size={16} className="field-icon" />
                      <input
                        id={cardId}
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor={expiryId}>Expiry Date</label>
                    <input
                      id={expiryId}
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Summary banner */}
              <div className="checkout-amount-bar">
                <span>Total Due:</span>
                <span className="total-highlight">${summary.total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="pay-now-btn"
                disabled={isSubmitting || summary.totalItems === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={16} /> Pay ${summary.total.toFixed(2)} Now
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
