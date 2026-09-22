import {
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardList,
  Search,
  ShieldCheck,
} from "lucide-react";
import { RealtimePreview } from "./RealtimePreview";
import { WhatsAppLink } from "./WhatsAppLink";

export function ProfessionalSection({
  onAcademic,
}: {
  onAcademic: () => void;
}) {
  return (
    <section
      className="section institutional-section"
      id="instituciones"
      tabIndex={-1}
    >
      <div className="shell">
        <div className="institutional-section__grid">
          <div>
            <p className="eyebrow">
              Para profesionales · escuelas e instituciones
            </p>
            <h2>Información que se convierte en cuidado.</h2>
            <p className="section-lead">
              Comprender el bienestar de una comunidad puede ayudar a diseñar
              mejores entornos. B-lance propone conectar herramientas para
              jóvenes con información poblacional para orientar la prevención.
            </p>
            <p className="professional-note">
              Explora una vista con datos ficticios. La conexión institucional y
              el protocolo clínico aún están en desarrollo.
            </p>
            <div className="professional-actions">
              <button
                className="button button--ink"
                type="button"
                onClick={onAcademic}
              >
                Explorar el recorrido académico <ArrowRight />
              </button>
              <a className="quiet-link" href="#como-funciona">
                Conocer cómo funciona
              </a>
            </div>
          </div>
          <RealtimePreview />
        </div>
        <div className="professional-capabilities">
          <article>
            <ClipboardList />
            <h3>Tamizaje estructurado</h3>
            <p>
              Recorrido de prueba basado en la propuesta SISCO SV-21:
              situaciones escolares, reacciones y afrontamiento.
            </p>
          </article>
          <article>
            <ChartNoAxesCombined />
            <h3>Análisis poblacional</h3>
            <p>
              La propuesta contempla agrupar información por comunidad y periodo
              para comprender tendencias.
            </p>
          </article>
          <article>
            <Search />
            <h3>Identificación de patrones</h3>
            <p>
              Reconocer estresores frecuentes, reacciones y recursos de
              afrontamiento para ubicar áreas de atención.
            </p>
          </article>
          <article>
            <ShieldCheck />
            <h3>Orientación preventiva</h3>
            <p>
              Convertir los hallazgos en programas y recursos con acompañamiento
              profesional, sin evaluar ni castigar a individuos.
            </p>
          </article>
        </div>
        <div className="professional-process">
          <p className="eyebrow">El camino propuesto de la información</p>
          <ol>
            <li>Respuestas estructuradas</li>
            <li>Agregación por población</li>
            <li>Lectura de tendencias</li>
            <li>Acciones preventivas</li>
          </ol>
          <p>
            La conversación y el cálculo del cuestionario son capas distintas.
            Las reglas de seguridad y derivación deben definirse con
            profesionales; una IA no debe inventar puntuaciones ni decidirlas
            por sí sola.
          </p>
        </div>
        <div className="professional-bottom">
          <p>
            <ShieldCheck />
            Los indicadores institucionales previstos son agregados. Esta demo
            no recopila conversaciones ni genera expedientes personales.{" "}
            <a href="#zona-segura">Conoce los límites y la privacidad.</a>
          </p>
          <WhatsAppLink className="button button--paper">
            Solicitar una demostración
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
