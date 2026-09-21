import { useCallback, useEffect, useRef, useState } from "react";

export function useSoftSound() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const requested = useRef(false);
  const attempt = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPause = () => setEnabled(false);
    const onError = () => {
      requested.current = false;
      attempt.current += 1;
      setEnabled(false);
      setLoading(false);
      setError("No se pudo reproducir el sonido. Pulsa el botón para intentar de nuevo.");
    };
    const stop = () => {
      requested.current = false;
      attempt.current += 1;
      audio.pause();
      setEnabled(false);
      setLoading(false);
    };
    const onVisibility = () => { if (document.hidden) stop(); };
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", stop);
    return () => {
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", stop);
      requested.current = false;
      attempt.current += 1;
      audio.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const currentAttempt = ++attempt.current;
    setError("");
    if (requested.current && (!audio.paused || loading)) {
      requested.current = false;
      audio.pause();
      setEnabled(false);
      setLoading(false);
      return;
    }
    requested.current = true;
    setLoading(true);
    try {
      // Retry a failed download and invoke play directly from the user gesture.
      if (audio.error) audio.load();
      await audio.play();
      if (attempt.current === currentAttempt) setEnabled(!audio.paused);
    } catch {
      if (attempt.current === currentAttempt) {
        requested.current = false;
        setEnabled(false);
        setError("No se pudo reproducir el sonido. Pulsa el botón para intentar de nuevo.");
      }
    } finally {
      if (attempt.current === currentAttempt) setLoading(false);
    }
  };

  const play = useCallback(() => {
    if (!enabled) return;

    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(84, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.16);
    oscillator.addEventListener("ended", () => void context.close(), { once: true });
    void context.resume().catch(() => context.close());
  }, [enabled]);

  return { audioRef, enabled, loading, error, toggle, play };
}
