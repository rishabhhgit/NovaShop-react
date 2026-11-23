import { useState, useEffect } from 'react';

/**
 * Custom Hook: useCountdown
 * 
 * HOOKS USED:
 * 1. useState: Tracks the remaining seconds until target time
 * 2. useEffect: Sets up a setInterval timer on mount and cleans it up on unmount or target change
 * 
 * WHY USE IT:
 * Essential for promotional flash deals. Demonstrates the critical cleanup pattern in useEffect
 * to prevent memory leaks and zombie interval callbacks.
 */
export function useCountdown(initialSeconds = 3600) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    // If countdown reached zero, do nothing
    if (secondsLeft <= 0) return;

    // Set up 1-second interval
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // CRITICAL: Cleanup function runs when component unmounts or before re-running effect
    return () => clearInterval(timerId);
  }, [secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isFinished: secondsLeft === 0,
    resetCountdown: (secs = initialSeconds) => setSecondsLeft(secs)
  };
}
