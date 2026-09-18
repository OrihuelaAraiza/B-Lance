import { useCallback, useEffect, useRef, useState } from "react";

const DURATION_MS = 50_000;

// Text and the visual orbit share this clock, including partial seconds on pause.
export function useBreathingClock(open: boolean) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const clock = useRef({ elapsed: 0, startedAt: null as number | null });

  const sample = useCallback(() => {
    const { elapsed, startedAt } = clock.current;
    return Math.min(DURATION_MS, elapsed + (startedAt === null ? 0 : performance.now() - startedAt));
  }, []);

  const pause = useCallback(() => {
    const elapsed = sample();
    clock.current = { elapsed, startedAt: null };
    setElapsedMs(elapsed);
    setRunning(false);
  }, [sample]);

  const reset = useCallback(() => {
    clock.current = { elapsed: 0, startedAt: null };
    setElapsedMs(0);
    setRunning(false);
  }, []);

  const start = () => {
    if (document.hidden || clock.current.elapsed >= DURATION_MS) return;
    clock.current.startedAt = performance.now();
    setRunning(true);
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open || !running) return;
    const tick = () => {
      const next = sample();
      setElapsedMs(next);
      if (next >= DURATION_MS) pause();
    };
    const timer = window.setInterval(tick, 50);
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [open, running, pause, sample]);

  return { elapsedMs, running, finished: elapsedMs >= DURATION_MS, start, pause, reset };
}
