import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  Pause,
  X,
} from "lucide-react";
import { frequencyLabels, siscoItems } from "../data/sisco";
import { summarizeSisco, type SiscoAnswers } from "../lib/sisco";
import { WhatsAppLink } from "./WhatsAppLink";

type Phase =
  | "consent"
  | "age"
  | "sex"
  | "education"
  | "campus"
  | "opening"
  | "safety"
  | "offer"
  | "filter"
  | "intensity"
  | "items"
  | "finished";
type Finish = "completed" | "declined" | "filtered";
type Props = {
  onClose: () => void;
  onOpenHelp: () => void;
  onOpenBreathing: () => void;
};

function Options({
  labels,
  onSelect,
}: {
  labels: readonly string[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="choice-grid">
      {labels.map((label, index) => (
        <button
          key={label}
          className="choice"
          type="button"
          onClick={() => onSelect(index)}
        >
          <span>{label}</span>
          <ArrowRight aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

// Local preview only. Unmounting clears every answer. No storage, model or API.
export function AcademicCheckIn({
  onClose,
  onOpenHelp,
  onOpenBreathing,
}: Props) {
  const [phase, setPhase] = useState<Phase>("consent");
  const [accepted, setAccepted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [profile, setProfile] = useState({
    age: "",
    sex: "",
    education: "",
    campus: "",
  });
  const [opening, setOpening] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);
  const [answers, setAnswers] = useState<SiscoAnswers>({});
  const [itemIndex, setItemIndex] = useState(0);
  const [finish, setFinish] = useState<Finish>("declined");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);
  const summary = finish === "completed" ? summarizeSisco(answers) : null;
  const item = siscoItems[itemIndex];
  useEffect(() => {
    headingRef.current?.focus();
    contentRef.current?.scrollTo?.(0, 0);
  }, [phase, itemIndex, paused]);
  const done = (reason: Finish) => {
    setFinish(reason);
    setPhase("finished");
  };
  const help = () => {
    restoreFocus.current = false;
    onOpenHelp();
  };
  const titles: Record<Phase, string> = {
    consent: "Explora cómo te va con la escuela.",
    age: "¿Qué edad usamos en este ejemplo?",
    sex: "Para este ejemplo, ¿cuál es el sexo?",
    education: "¿Qué nivel escolar exploramos?",
    campus: "¿En qué plantel de ejemplo?",
    opening: "¿Cómo se ha sentido este semestre?",
    safety: "Antes de seguir, ¿necesitas ayuda ahora?",
    offer: "¿Quieres explorar las preguntas sobre la escuela?",
    filter:
      "Durante este semestre, ¿has tenido preocupación o nerviosismo relacionados con estrés?",
    intensity: "Del 1 al 5, ¿qué tan intenso se ha sentido?",
    items: item.question,
    finished:
      finish === "completed"
        ? "Gracias por completar el recorrido."
        : "Podemos dejar las preguntas aquí.",
  };
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          ref={contentRef}
          className="checkin academic-checkin"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            opener.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
            headingRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (restoreFocus.current) opener.current?.focus();
          }}
        >
          <header className="checkin__header">
            <div className="checkin__header-left">
              <div>
                <strong>Mi experiencia en la escuela</strong>
                <small>Recorrido de prueba</small>
              </div>
            </div>
            <button
              className="quiet-link checkin__help"
              type="button"
              onClick={help}
            >
              Ayuda ahora
            </button>
            <Dialog.Close asChild>
              <button
                className="icon-button"
                type="button"
                aria-label="Cerrar y borrar el recorrido"
              >
                <X />
              </button>
            </Dialog.Close>
          </header>
          <div className="checkin__body">
            <p className="eyebrow">
              {paused
                ? "A tu ritmo"
                : phase === "items"
                  ? "Piensa en este semestre"
                  : "Un paso a la vez"}
            </p>
            <Dialog.Title asChild>
              <h2 ref={headingRef} tabIndex={-1}>
                {paused ? "Puedes tomar tu tiempo." : titles[phase]}
              </h2>
            </Dialog.Title>
            {paused ? (
              <>
                <p className="question__note">
                  El recorrido está en pausa. Las respuestas solo se conservan
                  mientras esta ventana permanece abierta.
                </p>
                <button
                  className="button button--ink"
                  type="button"
                  onClick={() => setPaused(false)}
                >
                  Continuar donde estaba <ArrowRight />
                </button>
                <button className="quiet-link" type="button" onClick={onClose}>
                  Terminar y borrar
                </button>
              </>
            ) : (
              <>
                {phase === "consent" && (
                  <>
                    <p className="question__note">
                      Esta es una demostración del recorrido SISCO SV-21. Usa
                      datos y situaciones ficticias. No es una consulta ni una
                      evaluación clínica validada.
                    </p>
                    <div className="consent-summary">
                      <p>
                        <LockKeyhole />
                        Tus respuestas permanecen solo en esta sesión; al salir
                        se borran.
                      </p>
                      <p>
                        <Check />
                        Puedes omitir el cuestionario, pausar o pedir ayuda en
                        cualquier momento.
                      </p>
                      <p>
                        <Check />
                        No se asignan niveles de riesgo ni derivaciones por
                        puntaje.
                      </p>
                    </div>
                    <label className="consent-check">
                      <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                      />
                      <span aria-hidden="true">
                        <Check />
                      </span>
                      <strong>
                        Entiendo y quiero probar con datos ficticios
                      </strong>
                    </label>
                    <button
                      className="button button--ink button--wide"
                      disabled={!accepted}
                      type="button"
                      onClick={() => setPhase("age")}
                    >
                      Explorar el recorrido <ArrowRight />
                    </button>
                  </>
                )}
                {phase === "age" && (
                  <>
                    <p className="question__note">
                      El prototipo propone edades de 12 a 29 años. Puedes omitir
                      los datos de contexto.
                    </p>
                    <form
                      className="academic-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        setPhase("sex");
                      }}
                    >
                      <label>
                        Edad de ejemplo
                        <input
                          type="number"
                          min="12"
                          max="29"
                          step="1"
                          required
                          value={profile.age}
                          onChange={(event) =>
                            setProfile({ ...profile, age: event.target.value })
                          }
                        />
                      </label>
                      <button className="button button--ink" type="submit">
                        Continuar <ArrowRight />
                      </button>
                    </form>
                    <button
                      className="quiet-link"
                      type="button"
                      onClick={() => setPhase("opening")}
                    >
                      Omitir datos de contexto
                    </button>
                  </>
                )}
                {phase === "sex" && (
                  <>
                    <p className="question__note">
                      Solo para explorar el registro propuesto; no se guarda.
                    </p>
                    <Options
                      labels={[
                        "Mujer",
                        "Hombre",
                        "Otro",
                        "Prefiero no responder",
                      ]}
                      onSelect={(index) => {
                        setProfile({
                          ...profile,
                          sex: ["female", "male", "other", "prefer_not_answer"][
                            index
                          ],
                        });
                        setPhase("education");
                      }}
                    />
                  </>
                )}
                {phase === "education" && (
                  <>
                    <p className="question__note">
                      Elige un contexto de demostración.
                    </p>
                    <Options
                      labels={[
                        "Secundaria",
                        "Bachillerato",
                        "Universidad",
                        "Otro",
                      ]}
                      onSelect={(index) => {
                        setProfile({
                          ...profile,
                          education: [
                            "secondary",
                            "high_school",
                            "university",
                            "other",
                          ][index],
                        });
                        setPhase("campus");
                      }}
                    />
                  </>
                )}
                {phase === "campus" && (
                  <>
                    <p className="question__note">
                      Todavía no hay un catálogo institucional conectado.
                    </p>
                    <Options
                      labels={["Plantel de demostración", "Prefiero omitirlo"]}
                      onSelect={(index) => {
                        setProfile({
                          ...profile,
                          campus: index === 0 ? "demo" : "",
                        });
                        setPhase("opening");
                      }}
                    />
                  </>
                )}
                {phase === "opening" && (
                  <>
                    <p className="question__note">
                      Puedes escribir un ejemplo ficticio u omitirlo. Este texto
                      no se analiza automáticamente y no determina tus
                      resultados. Si necesitas ayuda, usa «Ayuda ahora».
                    </p>
                    <form
                      className="academic-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        setPhase("safety");
                      }}
                    >
                      <label>
                        Ejemplo de cómo ha ido el semestre (opcional)
                        <textarea
                          maxLength={600}
                          rows={4}
                          value={opening}
                          onChange={(event) => setOpening(event.target.value)}
                          placeholder="Por ejemplo: se juntaron tareas y exámenes…"
                        />
                      </label>
                      <button className="button button--ink" type="submit">
                        Continuar <ArrowRight />
                      </button>
                    </form>
                  </>
                )}
                {phase === "safety" && (
                  <>
                    <p className="question__note">
                      Si estás en peligro, piensas en hacerte daño o no estás
                      seguro de estar a salvo, puedes ir directamente a opciones
                      de ayuda humana.
                    </p>
                    <Options
                      labels={[
                        "Estoy a salvo, quiero continuar",
                        "Necesito ayuda o no estoy seguro/a",
                      ]}
                      onSelect={(index) => {
                        if (index === 1) help();
                        else setPhase("offer");
                      }}
                    />
                  </>
                )}
                {phase === "offer" && (
                  <>
                    <p className="question__note">
                      Primero hay dos preguntas breves y, si corresponde, 21
                      situaciones con opciones de frecuencia. Es voluntario;
                      puedes continuar con otros recursos.
                    </p>
                    <Options
                      labels={[
                        "Sí, quiero responder",
                        "Ahora no, prefiero ver recursos",
                      ]}
                      onSelect={(index) => {
                        if (index === 0) setPhase("filter");
                        else done("declined");
                      }}
                    />
                  </>
                )}
                {phase === "filter" && (
                  <>
                    <p className="question__note">
                      Piensa en el semestre que estás tomando como ejemplo.
                    </p>
                    <Options
                      labels={["Sí", "No"]}
                      onSelect={(index) => {
                        if (index === 0) setPhase("intensity");
                        else done("filtered");
                      }}
                    />
                  </>
                )}
                {phase === "intensity" && (
                  <>
                    <p className="question__note">
                      1 significa poco y 5 significa mucho. Esta intensidad se
                      registra por separado de las preguntas de frecuencia.
                    </p>
                    <Options
                      labels={["1 · Poco", "2", "3", "4", "5 · Mucho"]}
                      onSelect={(index) => {
                        setIntensity(index + 1);
                        setPhase("items");
                      }}
                    />
                  </>
                )}
                {phase === "items" && (
                  <>
                    <p className="question__note">
                      Elige con qué frecuencia te ocurre en este ejemplo. No hay
                      respuestas correctas o incorrectas.
                    </p>
                    <Options
                      labels={frequencyLabels}
                      onSelect={(value) => {
                        setAnswers({ ...answers, [item.id]: value });
                        if (itemIndex === siscoItems.length - 1)
                          done("completed");
                        else setItemIndex(itemIndex + 1);
                      }}
                    />
                    <div
                      className="academic-progress"
                      role="progressbar"
                      aria-label="Avance del cuestionario"
                      aria-valuemin={0}
                      aria-valuemax={21}
                      aria-valuenow={itemIndex}
                    >
                      <i style={{ width: `${(itemIndex / 21) * 100}%` }} />
                    </div>
                    <button
                      className="quiet-link"
                      type="button"
                      onClick={() => {
                        if (itemIndex === 0) setPhase("intensity");
                        else setItemIndex(itemIndex - 1);
                      }}
                    >
                      <ArrowLeft /> Volver a la pregunta anterior
                    </button>
                  </>
                )}
                {phase === "finished" && (
                  <>
                    <p className="question__note">
                      {finish === "completed"
                        ? "Has explorado situaciones escolares, lo que notas en ti y tus formas de afrontar el estrés. Esto no determina tu estado de salud ni un nivel de riesgo. Puedes elegir qué hacer ahora."
                        : finish === "filtered"
                          ? "Con tu respuesta al filtro, esta parte termina. No se calcula una puntuación ni se concluye que no necesites apoyo."
                          : "No responder también es una opción. No calculamos una puntuación ni asignamos una clasificación si omites el cuestionario."}
                    </p>
                    {summary && (
                      <details className="academic-summary">
                        <summary>Ver resumen descriptivo</summary>
                        <p>
                          Promedios de frecuencia de 0 a 5. Una mayor frecuencia
                          de afrontamiento no significa mayor estrés.
                        </p>
                        <dl>
                          <div>
                            <dt>Situaciones que generan estrés</dt>
                            <dd>{summary.stressors.toFixed(2)}</dd>
                          </div>
                          <div>
                            <dt>Reacciones ante el estrés</dt>
                            <dd>{summary.symptoms.toFixed(2)}</dd>
                          </div>
                          <div>
                            <dt>Estrategias de afrontamiento</dt>
                            <dd>{summary.coping.toFixed(2)}</dd>
                          </div>
                          <div>
                            <dt>Intensidad elegida</dt>
                            <dd>{intensity} / 5</dd>
                          </div>
                        </dl>
                        <p>
                          21 respuestas completas. Interpretación y criterios de
                          derivación pendientes de revisión profesional; sin
                          clasificación clínica.
                        </p>
                      </details>
                    )}
                    <div className="outcome__actions">
                      <button
                        className="button button--ink"
                        type="button"
                        onClick={() => {
                          restoreFocus.current = false;
                          onOpenBreathing();
                        }}
                      >
                        Tomar una pausa guiada
                      </button>
                      <WhatsAppLink className="button button--paper" />
                      <button
                        className="quiet-link"
                        type="button"
                        onClick={help}
                      >
                        Ver recursos de ayuda
                      </button>
                      <button
                        className="quiet-link"
                        type="button"
                        onClick={onClose}
                      >
                        Terminar y borrar
                      </button>
                    </div>
                  </>
                )}
                {phase !== "consent" && phase !== "finished" && (
                  <div className="academic-controls">
                    <button
                      className="quiet-link"
                      type="button"
                      onClick={() => setPaused(true)}
                    >
                      <Pause /> Pausar recorrido
                    </button>
                    <button
                      className="quiet-link"
                      type="button"
                      onClick={onClose}
                    >
                      Terminar y borrar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <footer className="checkin__footer">
            <span>
              <LockKeyhole />
              Demo local · sin almacenamiento
            </span>
            <span>No sustituye la atención profesional</span>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
