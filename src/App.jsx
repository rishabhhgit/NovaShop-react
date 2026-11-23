import React, { useState, useRef, useTransition, useDeferredValue, useCallback } from 'react';
import { PRODUCTS } from './data/products';
import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FlashSaleTimer } from './components/FlashSaleTimer';
import { ProductFilters } from './components/ProductFilters';
import { ProductList } from './components/ProductList';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { HooksGuideModal } from './components/HooksGuideModal';
import { HooksBadge } from './components/HooksBadge';

function EcommerceStore() {
  /**
   * HOOK: useState
   * Manages local UI states: search query, active category, price boundary,
   * sort order, and visibility toggles for modals and drawers.
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('featured');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  /**
   * HOOK: useDeferredValue
   * 
   * WHY USE IT:
   * As the user types in the search bar, searchQuery updates instantly to keep
   * the text field responsive.
   * Meanwhile, deferredSearchQuery lags slightly behind, deferring the heavy
   * product filtering computation until the user finishes rapid typing!
   */
  const deferredSearchQuery = useDeferredValue(searchQuery);

  /**
   * HOOK: useTransition
   * 
   * WHY USE IT:
   * When switching product categories or sorting options, wrapping the state setter
   * inside startTransition marks the update as a non-blocking, interruptible transition.
   * If the user clicks multiple categories quickly, React won't freeze the UI.
   * isPending lets us show a subtle loading spinner indicator.
   */
  const [isPending, startTransition] = useTransition();

  const handleCategorySelect = (category) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  const handleSortChange = (newSort) => {
    startTransition(() => {
      setSortBy(newSort);
    });
  };

  /**
   * Context hooks
   */
  const { addToCart, applyCoupon } = useCart();
  const { showNotification } = useNotification();

  /**
   * HOOK: useRef (Imperative Handle Target)
   * 
   * WHY USE IT:
   * Connects to the QuickViewModal's useImperativeHandle.
   * Gives parent code direct access to `quickViewRef.current.open(product)`.
   */
  const quickViewRef = useRef(null);
  const productsSectionRef = useRef(null);

  /**
   * HOOK: useCallback
   * 
   * WHY USE IT:
   * Memoizes callbacks passed down to ProductCard (which is wrapped in React.memo).
   * Prevents re-creating new function references on every render, keeping ProductCards
   * from re-rendering when typing in search or when the flash sale timer ticks.
   */
  const handleAddToCart = useCallback((product, qty = 1) => {
    addToCart(product, qty);
    showNotification(`Added ${qty} × "${product.name}" to your cart!`, 'success');
  }, [addToCart, showNotification]);

  const handleQuickView = useCallback((product) => {
    quickViewRef.current?.open(product);
  }, []);

  const handleApplyPromo = useCallback((code) => {
    applyCoupon(code);
    showNotification(`Coupon ${code} applied successfully!`, 'success');
    setIsCartOpen(true);
  }, [applyCoupon, showNotification]);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* 1. Flash Sale Banner (useCountdown, useLayoutEffect, useRef) */}
      <FlashSaleTimer onApplyPromo={handleApplyPromo} />

      {/* 2. Navbar (useRef, useEffect, usePrevious, useContext) */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main className="main-content">
        {/* 3. Hero Section */}
        <HeroBanner
          onOpenGuide={() => setIsGuideOpen(true)}
          onScrollToProducts={scrollToProducts}
        />

        {/* 4. Products Section */}
        <div ref={productsSectionRef} className="catalog-container">
          <div className="catalog-layout">
            {/* Sidebar Filters (useTransition, useId, useState) */}
            <aside className="catalog-sidebar">
              <ProductFilters
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                isTransitionPending={isPending}
              />

              <div className="app-hooks-summary-card">
                <h4>⚡ App Architecture</h4>
                <p>
                  Search uses <code>useDeferredValue</code> to keep typing instant.
                  Filters use <code>useTransition</code> for interruptible updates.
                </p>
                <button
                  type="button"
                  className="open-full-guide-link"
                  onClick={() => setIsGuideOpen(true)}
                >
                  Inspect All 13 Hooks →
                </button>
              </div>
            </aside>

            {/* Product Grid (useMemo, React.memo, useCallback) */}
            <div className="catalog-main">
              <ProductList
                products={PRODUCTS}
                category={selectedCategory}
                searchQuery={deferredSearchQuery}
                maxPrice={maxPrice}
                sortBy={sortBy}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-text">
            <strong>NovaShop</strong> — Complete React Hooks Architecture & Reference Implementation.
          </p>
          <div className="footer-hook-tags">
            <HooksBadge hooks={[
              'useState', 'useEffect', 'useContext', 'useReducer',
              'useMemo', 'useCallback', 'useRef', 'useLayoutEffect',
              'useId', 'useTransition', 'useDeferredValue',
              'useImperativeHandle', 'useDebugValue'
            ]} />
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {/* 5. Quick View Modal (useImperativeHandle, forwardRef, useEffect, useState) */}
      <QuickViewModal ref={quickViewRef} onAddToCart={handleAddToCart} />

      {/* 6. Cart Drawer (useReducer, useContext, useId, useRef) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 7. Checkout Modal (useId, useState, useCart) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 8. Interactive Hooks Guide Modal */}
      <HooksGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <EcommerceStore />
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
