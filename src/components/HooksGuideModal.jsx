import React, { useState, useEffect } from 'react';
import { X, BookOpen, Code2, CheckCircle2, AlertTriangle, Cpu, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export function HooksGuideModal({ isOpen, onClose }) {
  const [selectedHook, setSelectedHook] = useState('useState');
  const { cart, summary, coupon } = useCart();
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const HOOKS_DATA = {
    useState: {
      name: 'useState',
      category: 'State Management',
      color: '#3b82f6',
      summary: 'Preserves local values between renders and triggers UI updates when mutated.',
      whyUsed: 'Used for ephemeral, local component state such as search inputs, price slider limits, modal open/close states, and button feedback.',
      usedIn: ['ProductCard.jsx', 'ProductFilters.jsx', 'CheckoutModal.jsx', 'QuickViewModal.jsx', 'useLocalStorage.js', 'useCountdown.js'],
      snippet: `// Example from ProductCard.jsx
const [justAdded, setJustAdded] = useState(false);

const handleAdd = () => {
  onAddToCart(product);
  setJustAdded(true);
  setTimeout(() => setJustAdded(false), 1200);
};`,
      whenToUse: 'For simple independent state variables that belong exclusively to a single component.',
      pitfall: 'Do not use for deeply nested or relational state transitions (use useReducer instead), or state shared across distant components (use useContext).'
    },

    useEffect: {
      name: 'useEffect',
      category: 'Side Effects & Lifecycle',
      color: '#10b981',
      summary: 'Executes side effects (data fetching, DOM events, subscriptions, document titles) after render.',
      whyUsed: 'Used to register global keyboard shortcuts (Cmd+K, Escape), update the browser tab title to show cart items, and run the countdown interval with a cleanup function.',
      usedIn: ['Navbar.jsx', 'useCountdown.js', 'ThemeContext.jsx', 'QuickViewModal.jsx', 'useLocalStorage.js'],
      snippet: `// Example from Navbar.jsx (Cleanup pattern)
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  // CLEANUP: Prevents memory leaks and duplicate listeners
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);`,
      whenToUse: 'When you need to synchronize React state with external systems (APIs, window events, timers, localStorage).',
      pitfall: 'Always declare complete dependencies in the dependency array. Never omit dependencies to "run only once" if variables inside the effect change.'
    },

    useContext: {
      name: 'useContext',
      category: 'Context & Global State',
      color: '#8b5cf6',
      summary: 'Subscribes to React context without manual prop-drilling down the tree.',
      whyUsed: 'Provides every product card, navbar badge, drawer, and checkout screen instant access to CartContext, ThemeContext, and NotificationContext without threading props through 5 layers.',
      usedIn: ['CartContext.jsx', 'ThemeContext.jsx', 'NotificationContext.jsx', 'Navbar.jsx', 'CartDrawer.jsx', 'CheckoutModal.jsx'],
      snippet: `// Example from CartContext.jsx
const CartContext = createContext(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}`,
      whenToUse: 'For genuinely ambient global data: authenticated user, active shopping cart, theme, language preference.',
      pitfall: 'Every component calling useContext re-renders when the context value changes. Split unrelated contexts and memoize context values with useMemo.'
    },

    useReducer: {
      name: 'useReducer',
      category: 'Complex State Management',
      color: '#ec4899',
      summary: 'Manages complex state logic via pure reducer functions and dispatched action objects.',
      whyUsed: 'Shopping cart updates are multi-step: adding existing items must increment quantity up to stock limits; coupons must be applied or removed; subtotals and discounts depend on each other. useReducer keeps all this logic in one pure, testable function.',
      usedIn: ['CartContext.jsx'],
      snippet: `// Example from CartContext.jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      // Deduplicates item or increments quantity up to stock
      const existing = state.items.find(i => i.id === action.payload.id);
      return existing ? { ...state, ... } : { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_QUANTITY': ...
    case 'APPLY_COUPON': ...
    default: return state;
  }
}
const [state, dispatch] = useReducer(cartReducer, initialCartState);`,
      whenToUse: 'When the next state depends on multiple previous states, or when state mutations involve distinct action types (ADD, REMOVE, UPDATE, RESET).',
      pitfall: 'Do not use for trivial single-field toggles where useState is simpler.'
    },

    useMemo: {
      name: 'useMemo',
      category: 'Performance Optimization',
      color: '#f59e0b',
      summary: 'Caches the result of an expensive calculation between renders unless dependencies change.',
      whyUsed: '1. Prevents re-calculating financial summary (taxes, coupons, shipping, grand total) on unrelated renders.\n2. Filters and sorts the entire product catalog based on search query, category, price range, and sort direction.',
      usedIn: ['CartContext.jsx', 'ProductList.jsx'],
      snippet: `// Example from ProductList.jsx
const filteredProducts = useMemo(() => {
  return products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.price <= maxPrice)
    .sort(...);
}, [products, category, searchQuery, maxPrice, sortBy]);`,
      whenToUse: 'For expensive filtering, sorting, or complex mathematical formulas that run on arrays/objects.',
      pitfall: 'Premature optimization. Do not wrap primitive calculations (like 2 + 2) in useMemo as the overhead of useMemo itself is greater.'
    },

    useCallback: {
      name: 'useCallback',
      category: 'Performance Optimization',
      color: '#06b6d4',
      summary: 'Caches a function definition between renders, keeping its reference identity stable.',
      whyUsed: 'Passed down to memoized child components (`ProductCard` wrapped in `React.memo`). Without useCallback, new function instances would be created every render, defeating React.memo and triggering re-renders of all product cards.',
      usedIn: ['CartContext.jsx', 'App.jsx'],
      snippet: `// Example from CartContext.jsx
const addToCart = useCallback((product, quantity = 1) => {
  dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
}, []); // Stable reference never changes`,
      whenToUse: 'When passing callbacks down to optimized child components wrapped in React.memo or when a function is a dependency in useEffect.',
      pitfall: 'useCallback does not prevent the function inside it from running; it only preserves the reference identity.'
    },

    useRef: {
      name: 'useRef',
      category: 'DOM & Mutable Storage',
      color: '#6366f1',
      summary: 'Holds a mutable reference that persists for the lifetime of the component WITHOUT causing re-renders.',
      whyUsed: '1. Direct DOM access to auto-focus the search bar upon pressing Cmd+K.\n2. Auto-focusing checkout buttons when the cart drawer opens.\n3. Custom hook usePrevious: remembers the previous render\'s cart count to trigger bounce badge animations.',
      usedIn: ['Navbar.jsx', 'CartDrawer.jsx', 'FlashSaleTimer.jsx', 'usePrevious.js'],
      snippet: `// Example from Navbar.jsx
const searchInputRef = useRef(null);

// Focusing the input node imperatively
searchInputRef.current?.focus();

// JSX:
<input ref={searchInputRef} ... />`,
      whenToUse: 'Direct DOM manipulation (focus, scroll, measurements) or storing mutable variables that should not trigger re-render (timer IDs, previous values).',
      pitfall: 'Do NOT read or write ref.current during rendering; doing so leads to unpredictable React concurrent rendering bugs.'
    },

    useLayoutEffect: {
      name: 'useLayoutEffect',
      category: 'Synchronous Layout Measurement',
      color: '#f97316',
      summary: 'Fires synchronously after all DOM mutations, BEFORE the browser paints to the screen.',
      whyUsed: 'Measures the exact physical pixel height of the top Flash Deal banner using getBoundingClientRect() before paint. If done in useEffect, the user would see a noticeable visual layout jitter or flicker.',
      usedIn: ['FlashSaleTimer.jsx'],
      snippet: `// Example from FlashSaleTimer.jsx
useLayoutEffect(() => {
  if (bannerRef.current) {
    const rect = bannerRef.current.getBoundingClientRect();
    setBannerHeight(Math.round(rect.height));
  }
}, []);`,
      whenToUse: 'When reading layout properties (scroll position, element dimensions) and immediately adjusting styles before the user sees the frame.',
      pitfall: 'Blocks visual browser paint. Overusing useLayoutEffect for non-visual operations will hurt page rendering performance.'
    },

    useId: {
      name: 'useId',
      category: 'Accessibility & Forms',
      color: '#14b8a6',
      summary: 'Generates unique, stable IDs for form inputs and accessibility aria-attributes.',
      whyUsed: 'Provides unique, collision-proof IDs for the checkout form inputs (Full Name, Email, Card Number, Expiry) and catalog filters. Prevents ID collisions when multiple forms or drawers exist simultaneously.',
      usedIn: ['CheckoutModal.jsx', 'CartDrawer.jsx', 'ProductFilters.jsx'],
      snippet: `// Example from CheckoutModal.jsx
const nameId = useId();
const emailId = useId();

<label htmlFor={nameId}>Full Name</label>
<input id={nameId} type="text" ... />`,
      whenToUse: 'Connecting HTML `<label>` elements to `<input>` fields, or linking `aria-describedby` and `aria-labelledby`.',
      pitfall: 'Do NOT use useId to generate keys in lists (use database IDs or unique item attributes for keys).'
    },

    useTransition: {
      name: 'useTransition',
      category: 'Concurrency & Responsiveness',
      color: '#84cc16',
      summary: 'Marks state updates as non-blocking transitions, keeping user inputs responsive.',
      whyUsed: 'When changing product categories or sorting, wrapping the filter change in startTransition tells React to prioritize urgent inputs (like typing or clicking) while marking catalog re-rendering as a transition. Exposes isPending to display a smooth loading indicator.',
      usedIn: ['App.jsx', 'ProductFilters.jsx'],
      snippet: `// Example from App.jsx
const [isPending, startTransition] = useTransition();

const handleCategoryChange = (newCat) => {
  startTransition(() => {
    setSelectedCategory(newCat);
  });
};`,
      whenToUse: 'When a state change causes a heavy UI re-render that would otherwise stutter user interactions like keystrokes or scrolls.',
      pitfall: 'The function passed to startTransition must be synchronous; async operations inside startTransition will not be batched properly.'
    },

    useDeferredValue: {
      name: 'useDeferredValue',
      category: 'Concurrency & Responsiveness',
      color: '#0284c7',
      summary: 'Defers updating a value until after more urgent background renders have completed.',
      whyUsed: 'The search input updates immediately so the text box never lags or drops keystrokes. Meanwhile, useDeferredValue defers the heavy catalog filtering until the user pauses typing.',
      usedIn: ['App.jsx'],
      snippet: `// Example from App.jsx
const [searchQuery, setSearchQuery] = useState('');
// Defer the filtered list query
const deferredSearchQuery = useDeferredValue(searchQuery);

<ProductList searchQuery={deferredSearchQuery} ... />`,
      whenToUse: 'When an input needs to remain snappy while a downstream consumer of that value performs expensive work.',
      pitfall: 'Deferred value will lag behind the original value by one tick during rapid updates; do not use if instant 1:1 synchronization is mandatory.'
    },

    useImperativeHandle: {
      name: 'useImperativeHandle',
      category: 'Imperative Component APIs',
      color: '#d946ef',
      summary: 'Customizes the instance value that is exposed to parent components when using ref.',
      whyUsed: 'Encapsulates the QuickViewModal\'s internal state and animations. Parents can trigger `ref.current.open(product)`, `ref.current.close()`, and `ref.current.shake()` without maintaining 4 separate state variables in App.jsx.',
      usedIn: ['QuickViewModal.jsx'],
      snippet: `// Example from QuickViewModal.jsx
useImperativeHandle(ref, () => ({
  open: (product) => {
    setProduct(product);
    setIsOpen(true);
  },
  close: () => setIsOpen(false),
  shake: () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }
}), []);`,
      whenToUse: 'Exposing imperative controls for modals, video/audio players, or interactive canvas components.',
      pitfall: 'Avoid using useImperativeHandle for general data passing; stick to declarative props and state wherever possible.'
    },

    useDebugValue: {
      name: 'useDebugValue',
      category: 'Developer Tooling',
      color: '#e11d48',
      summary: 'Displays custom debug labels in React Developer Tools for custom hooks.',
      whyUsed: 'Implemented inside `useLocalStorage`. When inspecting the custom hook in React DevTools, it renders formatted debug strings (e.g. "Items: 3" or "Theme: dark") rather than raw object blobs.',
      usedIn: ['useLocalStorage.js'],
      snippet: `// Example from useLocalStorage.js
useDebugValue(storedValue, (val) => {
  if (Array.isArray(val)) return \`Items: \${val.length}\`;
  return \`Value: \${val}\`;
});`,
      whenToUse: 'Inside reusable custom hooks in library or team code to provide rich developer experience in React DevTools.',
      pitfall: 'Only works inside custom hooks; calling useDebugValue in regular components does nothing.'
    }
  };

  const activeHook = HOOKS_DATA[selectedHook];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="guide-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="guide-modal-header">
          <div className="guide-title-row">
            <BookOpen size={24} className="guide-header-icon" />
            <div>
              <h2 className="guide-title">React Hooks Guide & Reference</h2>
              <p className="guide-subtitle">
                A simple reference showing why and how each React hook is used in this e-commerce app.
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close guide">
            <X size={20} />
          </button>
        </div>

        {/* Live App State Banner */}
        <div className="live-state-strip">
          <span className="live-tag">
            <Sparkles size={13} /> Live Store State:
          </span>
          <span className="live-item">Cart Items: <strong>{summary.totalItems}</strong></span>
          <span className="live-item">Cart Total: <strong>${summary.total.toFixed(2)}</strong></span>
          <span className="live-item">Coupon: <strong>{coupon ? coupon.code : 'None'}</strong></span>
          <span className="live-item">Theme: <strong>{theme}</strong></span>
        </div>

        {/* Body Layout: Sidebar + Detail Pane */}
        <div className="guide-body-layout">
          {/* Hook Selector List */}
          <nav className="guide-hook-nav">
            <span className="hook-nav-category">React Core Hooks</span>
            {['useState', 'useEffect', 'useContext', 'useReducer', 'useRef', 'useMemo', 'useCallback'].map((hookKey) => {
              const hook = HOOKS_DATA[hookKey];
              return (
                <button
                  key={hookKey}
                  type="button"
                  className={`hook-nav-item ${selectedHook === hookKey ? 'active' : ''}`}
                  onClick={() => setSelectedHook(hookKey)}
                >
                  <span className="hook-dot" style={{ backgroundColor: hook.color }} />
                  <span className="hook-nav-name">{hook.name}</span>
                </button>
              );
            })}

            <span className="hook-nav-category">Advanced & DOM Hooks</span>
            {['useLayoutEffect', 'useId', 'useImperativeHandle'].map((hookKey) => {
              const hook = HOOKS_DATA[hookKey];
              return (
                <button
                  key={hookKey}
                  type="button"
                  className={`hook-nav-item ${selectedHook === hookKey ? 'active' : ''}`}
                  onClick={() => setSelectedHook(hookKey)}
                >
                  <span className="hook-dot" style={{ backgroundColor: hook.color }} />
                  <span className="hook-nav-name">{hook.name}</span>
                </button>
              );
            })}

            <span className="hook-nav-category">Concurrency & DevTools</span>
            {['useTransition', 'useDeferredValue', 'useDebugValue'].map((hookKey) => {
              const hook = HOOKS_DATA[hookKey];
              return (
                <button
                  key={hookKey}
                  type="button"
                  className={`hook-nav-item ${selectedHook === hookKey ? 'active' : ''}`}
                  onClick={() => setSelectedHook(hookKey)}
                >
                  <span className="hook-dot" style={{ backgroundColor: hook.color }} />
                  <span className="hook-nav-name">{hook.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Hook Detailed View */}
          <div className="guide-detail-pane">
            <div className="hook-detail-header">
              <div className="hook-title-row">
                <h3 className="hook-name" style={{ color: activeHook.color }}>
                  {activeHook.name}()
                </h3>
                <span className="hook-category-tag">{activeHook.category}</span>
              </div>
              <p className="hook-summary">{activeHook.summary}</p>
            </div>

            {/* Why Used In This App */}
            <div className="guide-card why-card">
              <h4 className="guide-card-title">
                <Cpu size={16} /> Why We Used It In This E-Commerce Store
              </h4>
              <p className="why-text">{activeHook.whyUsed}</p>
              
              <div className="used-files-row">
                <span className="used-label">Used In Files:</span>
                {activeHook.usedIn.map((file) => (
                  <span key={file} className="file-pill">
                    {file}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Snippet from App */}
            <div className="guide-card code-card">
              <h4 className="guide-card-title">
                <Code2 size={16} /> Production Implementation Snippet
              </h4>
              <pre className="code-block">
                <code>{activeHook.snippet}</code>
              </pre>
            </div>

            {/* Best Practices & Pitfalls */}
            <div className="guidance-grid">
              <div className="guidance-box when-to-use">
                <h5 className="guidance-title">
                  <CheckCircle2 size={15} /> When to use
                </h5>
                <p>{activeHook.whenToUse}</p>
              </div>

              <div className="guidance-box pitfall">
                <h5 className="guidance-title">
                  <AlertTriangle size={15} /> Common Pitfall to Avoid
                </h5>
                <p>{activeHook.pitfall}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
