import {
  ArrowRight,
  Heart,
  HeartHandshake,
  NotebookPen,
  Pause,
  UsersRound,
} from "lucide-react";
import { WhatsAppLink } from "./WhatsAppLink";

type Props = {
  onCheckIn: () => void;
  onAcademic: () => void;
  onPause: () => void;
};
export function YouthSection({ onCheckIn, onAcademic, onPause }: Props) {
  return (
    <section className="section youth-section" id="jovenes" tabIndex={-1}>
      <div className="shell">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Para jóvenes · a tu ritmo</p>
            <h2>
              Un espacio para ti.
              <br />
              <em>Un paso a la vez.</em>
            </h2>
          </div>
          <p>
            No necesitas tener todo claro para empezar. Elige lo que te sirva
            hoy: ubicar una emoción, hacer una pausa o hablar con alguien.
          </p>
        </div>
        <div className="youth-tools">
          <button type="button" onClick={onCheckIn}>
            <Heart />
            <span>
              <strong>¿Cómo estoy hoy?</strong>
              <small>Un check-in breve para ubicar lo que sientes.</small>
            </span>
            <ArrowRight />
          </button>
          <button type="button" onClick={onPause}>
            <Pause />
            <span>
              <strong>Necesito una pausa</strong>
              <small>50 segundos de respiración, a tu ritmo.</small>
            </span>
            <ArrowRight />
          </button>
          <button type="button" onClick={onAcademic}>
            <NotebookPen />
            <span>
              <strong>La escuela me pesa</strong>
              <small>Explora el recorrido de estrés académico.</small>
            </span>
            <ArrowRight />
          </button>
        </div>
        <article className="ask-support" aria-labelledby="support-title">
          <div className="ask-support__copy">
            <p className="eyebrow">No tienes que hacerlo a solas</p>
            <h3 id="support-title">Cuándo pedir apoyo</h3>
            <p>
              Si la tristeza, la ansiedad o el agobio persisten, afectan tu día
              o sientes que las cosas no mejoran, hablar con alguien puede ser
              un primer paso. No necesitas esperar a sentirte peor.
            </p>
            <details className="support-signs">
              <summary>
                Conoce las señales <ArrowRight aria-hidden="true" />
              </summary>
              <ul>
                <li>
                  Te cuesta descansar, concentrarte o hacer tus actividades.
                </li>
                <li>Lo que sientes se vuelve difícil de manejar a solas.</li>
                <li>
                  Necesitas que alguien te escuche y te ayude a buscar opciones.
                </li>
              </ul>
              <a className="text-link" href="#zona-segura">
                Si estás en peligro, ve a ayuda inmediata <ArrowRight />
              </a>
            </details>
          </div>
          <div
            className="ask-support__art"
            role="img"
            aria-label="Nabi abraza un corazón: siempre hay alguien que te escucha"
          />
          <div className="ask-support__reminders">
            <p>
              <UsersRound />
              <span>
                <strong>Habla con alguien de confianza</strong>Una amistad,
                familiar, docente o profesional.
              </span>
            </p>
            <p>
              <HeartHandshake />
              <span>
                <strong>Pedir ayuda también es cuidarte</strong>Tu bienestar
                importa. No estás a solas.
              </span>
            </p>
            <WhatsAppLink className="button button--paper" />
            <small>
              Se abre una aplicación externa. Tú decides qué compartir; tus
              respuestas no se envían al chat.
            </small>
          </div>
        </article>
      </div>
    </section>
  );
}
