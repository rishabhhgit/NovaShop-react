import React from 'react';
import { ShoppingCart, BookOpen, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

export function HeroBanner({ onOpenGuide, onScrollToProducts }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-pill">
          <Sparkles size={14} className="text-accent" />
          <span>Complete React 19 Hooks Showcase</span>
        </div>

        <h1 className="hero-title">
          Modern E-Commerce, <br />
          <span className="text-gradient">Engineered with Every React Hook.</span>
        </h1>

        <p className="hero-description">
          An interactive, production-grade store built to master all 13 standard React hooks.
          Inspect real-time state transitions, memoized calculations, custom hooks, and imperative handles.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="hero-primary-btn"
            onClick={onScrollToProducts}
          >
            <ShoppingCart size={18} /> Shop Products
          </button>

          <button
            type="button"
            className="hero-secondary-btn"
            onClick={onOpenGuide}
          >
            <BookOpen size={18} /> Explore Hooks Guide
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="hero-features-grid">
          <div className="hero-feature-card">
            <Layers size={18} className="feature-icon" />
            <div>
              <strong>13 Hooks Covered</strong>
              <p>useState through useDeferredValue & useId</p>
            </div>
          </div>

          <div className="hero-feature-card">
            <Zap size={18} className="feature-icon" />
            <div>
              <strong>High Performance</strong>
              <p>useTransition, useMemo, useCallback</p>
            </div>
          </div>

          <div className="hero-feature-card">
            <ShieldCheck size={18} className="feature-icon" />
            <div>
              <strong>Predictable State</strong>
              <p>useReducer + useContext Architecture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
