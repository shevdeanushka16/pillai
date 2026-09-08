import { useState, useEffect, useRef } from 'react';

/**
 * Lightweight number transition hook for smooth metric count-ups.
 * Uses a ref to snapshot the animation start value, preventing stale
 * closure bugs when targetValue changes rapidly (e.g. surge → optimized).
 */
export function useAnimatedNumber(targetValue: number, durationMs = 600): number {
  const [displayValue, setDisplayValue] = useState(targetValue);
  // Snapshot the value AT ANIMATION START via ref, not captured from state
  const startValueRef = useRef(targetValue);

  useEffect(() => {
    const initialValue = startValueRef.current;
    const difference = targetValue - initialValue;

    if (difference === 0) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(initialValue + difference * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
        startValueRef.current = targetValue;
      }
    };

    // Update ref immediately so the NEXT animation starts from here
    startValueRef.current = targetValue;
    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, durationMs]);

  return displayValue;
}
