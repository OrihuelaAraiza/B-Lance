import {
  ArrowRight,
  Check,
  ExternalLink,
  FileText,
  LockKeyhole,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { lifeLineUrl } from "../data/contact";
import { legalDocuments } from "../data/legal";
import { WhatsAppLink } from "./WhatsAppLink";

export function SafeZone() {
  return (
    <section className="section safe-zone" id="zona-segura" tabIndex={-1}>
      <span id="privacidad" className="anchor-alias" />
      <div className="shell">
        <div className="safe-zone__grid">
          <div className="safe-zone__intro">
            <ShieldCheck className="safe-zone__icon" aria-hidden="true" />
            <p className="eyebrow">Zona segura</p>
            <h2>
              Tu bienestar primero.
              <br />
              Tu información también.
            </h2>
            <p>
              Lo que sientes no es una calificación. Aquí puedes encontrar
              ayuda, conocer cómo funciona esta demo y decidir qué quieres
              compartir.
            </p>
            <a className="text-link" href="#nuestros-compromisos">
              Conoce nuestros compromisos <ArrowRight />
            </a>
          </div>
          <aside className="crisis-resources" aria-labelledby="crisis-title">
            <p className="eyebrow">Ayuda inmediata · México</p>
            <h3 id="crisis-title">Hay alguien que puede escucharte.</h3>
            <p>
              Si estás en peligro o sientes que podrías hacerte daño, busca
              ayuda ahora y acércate a una persona de confianza.
            </p>
            <a href="tel:911" className="crisis-resources__phone">
              <Phone />
              <span>
                <strong>911</strong>
                <small>Emergencias · peligro inmediato</small>
              </span>
              <ArrowRight />
            </a>
            <a href="tel:8009112000" className="crisis-resources__phone">
              <Phone />
              <span>
                <strong>800 911 2000</strong>
                <small>Línea de la Vida · gratuita, 24 horas</small>
              </span>
              <ArrowRight />
            </a>
            <a
              className="text-link"
              href={lifeLineUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sitio oficial de Línea de la Vida <ExternalLink />
            </a>
            <small>
              Fuera de México, llama al número de emergencias de tu país.
            </small>
          </aside>
        </div>
        <div id="nuestros-compromisos" className="safe-commitments">
          <div>
            <Check />
            <strong>Sin uso punitivo</strong>
            <p>
              Las emociones no se usan para castigar, disciplinar o evaluar a
              una persona.
            </p>
          </div>
          <div>
            <LockKeyhole />
            <strong>Sin venta de datos</strong>
            <p>
              Esta demo no envía tus respuestas ni las guarda al cerrar el
              recorrido.
            </p>
          </div>
          <div>
            <ShieldCheck />
            <strong>Límites claros</strong>
            <p>
              Orientación general. No ofrece diagnósticos, terapia ni atención
              de emergencias.
            </p>
          </div>
        </div>
        <div className="safe-details">
          <details>
            <summary>
              Cómo cuidamos tu información <span>+</span>
            </summary>
            <p>
              Las respuestas solo se mantienen en memoria mientras usas el
              recorrido. No hay cuentas, base de datos ni envío a instituciones.
              Las gráficas usan datos ficticios, separados de tus respuestas.
            </p>
            <p>
              Al abrir WhatsApp pasas a un servicio externo que puede mostrar tu
              número y perfil. Solo se prepara un saludo genérico; nunca se
              adjuntan respuestas. Revisa sus condiciones antes de compartir
              información personal.
            </p>
            <p>
              Para una futura versión institucional se prevén datos mínimos,
              acceso autorizado y tendencias agregadas. Esa conexión aún no está
              habilitada.
            </p>
          </details>
          <details>
            <summary>
              Qué puede y qué no puede hacer B-lance <span>+</span>
            </summary>
            <p>
              Puede ofrecer preguntas de reflexión, una pausa guiada y contactos
              de ayuda. Puedes salir cuando quieras.
            </p>
            <p>
              No interpreta mensajes con IA, no determina un nivel de riesgo
              clínico, no predice tu futuro ni sustituye a un profesional. El
              recorrido académico está en prueba: sus reglas de interpretación y
              derivación requieren revisión de psicología.
            </p>
            <p>
              Los recursos de ayuda están disponibles en todo momento. No
              necesitas terminar un cuestionario para usarlos.
            </p>
          </details>
        </div>
        <div className="legal-documents" aria-labelledby="legal-documents-title">
          <h3 id="legal-documents-title">Términos y privacidad</h3>
          <p>
            Consulta los documentos completos de B-lance. Última actualización:
            {" "}<time dateTime="2026-09-22">22 de septiembre de 2026</time>.
          </p>
          <div className="legal-documents__links">
            {legalDocuments.map((document) => (
              <a
                key={document.href}
                href={document.href}
                target="_blank"
                rel="noopener noreferrer"
                className="legal-documents__link"
              >
                <FileText aria-hidden="true" />
                <span>
                  <strong>{document.title}</strong>
                  <small>PDF · {document.pages} páginas · Nueva pestaña</small>
                </span>
                <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div className="safe-contact">
          <div>
            <strong>¿Quieres contactar a B-lance?</strong>
            <p>
              Abre el chat para conocer las opciones de apoyo. No es una línea
              de emergencias y no se ha confirmado un horario de atención.
            </p>
          </div>
          <WhatsAppLink />
        </div>
      </div>
    </section>
  );
}
