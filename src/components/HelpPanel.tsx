import { useEffect, useRef } from "react";
import { ExternalLink, Phone, X } from "lucide-react";

type HelpPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="overlay overlay--urgent" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="help-title"
        aria-modal="true"
        className="help-panel"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButton} className="icon-button help-panel__close" type="button" onClick={onClose} aria-label="Cerrar opciones de ayuda">
          <X aria-hidden="true" />
        </button>
        <p className="eyebrow">Ayuda ahora</p>
        <h2 id="help-title">Tu seguridad va primero.</h2>
        <p className="help-panel__lead">
          Si hay peligro inmediato o sientes que podrías lastimarte, no te quedes a solas. Llama ahora o acércate a una persona de confianza.
        </p>

        <div className="help-actions">
          <a className="help-action help-action--primary" href="tel:911">
            <Phone aria-hidden="true" />
            <span><small>Emergencia inmediata</small><strong>Llamar al 911</strong></span>
          </a>
          <a className="help-action" href="tel:8009112000">
            <Phone aria-hidden="true" />
            <span><small>Gratis, 24 horas</small><strong>800 911 2000</strong></span>
          </a>
        </div>

        <p className="help-panel__note">
          Línea de la Vida ofrece orientación en salud mental en México las 24 horas, todos los días. Si estás fuera de México, llama al número de emergencias de tu país.
        </p>
        <a className="text-link" href="https://www.gob.mx/lineadelavida" target="_blank" rel="noreferrer">
          Sitio oficial de Línea de la Vida <ExternalLink aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
