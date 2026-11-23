# 🛍️ NovaShop — React E-Commerce

A modern, responsive e-commerce web application built using **React** and **Vite**.

This project implements a full e-commerce shopping experience — featuring product filtering, live search, a shopping cart with promotional discounts, and checkout — while demonstrating how each of the standard React hooks is applied in real components.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## ⚡ React Hooks Used in This Project

| # | Hook | Category | Where It's Used | Why It Was Used |
|---|---|---|---|---|
| 1 | **`useState`** | State | Search input, filters, modal toggles, button states | Manages local component state that triggers a re-render when modified. |
| 2 | **`useEffect`** | Side Effects | Keyboard shortcuts (`⌘K`, `Esc`), document title, countdown timer | Synchronizes components with browser APIs, window listeners, and interval timers with cleanup. |
| 3 | **`useContext`** | Context | `CartContext`, `ThemeContext`, `NotificationContext` | Shares global state (cart items, theme, notifications) across the tree without prop-drilling. |
| 4 | **`useReducer`** | State Logic | `cartReducer` | Centralizes shopping cart operations (add, remove, change quantity, apply coupons) in a pure reducer function. |
| 5 | **`useMemo`** | Optimization | Product filtering/sorting, cart financial calculations | Caches expensive calculations (tax, shipping, discounts, filtered product list) across renders. |
| 6 | **`useCallback`** | Optimization | `addToCart`, `quickView`, and action handlers | Keeps callback function references stable across renders to prevent unnecessary re-renders in memoized child cards. |
| 7 | **`useRef`** | DOM / Values | Search input focus (`⌘K`), previous cart item count | Directly focuses DOM elements and retains mutable values across renders without causing new renders. |
| 8 | **`useLayoutEffect`** | DOM Measure | Promotional banner height measurement | Measures DOM dimensions synchronously before the browser paints to eliminate visual layout shifts (CLS). |
| 9 | **`useId`** | Accessibility | Checkout form fields & filter inputs | Generates unique, accessible IDs for `<label>` and `<input>` associations without collisions. |
| 10 | **`useTransition`** | Concurrency | Catalog category switching | Marks heavy filter updates as non-blocking transitions so the UI stays responsive, with an `isPending` state. |
| 11 | **`useDeferredValue`** | Concurrency | Live product search query | Keeps typing input immediate while deferring catalog re-filtering until typing pauses. |
| 12 | **`useImperativeHandle`** | Imperative API | `QuickViewModal` (`open`, `close`, `shake`) | Exposes clean, custom imperative methods to the parent component via ref. |
| 13 | **`useDebugValue`** | DevTools | Custom `useLocalStorage` hook | Displays readable debug labels for custom hooks in React Developer Tools. |

---

## 📂 Project Structure

```
react-ecommerce/
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
├── README.md                        # Project documentation
└── src/
    ├── main.jsx                     # Entry point
    ├── App.jsx                      # Main app component
    ├── index.css                    # Styling and theme variables
    ├── data/
    │   └── products.js              # Mock product data
    ├── context/
    │   ├── CartContext.jsx          # Shopping cart context with useReducer
    │   ├── ThemeContext.jsx         # Dark/light theme context
    │   └── NotificationContext.jsx  # Toast notification context
    ├── hooks/
    │   ├── useLocalStorage.js       # Persistent storage with useDebugValue
    │   ├── useCountdown.js          # Countdown timer with cleanup
    │   └── usePrevious.js           # Value tracking with useRef
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
        ├── HooksGuideModal.jsx      # In-app reference guide
        └── HooksBadge.jsx           # Educational badges
```

---

## ✨ Features

- **Product Catalog:** Filter by category, price range, and sort by price or rating.
- **Instant Search:** Fast search bar with keyboard shortcut (`⌘K` or `Ctrl+K`) and deferred query updates.
- **Cart & Discounts:** Add/remove items, adjust quantities, and apply promo codes (`SAVE20`, `HALFOFF`, `FREESHIP`).
- **Accessible Checkout:** Form validation and accessible inputs connected via `useId`.
- **Dark & Light Modes:** Saved in localStorage and toggled smoothly.
- **Built-in Hooks Guide:** Click **"Hooks Guide"** in the navigation bar to see an in-app reference for each hook used.
