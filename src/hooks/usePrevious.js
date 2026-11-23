import { useRef, useEffect } from 'react';

/**
 * Custom Hook: usePrevious
 * 
 * HOOKS USED:
 * 1. useRef: Stores a mutable value that survives re-renders WITHOUT causing a new render
 * 2. useEffect: Updates the ref after render completes
 * 
 * WHY USE IT:
 * In e-commerce, detecting if cart item count increased (prev < current) lets us
 * trigger micro-animations (e.g. bounce badge or toast notification) without extra renders.
 */
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
