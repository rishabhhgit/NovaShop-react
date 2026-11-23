# 🛍️ NovaShop — React Hooks Masterclass E-Commerce

A modern, high-performance, fully functional React e-commerce application built to demonstrate and master **all 13 standard React hooks** in real-world production scenarios.

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

## ⚡ React Hooks Architecture & Deep Dive

| # | Hook | Category | Role in NovaShop | Key Reason for Choosing It |
|---|---|---|---|---|
| 1 | **`useState`** | State | Search query, price limits, modal states, button feedback | Manages local, ephemeral component state that triggers visual updates upon mutation. |
| 2 | **`useEffect`** | Side Effects | Keyboard shortcuts (`Cmd+K`, `Esc`), Tab title sync, Countdown timer cleanup | Synchronizes React state with external browser APIs, DOM events, and timers with teardown handlers. |
| 3 | **`useContext`** | Context | `CartContext`, `ThemeContext`, `NotificationContext` | Avoids prop drilling, providing ambient access to cart, theme, and notifications across deeply nested components. |
| 4 | **`useReducer`** | State Logic | `cartReducer` (items, quantities, coupon codes, subtotals) | Centralizes complex relational cart mutations in a pure, predictable, testable reducer function. |
| 5 | **`useMemo`** | Optimization | Product filtering/sorting, financial summary (tax, shipping, discount) | Caches expensive calculations between renders; only recomputes when dependencies change. |
| 6 | **`useCallback`** | Optimization | `addToCart`, `quickView`, `removeFromCart` passed to memoized cards | Stabilizes function reference identity across parent re-renders so `React.memo(ProductCard)` avoids unnecessary re-renders. |
| 7 | **`useRef`** | DOM / Mutable | Search input auto-focus (`Cmd+K`), `usePrevious` count comparison, checkout button focus | Direct DOM access without re-rendering, and storing mutable values across renders without triggering a re-render. |
| 8 | **`useLayoutEffect`** | DOM Measurement | Measuring Flash Sale Banner height synchronously before paint | Runs before the browser paints to eliminate visual flicker and Cumulative Layout Shift (CLS). |
| 9 | **`useId`** | Accessibility | Form fields in Checkout Modal & Catalog Filter sliders | Generates collision-proof, stable IDs for accessible `<label>` and `<input>` pairings. |
| 10 | **`useTransition`** | Concurrency | Category switching & sorting with `isPending` spinner | Marks heavy catalog updates as interruptible transitions, ensuring typing and clicks stay responsive. |
| 11 | **`useDeferredValue`** | Concurrency | Live search query filtering | Keeps keystroke typing immediate while deferring heavy catalog list re-filtering. |
| 12 | **`useImperativeHandle`** | Imperative API | `QuickViewModal` exposing `open()`, `close()`, `shake()` | Encapsulates dialog internal states while providing a clean imperative handle API to parent components. |
| 13 | **`useDebugValue`** | DevTools | Formatted labels in custom hook `useLocalStorage` | Provides readable debug inspection tags inside React Developer Tools. |

---

## 📂 Project Architecture

```
react-ecommerce/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                     # Application root mount
│   ├── App.jsx                      # Main orchestrator (useTransition, useDeferredValue, useRef, useCallback)
│   ├── index.css                    # Responsive theme styling (Dark/Light modes, animations)
│   ├── data/
│   │   └── products.js              # Catalog items, categories, and tags
│   ├── context/
│   │   ├── CartContext.jsx          # useReducer + useContext + useMemo + useCallback
│   │   ├── ThemeContext.jsx         # useContext + useEffect + useLocalStorage
│   │   └── NotificationContext.jsx  # useContext + useState + useCallback
│   ├── hooks/
│   │   ├── useLocalStorage.js       # Custom hook with useDebugValue, useState, useEffect
│   │   ├── useCountdown.js          # Custom hook with useState, useEffect cleanup interval
│   │   └── usePrevious.js           # Custom hook with useRef, useEffect
│   └── components/
│       ├── Navbar.jsx               # useRef (focus), useEffect (Cmd+K, title), useCart, useTheme
│       ├── FlashSaleTimer.jsx       # useLayoutEffect (DOM measure), useCountdown, useRef
│       ├── HeroBanner.jsx           # Welcome hero & features
│       ├── ProductFilters.jsx       # useTransition (isPending), useId
│       ├── ProductCard.jsx          # React.memo, useState, useCallback consumer
│       ├── ProductList.jsx          # useMemo (filtering & sorting catalog)
│       ├── QuickViewModal.jsx       # useImperativeHandle, forwardRef, useEffect, useState
│       ├── CartDrawer.jsx           # useCart (useReducer), useId, useRef
│       ├── CheckoutModal.jsx        # useId (accessible form inputs), useState, useCart
│       ├── HooksGuideModal.jsx      # Interactive live in-app Hooks Inspector
│       └── HooksBadge.jsx           # Educational hook pills
```

---

## 🎨 Interactive Features

- **Live In-App Hooks Guide**: Click **"Hooks Guide (13 Hooks)"** in the top navbar to view real-time state, code snippets, when to use, and common pitfalls for every hook.
- **Auto-Focus Search (`⌘K` or `Ctrl+K`)**: Demonstrates `useRef` and `useEffect`.
- **Flash Sale Banner**: Demonstrates `useCountdown` interval cleanup and `useLayoutEffect` synchronous layout measurement.
- **Cart & Coupon System**: Try coupons `SAVE20` (20% off), `HALFOFF` (50% flash off), or `FREESHIP`.
- **Accessible Checkout**: Demonstrates `useId` generating accessible form pairs.
- **Dark & Light Mode**: Demonstrates `useLocalStorage` with `useDebugValue` and `ThemeContext`.
