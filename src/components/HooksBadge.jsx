import React from 'react';

/**
 * Small indicator badge that shows which React Hooks power the current component
 */
export function HooksBadge({ hooks = [] }) {
  return (
    <div className="hooks-badge-container" title={`Hooks used here: ${hooks.join(', ')}`}>
      <span className="hooks-badge-label">⚡ Hooks:</span>
      {hooks.map((hook) => (
        <span key={hook} className="hook-pill">
          {hook}
        </span>
      ))}
    </div>
  );
}
