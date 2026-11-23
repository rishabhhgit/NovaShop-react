import { useState, useEffect, useDebugValue } from 'react';

/**
 * Custom Hook: useLocalStorage
 * 
 * HOOKS USED:
 * 1. useState: Stores the active in-memory state initialized from localStorage
 * 2. useEffect: Syncs updates to window.localStorage whenever key or value changes
 * 3. useDebugValue: Formats custom debug info visible in React Developer Tools
 * 
 * WHY USE IT:
 * Encapsulates persistent browser storage with automatic JSON serialization,
 * error handling, and DevTools inspection.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // useDebugValue formats how this custom hook appears in React DevTools
  useDebugValue(storedValue, (val) => {
    if (Array.isArray(val)) return `Items: ${val.length}`;
    if (typeof val === 'object' && val !== null) return `Keys: ${Object.keys(val).join(', ')}`;
    return `Value: ${val}`;
  });

  return [storedValue, setStoredValue];
}
