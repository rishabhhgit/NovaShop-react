import React, { useRef, useState, useLayoutEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Zap, Clock, Sparkles } from 'lucide-react';
import { HooksBadge } from './HooksBadge';

export function FlashSaleTimer({ onApplyPromo }) {
  const { hours, minutes, seconds, isFinished } = useCountdown(7200); // 2 hours
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  /**
   * HOOK: useLayoutEffect
   * 
   * WHY USE IT:
   * useLayoutEffect runs SYNCHRONOUSLY after all DOM mutations, before the browser
   * paints to the screen. Here, we measure the promotional banner's physical height
   * and read its client dimensions.
   * If we did this in useEffect, the user might see a brief visual flicker or
   * layout jump (Cumulative Layout Shift) before the dimensions stabilize.
   */
  useLayoutEffect(() => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      setBannerHeight(Math.round(rect.height));
    }
  }, []);

  if (isFinished) {
    return null;
  }

  return (
    <div ref={bannerRef} className="flash-sale-banner">
      <div className="flash-sale-content">
        <div className="flash-sale-left">
          <span className="flash-badge">
            <Zap size={14} className="animate-pulse" /> FLASH DEAL
          </span>
          <span className="flash-text">
            Use code <strong>SAVE20</strong> for 20% off all orders over $100!
          </span>
          <button 
            type="button" 
            className="copy-coupon-btn" 
            onClick={() => onApplyPromo('SAVE20')}
            title="Click to apply automatically"
          >
            <Sparkles size={13} /> Auto-Apply
          </button>
        </div>

        <div className="flash-timer-display">
          <Clock size={16} />
          <span className="timer-unit">{hours}h</span>
          <span className="timer-sep">:</span>
          <span className="timer-unit">{minutes}m</span>
          <span className="timer-sep">:</span>
          <span className="timer-unit highlight">{seconds}s</span>
        </div>
      </div>

      <div className="banner-footer-info">
        <HooksBadge hooks={['useCountdown', 'useLayoutEffect', 'useRef', 'useState']} />
        <span className="layout-metric-tag" title="Calculated synchronously with useLayoutEffect">
          Measured Height: {bannerHeight}px
        </span>
      </div>
    </div>
  );
}
