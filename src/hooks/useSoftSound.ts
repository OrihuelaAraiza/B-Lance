import { useCallback, useEffect, useRef, useState } from "react";
import { sounds, soundSource, type SoundId } from "../data/sounds";

export function useSoftSound() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SoundId>(sounds[0].id);
  const audioRef = useRef<HTMLAudioElement>(null);
  const requested = useRef(false);
  const attempt = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPause = () => { if (audio.paused) setEnabled(false); };
    const onError = () => {
      if (!audio.error) return;
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

  const start = async (audio: HTMLAudioElement) => {
    const currentAttempt = ++attempt.current;
    setError("");
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

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (requested.current && (!audio.paused || loading)) {
      attempt.current += 1;
      requested.current = false;
      audio.pause();
      setEnabled(false);
      setLoading(false);
      setError("");
      return;
    }
    return start(audio);
  };

  const selectSound = (id: SoundId) => {
    const audio = audioRef.current;
    if (!audio || id === selected) return;
    const shouldPlay = requested.current;
    attempt.current += 1;
    audio.pause();
    setEnabled(false);
    setLoading(false);
    setError("");
    setSelected(id);
    // Change the single player synchronously so play retains the user gesture
    // on mobile browsers, and obsolete play promises cannot update the UI.
    audio.src = soundSource(id);
    if (shouldPlay) return start(audio);
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

  return { audioRef, enabled, loading, error, selected, selectSound, toggle, play };
}
