import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, Phone, X } from "lucide-react";

type HelpPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay overlay--urgent" />
        <Dialog.Content
          className="help-panel"
          aria-describedby="help-description"
        >
          <Dialog.Close asChild>
            <button
              className="icon-button help-panel__close"
              type="button"
              aria-label="Cerrar opciones de ayuda"
            >
              <X aria-hidden="true" />
            </button>
          </Dialog.Close>
          <p className="eyebrow">Ayuda ahora</p>
          <Dialog.Title asChild>
            <h2>Tu seguridad va primero.</h2>
          </Dialog.Title>
          <Dialog.Description asChild>
            <p className="help-panel__lead" id="help-description">
              Si hay peligro inmediato o sientes que podrías lastimarte, no te
              quedes a solas. Llama ahora o acércate a una persona de confianza.
            </p>
          </Dialog.Description>

          <div className="help-actions">
            <a className="help-action help-action--primary" href="tel:911">
              <Phone aria-hidden="true" />
              <span>
                <small>Emergencia inmediata</small>
                <strong>Llamar al 911</strong>
              </span>
            </a>
            <a className="help-action" href="tel:8009112000">
              <Phone aria-hidden="true" />
              <span>
                <small>Línea de la Vida · 24 horas</small>
                <strong>800 911 2000</strong>
              </span>
            </a>
          </div>

          <p className="help-panel__note">
            En México, Línea de la Vida ofrece orientación en salud mental las
            24 horas, todos los días. Si estás fuera de México, llama al número
            de emergencias de tu país.
          </p>
          <a
            className="text-link"
            href="https://www.gob.mx/lineadelavida"
            target="_blank"
            rel="noreferrer"
          >
            Sitio oficial de Línea de la Vida{" "}
            <ExternalLink aria-hidden="true" />
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
