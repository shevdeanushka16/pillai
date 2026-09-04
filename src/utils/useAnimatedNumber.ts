import { useState, useEffect } from 'react';

/**
 * Lightweight number transition hook for smooth metric count-ups
 */
export function useAnimatedNumber(targetValue: number, durationMs = 600): number {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const initialValue = displayValue;
    const difference = targetValue - initialValue;

    if (difference === 0) return;

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
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, durationMs]);

  return displayValue;
}
