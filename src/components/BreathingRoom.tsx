import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";

type BreathingRoomProps = {
  open: boolean;
  onClose: () => void;
};

const SESSION_SECONDS = 50;

function getBreathCue(elapsed: number) {
  const cycleSecond = elapsed % 10;
  if (cycleSecond < 4) return { label: "Inhala", detail: "Suave, por la nariz", phase: "inhale", countdown: 4 - cycleSecond };
  return { label: "Suelta", detail: "Sin prisa, por la boca", phase: "exhale", countdown: 10 - cycleSecond };
}

export function BreathingRoom({ open, onClose }: BreathingRoomProps) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const finished = elapsed >= SESSION_SECONDS;
  const cue = getBreathCue(elapsed);

  useEffect(() => {
    if (!open || !running || finished) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, open, running]);

  useEffect(() => {
    if (!open) {
      setElapsed(0);
      setRunning(false);
    }
  }, [open]);

  if (!open) return null;

  const reset = () => {
    setElapsed(0);
    setRunning(false);
  };

  return (
    <div className="overlay overlay--breathing" role="presentation">
      <section className="breathing-room" role="dialog" aria-modal="true" aria-labelledby="breathing-title">
        <button className="icon-button breathing-room__close" type="button" onClick={onClose} aria-label="Cerrar pausa guiada">
          <X aria-hidden="true" />
        </button>
        <div className="breathing-room__copy">
          <p className="eyebrow">Pausa sensorial · 50 segundos</p>
          <h2 id="breathing-title">Solo sigue el ritmo.</h2>
          <p>No tienes que resolver nada mientras respiras.</p>
        </div>

        <div className={`breath-orbit breath-orbit--${cue.phase}${running ? " is-running" : ""}`} aria-live="polite">
          <div className="breath-orbit__halo" />
          <div className="breath-orbit__core">
            <span>{finished ? "Listo" : running ? cue.label : "Tu pausa"}</span>
            <strong>{finished ? "✓" : running ? cue.countdown : "50"}</strong>
            <small>{finished ? "Nota cómo se siente tu cuerpo" : running ? cue.detail : "segundos"}</small>
          </div>
        </div>

        <div className="breathing-controls">
          <button className="button button--ink" type="button" onClick={() => finished ? reset() : setRunning((value) => !value)}>
            {finished ? <RotateCcw aria-hidden="true" /> : running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {finished ? "Hacer otra vez" : running ? "Pausar" : "Empezar"}
          </button>
          <span>{Math.min(elapsed, SESSION_SECONDS)} / {SESSION_SECONDS} s</span>
        </div>
      </section>
    </div>
  );
}
