# 🛍️ NovaShop — React E-Commerce & Complete Hooks Revision Guide

A modern e-commerce web application built with **React** and **Vite**, designed as a complete real-world reference to revise and master all **13 standard React hooks**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production
npm run build
```

---

## ⚡ React Hooks Architecture Overview

```
                                  ┌──────────────────────────┐
                                  │   NovaShop Architecture  │
                                  └─────────────┬────────────┘
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
  State & Reducers               Side Effects & DOM            Performance & Concurrency
  • useState (ephemeral UI)      • useEffect (listeners/timer) • useMemo (calc/filter)
  • useReducer (cart logic)      • useLayoutEffect (measure)   • useCallback (memoized handlers)
  • useContext (ambient state)   • useRef (DOM & values)       • useTransition (filter priority)
                                 • useId (accessible forms)    • useDeferredValue (snappy typing)
                                 • useImperativeHandle (modal) • useDebugValue (DevTools tags)
```

---

## 📚 Complete React Hooks Deep Dive (Revision Notes)

---

### 1. `useState`
- **Location:** `src/components/ProductCard.jsx`, `src/components/ProductFilters.jsx`, `src/components/CheckoutModal.jsx`, `src/hooks/useCountdown.js`
- **Why We Used It:**
  To manage local, short-lived component state that triggers a re-render when mutated — such as search query text, category filter selection, price range thresholds, modal open/close toggles, and temporary `"Added! ✓"` button feedback.
- **Code Snippet:**
  ```jsx
  // ProductCard.jsx
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };
  ```

---

### 2. `useEffect`
- **Location:** `src/components/Navbar.jsx`, `src/hooks/useCountdown.js`, `src/context/ThemeContext.jsx`, `src/components/QuickViewModal.jsx`
- **Why We Used It:**
  For handling side effects and synchronizing React state with external browser APIs:
  1. **Global Keyboard Shortcuts:** Listening for `⌘K` / `Ctrl+K` to focus the search bar and `Escape` to close modals, with a cleanup function on unmount.
  2. **Document Title Sync:** Dynamically updating the browser tab title (e.g. `(3) NovaShop`).
  3. **Promotional Countdown Interval:** Running a 1-second interval timer and returning a cleanup function (`clearInterval`) to prevent memory leaks and zombie timers.
- **Code Snippet:**
  ```jsx
  // Navbar.jsx
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup
  }, []);
  ```

---

### 3. `useContext`
- **Location:** `src/context/CartContext.jsx`, `src/context/ThemeContext.jsx`, `src/context/NotificationContext.jsx`
- **Why We Used It:**
  To eliminate **prop drilling**. Deeply nested components (individual product cards, the navbar cart badge, drawer controls, and checkout dialogs) can read cart contents, toggle themes, and trigger toast notifications without passing props through every layer of the tree.
- **Code Snippet:**
  ```jsx
  // CartContext.jsx
  const CartContext = createContext(null);

  export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
  }
  ```

---

### 4. `useReducer`
- **Location:** `src/context/CartContext.jsx`
- **Why We Used It:**
  Shopping cart operations involve complex relational state mutations:
  - Checking if an item is already in the cart (incrementing quantity instead of duplicating).
  - Enforcing stock ceilings (`Math.min(quantity, item.stock)`).
  - Applying and validating promo codes (`SAVE20`, `HALFOFF`, `FREESHIP`).
  - Handling quantity adjustments down to zero (auto-removal).
  
  `useReducer` isolates all these transitions in a pure, testable, predictable reducer function (`cartReducer`).
- **Code Snippet:**
  ```jsx
  // CartContext.jsx
  function cartReducer(state, action) {
    switch (action.type) {
      case 'ADD_ITEM': {
        const existingIndex = state.items.findIndex(i => i.id === action.payload.id);
        if (existingIndex > -1) {
          const updated = [...state.items];
          updated[existingIndex].quantity = Math.min(
            updated[existingIndex].quantity + (action.payload.quantity || 1),
            updated[existingIndex].stock
          );
          return { ...state, items: updated };
        }
        return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
      case 'UPDATE_QUANTITY': ...
      case 'APPLY_COUPON': ...
      case 'CLEAR_CART': ...
      default: return state;
    }
  }
  ```

---

### 5. `useMemo`
- **Location:** `src/context/CartContext.jsx`, `src/components/ProductList.jsx`
- **Why We Used It:**
  To cache expensive calculations between renders so they only re-run when their specific dependencies change:
  1. **Cart Financials:** Recalculates `subtotal`, `discount`, `tax` (8%), and `shipping` only when `state.items` or `state.coupon` changes, not on unrelated input typing or timers.
  2. **Product Catalog Filter/Sort:** Multi-condition filtering (search keyword + category + max price + sorting direction) only executes when filter parameters change.
- **Code Snippet:**
  ```jsx
  // ProductList.jsx
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => category === 'All' || p.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price <= maxPrice);
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, category, searchQuery, maxPrice, sortBy]);
  ```

---

### 6. `useCallback`
- **Location:** `src/context/CartContext.jsx`, `src/App.jsx`
- **Why We Used It:**
  Child components like `ProductCard` are wrapped in `React.memo`. If parent handlers (`onAddToCart`, `onQuickView`) were plain functions, a new reference would be created on every render, defeating `React.memo` and forcing all cards to re-render. `useCallback` keeps function references stable across renders.
- **Code Snippet:**
  ```jsx
  // App.jsx
  const handleAddToCart = useCallback((product, qty = 1) => {
    addToCart(product, qty);
    showNotification(`Added ${qty} × "${product.name}" to your cart!`, 'success');
  }, [addToCart, showNotification]);
  ```

---

### 7. `useRef`
- **Location:** `src/components/Navbar.jsx`, `src/components/CartDrawer.jsx`, `src/hooks/usePrevious.js`
- **Why We Used It:**
  1. **Direct DOM Access:** Referencing the search `<input>` to programmatically call `.focus()` when the user presses `⌘K`.
  2. **Accessibility Auto-Focus:** Automatically focusing the checkout button when the cart drawer slides in.
  3. **State Without Re-renders (`usePrevious`):** Persisting the previous render's cart count to detect item additions (`prevCount < currentCount`) and trigger a bounce badge animation without causing an extra render cycle.
- **Code Snippet:**
  ```jsx
  // usePrevious.js
  export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }
  ```

---

### 8. `useLayoutEffect`
- **Location:** `src/components/FlashSaleTimer.jsx`
- **Why We Used It:**
  `useLayoutEffect` fires **synchronously** immediately after DOM mutations, **before the browser paints** the frame to the screen. Here, we measure the physical pixel height of the top Flash Deal banner (`getBoundingClientRect()`).
  
  *Why not `useEffect`?* If measured in `useEffect`, the banner would render first at default height and then snap to its measured dimension a frame later, resulting in an unsightly flash and Cumulative Layout Shift (CLS).
- **Code Snippet:**
  ```jsx
  // FlashSaleTimer.jsx
  useLayoutEffect(() => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      setBannerHeight(Math.round(rect.height));
    }
  }, []);
  ```

---

### 9. `useId`
- **Location:** `src/components/CheckoutModal.jsx`, `src/components/ProductFilters.jsx`
- **Why We Used It:**
  Generates stable, unique, collision-proof HTML element IDs across client and server renders. It connects `<label htmlFor={id}>` to `<input id={id}>` for Full Name, Email, Address, Card Number, and Expiry without hardcoded string IDs that could clash if multiple forms are mounted.
- **Code Snippet:**
  ```jsx
  // CheckoutModal.jsx
  const nameId = useId();
  const emailId = useId();

  <div className="form-field">
    <label htmlFor={nameId}>Full Name</label>
    <input id={nameId} type="text" value={formData.name} ... />
  </div>
  ```

---

### 10. `useTransition`
- **Location:** `src/App.jsx`, `src/components/ProductFilters.jsx`
- **Why We Used It:**
  Categorizing and re-sorting a catalog can be heavy. Wrapping category switches in `startTransition` tells React to treat the catalog re-render as a **non-blocking, interruptible transition**. User keystrokes and clicks remain instantaneous, and `isPending` displays a subtle loading spinner.
- **Code Snippet:**
  ```jsx
  // App.jsx
  const [isPending, startTransition] = useTransition();

  const handleCategorySelect = (category) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };
  ```

---

### 11. `useDeferredValue`
- **Location:** `src/App.jsx`
- **Why We Used It:**
  When typing into the search bar, the input state (`searchQuery`) updates immediately with zero latency. Meanwhile, `deferredSearchQuery = useDeferredValue(searchQuery)` defers the filtered list calculation until after urgent typing events finish, preventing input stuttering during fast typing.
- **Code Snippet:**
  ```jsx
  // App.jsx
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Input stays immediate:
  <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

  // Catalog filtering receives deferred value:
  <ProductList searchQuery={deferredSearchQuery} ... />
  ```

---

### 12. `useImperativeHandle`
- **Location:** `src/components/QuickViewModal.jsx`
- **Why We Used It:**
  Dialogs and modals often have their own internal animations and quantity states. Instead of forcing `App.jsx` to hold 4 separate state setters (`isModalOpen`, `selectedProduct`, `shakeAnimation`, `modalQty`), `useImperativeHandle` exposes an imperative ref API to the parent:
  - `quickViewRef.current.open(product)`
  - `quickViewRef.current.close()`
  - `quickViewRef.current.shake()` (triggers a wiggle animation if user exceeds stock)
- **Code Snippet:**
  ```jsx
  // QuickViewModal.jsx
  export const QuickViewModal = forwardRef(function QuickViewModal({ onAddToCart }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState(null);

    useImperativeHandle(ref, () => ({
      open: (prod) => { setProduct(prod); setIsOpen(true); },
      close: () => setIsOpen(false),
      shake: () => { /* trigger CSS shake animation */ }
    }), []);
    ...
  });
  ```

---

### 13. `useDebugValue`
- **Location:** `src/hooks/useLocalStorage.js`
- **Why We Used It:**
  Used inside custom hooks to display custom, formatted debug labels in React Developer Tools. When inspecting components using `useLocalStorage`, DevTools displays clean status strings (such as `Theme: "dark"` or `Items: 3`) rather than unstructured JSON blobs.
- **Code Snippet:**
  ```jsx
  // useLocalStorage.js
  useDebugValue(storedValue, (val) => {
    if (Array.isArray(val)) return `Items: ${val.length}`;
    if (typeof val === 'object' && val !== null) return `Keys: ${Object.keys(val).join(', ')}`;
    return `Value: ${val}`;
  });
  ```

---

## 📂 Project Architecture

```
react-ecommerce/
├── index.html                       # HTML root with fonts & SVG favicon
├── package.json                     # Dependencies: React 19, Lucide icons, Vite
├── vite.config.js                   # Vite configuration
├── README.md                        # Documentation & React Hooks Revision Guide
└── src/
    ├── main.jsx                     # Application bootstrap
    ├── App.jsx                      # Orchestrator (useTransition, useDeferredValue, useRef)
    ├── index.css                    # Dark/Light theme system, responsive CSS grid
    ├── data/
    │   └── products.js              # Mock catalog with ratings, stock, deals
    ├── context/
    │   ├── CartContext.jsx          # useReducer + useContext + useMemo + useCallback
    │   ├── ThemeContext.jsx         # useContext + useEffect + useLocalStorage
    │   └── NotificationContext.jsx  # useContext + useState + useCallback
    ├── hooks/
    │   ├── useLocalStorage.js       # Custom hook (useState + useEffect + useDebugValue)
    │   ├── useCountdown.js          # Custom hook (useState + useEffect with cleanup)
    │   └── usePrevious.js           # Custom hook (useRef + useEffect)
    └── components/
        ├── Navbar.jsx               # Header with search (useRef) and shortcuts
        ├── FlashSaleTimer.jsx       # Deal banner using useLayoutEffect
        ├── HeroBanner.jsx           # Store hero section
        ├── ProductFilters.jsx       # Category and price filters (useTransition)
        ├── ProductCard.jsx          # Product card with React.memo & useCallback
        ├── ProductList.jsx          # Filtered catalog grid (useMemo)
        ├── QuickViewModal.jsx       # Product modal with useImperativeHandle
        ├── CartDrawer.jsx           # Slide-out cart drawer
        ├── CheckoutModal.jsx        # Form with useId
        ├── HooksGuideModal.jsx      # Interactive in-app live Hooks Inspector
        └── HooksBadge.jsx           # Educational badges
```

---

## ✨ Interactive Features to Test in App

1. **In-App Hooks Inspector:** Click **"Hooks Guide"** in the top navbar to inspect live state, code snippets, and common pitfalls for all 13 hooks.
2. **Keyboard Shortcut:** Press `⌘K` or `Ctrl+K` from anywhere to jump into the search bar (`useRef` + `useEffect`).
3. **Discount Codes:** Open the cart drawer and test `SAVE20` (20% off), `HALFOFF` (50% off), or `FREESHIP` (`useReducer`).
4. **Theme Switcher:** Click the Sun/Moon icon in the top right to switch between dark and light themes (`useLocalStorage` + `useDebugValue`).
