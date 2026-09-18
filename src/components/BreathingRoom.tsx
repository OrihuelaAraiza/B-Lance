import { useBreathingClock } from "../hooks/useBreathingClock";
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
  const { elapsedMs, running, finished, start, pause, reset } = useBreathingClock(open);
  const elapsed = Math.floor(elapsedMs / 1000);
  const cue = getBreathCue(elapsed);
  const cycle = (elapsedMs % 10_000) / 1000;
  const progress = cycle < 4 ? cycle / 4 : (10 - cycle) / 6;
  const eased = (1 - Math.cos(Math.PI * progress)) / 2;
  const announcement = finished ? "Pausa terminada. Nota cómo se siente tu cuerpo." : running
    ? `${cue.label}. ${cue.detail}.` : elapsedMs > 0 ? "Pausa detenida. Puedes continuar cuando quieras." : "Pausa de 50 segundos lista para empezar.";

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

        <div className={`breath-orbit breath-orbit--${cue.phase}${running ? " is-running" : ""}`} aria-hidden="true">
          <div className="breath-orbit__halo" style={{ transform: `scale(${0.78 + eased * 0.22}) rotate(${-3 + eased * 5}deg)`, opacity: 0.55 + eased * 0.45 }} />
          <div className="breath-orbit__core">
            <span>{finished ? "Listo" : running ? cue.label : elapsedMs > 0 ? "En pausa" : "Tu pausa"}</span>
            <strong>{finished ? "✓" : elapsedMs > 0 || running ? cue.countdown : "50"}</strong>
            <small>{finished ? "Nota cómo se siente tu cuerpo" : elapsedMs > 0 || running ? cue.detail : "segundos"}</small>
          </div>
        </div>

        <p className="sr-only" role="status" aria-atomic="true">{announcement}</p>
        <div className="breathing-controls">
          <button className="button button--ink" type="button" onClick={() => finished ? reset() : running ? pause() : start()}>
            {finished ? <RotateCcw aria-hidden="true" /> : running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {finished ? "Repetir la pausa" : running ? "Pausar" : elapsedMs > 0 ? "Continuar" : "Empezar"}
          </button>
          <span>{Math.min(elapsed, SESSION_SECONDS)} / {SESSION_SECONDS} s</span>
        </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
