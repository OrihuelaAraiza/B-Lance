import { useEffect } from "react";
import { ArrowLeft, HeartHandshake, Home } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { BrandMark } from "./BrandMark";

export function NotFoundPage() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Página no encontrada | B-lance";
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="not-found">
      <header className="not-found__header shell">
        <BrandMark href="/" />
        <a className="not-found__home-link" href="/"><Home aria-hidden="true" /> Inicio</a>
      </header>

      <main className="not-found__main shell">
        <m.div
          className="not-found__visual"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="not-found__code">404</span>
          <m.i
            animate={reduceMotion ? undefined : { x: [-5, 7, -5], y: [3, -6, 3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <b />
        </m.div>

        <m.div
          className="not-found__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.08, ease: "easeOut" }}
        >
          <p className="eyebrow">Esta ruta no está disponible</p>
          <h1>Parece que esta página perdió el equilibrio.</h1>
          <p>No hiciste nada mal. Regresa al inicio y retomamos desde un lugar conocido.</p>
          <div className="not-found__actions">
            <a className="button button--ink" href="/"><ArrowLeft aria-hidden="true" /> Volver al inicio</a>
            <a className="button button--ghost" href="tel:8009112000"><HeartHandshake aria-hidden="true" /> Apoyo en México</a>
          </div>
          <small>Si hay peligro inmediato, llama al 911.</small>
        </m.div>
      </main>
    </div>
  );
}
