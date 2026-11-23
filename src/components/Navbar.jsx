import React, { useRef, useEffect, useState } from 'react';
import { ShoppingBag, Search, Moon, Sun, BookOpen, Sparkles, Command } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { usePrevious } from '../hooks/usePrevious';
import { HooksBadge } from './HooksBadge';

export function Navbar({ onOpenCart, onOpenGuide, searchQuery, onSearchChange }) {
  const { summary } = useCart();
  const { theme, toggleTheme } = useTheme();
  
  /**
   * HOOK: useRef (DOM Reference)
   * WHY USE IT:
   * Holds a direct reference to the `<input>` DOM node so we can imperatively
   * trigger `.focus()` without manipulating state or triggering a re-render.
   */
  const searchInputRef = useRef(null);

  /**
   * Custom Hook using useRef: usePrevious
   * WHY USE IT:
   * Compares the current cart count with the previous render's cart count.
   * If items were added, we trigger a temporary bounce animation on the cart badge!
   */
  const prevCount = usePrevious(summary.totalItems);
  const [isBouncing, setIsBouncing] = useState(false);

  /**
   * HOOK: useEffect (Side Effect: Global Keyboard Shortcut)
   * WHY USE IT:
   * Sets up a window-level event listener for 'Cmd+K' / 'Ctrl+K' on mount.
   * Includes the essential cleanup function to prevent memory leaks when unmounted.
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * HOOK: useEffect (Side Effect: Document Title Synchronization)
   * WHY USE IT:
   * Synchronizes browser tab title with the dynamic cart state.
   */
  useEffect(() => {
    if (summary.totalItems > 0) {
      document.title = `(${summary.totalItems}) NovaShop — React Hooks Store`;
    } else {
      document.title = 'NovaShop — React Hooks Store';
    }
  }, [summary.totalItems]);

  /**
   * Trigger bounce animation when cart count increases
   */
  useEffect(() => {
    if (prevCount !== undefined && summary.totalItems > prevCount) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [summary.totalItems, prevCount]);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div className="brand-group">
          <div className="brand-logo">
            <Sparkles className="logo-icon" size={22} />
          </div>
          <div>
            <span className="brand-name">NovaShop</span>
            <span className="brand-tag">Hooks Edition</span>
          </div>
        </div>

        {/* Search Bar with auto-focus Ref */}
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search products... (⌘K or Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd className="search-kbd">
            <Command size={11} /> K
          </kbd>
        </div>

        {/* Actions & Hook Navigation */}
        <div className="nav-actions">
          {/* Guide Modal Trigger */}
          <button 
            type="button" 
            className="guide-button" 
            onClick={onOpenGuide}
            title="Open Interactive Hooks Explorer"
          >
            <BookOpen size={17} />
            <span className="guide-btn-text">Hooks Guide</span>
            <span className="guide-count-badge">13 Hooks</span>
          </button>

          {/* Theme Toggle */}
          <button 
            type="button" 
            className="icon-button" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Drawer Trigger with Badge */}
          <button 
            type="button" 
            className={`cart-button ${isBouncing ? 'animate-bounce' : ''}`}
            onClick={onOpenCart}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={20} />
            <span className="cart-badge">{summary.totalItems}</span>
          </button>
        </div>
      </div>

      {/* Embedded hook pill for learning transparency */}
      <div className="navbar-hook-strip">
        <HooksBadge hooks={['useRef', 'useEffect', 'usePrevious', 'useState', 'useCart (useContext)']} />
      </div>
    </header>
  );
}
