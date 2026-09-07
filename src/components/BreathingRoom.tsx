import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
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

  const reset = () => {
    setElapsed(0);
    setRunning(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay overlay--breathing" />
        <Dialog.Content className="breathing-room" aria-describedby={undefined}>
          <Dialog.Close asChild>
            <button className="icon-button breathing-room__close" type="button" aria-label="Cerrar pausa guiada">
              <X aria-hidden="true" />
            </button>
          </Dialog.Close>
        <div className="breathing-room__copy">
          <p className="eyebrow">Pausa sensorial · 50 segundos</p>
          <Dialog.Title asChild><h2>Solo sigue el ritmo.</h2></Dialog.Title>
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
            {finished ? "Repetir la pausa" : running ? "Pausar" : "Empezar"}
          </button>
          <span>{Math.min(elapsed, SESSION_SECONDS)} / {SESSION_SECONDS} s</span>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
