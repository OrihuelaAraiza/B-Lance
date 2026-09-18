import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartHandshake,
  LockKeyhole,
  MessageCircleHeart,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import {
  defaultAnswers,
  getScreeningOutcome,
  type Intensity,
  type SafetyAnswer,
  type ScreeningAnswers,
  type ScreeningOutcome,
  type SupportAnswer,
} from "../lib/screening";

type CheckInProps = {
  open: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
  onOpenBreathing: () => void;
  playSound: () => void;
};

type Choice = {
  label: string;
  detail?: string;
  value: string | number | boolean;
};

function ChoiceGrid({ choices, onSelect }: { choices: Choice[]; onSelect: (choice: Choice) => void }) {
  return (
    <div className="choice-grid">
      {choices.map((choice) => (
        <button className="choice" key={String(choice.value)} type="button" onClick={() => onSelect(choice)}>
          <span>{choice.label}</span>
          {choice.detail && <small>{choice.detail}</small>}
          <ArrowRight aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

const intensityChoices: Choice[] = [
  { label: "Casi nada", detail: "Está ahí, pero puedo seguir", value: 0 },
  { label: "Un poco", detail: "Me distrae por momentos", value: 1 },
  { label: "Bastante", detail: "Me cuesta sacarlo de mi cabeza", value: 2 },
  { label: "Mucho", detail: "Está ocupando casi todo", value: 3 },
  { label: "Es demasiado", detail: "Siento que me rebasa", value: 4 },
];

const impactChoices: Choice[] = [
  { label: "Poco", detail: "Puedo hacer la mayoría de mis cosas", value: 0 },
  { label: "Algo", detail: "Me cuesta concentrarme o descansar", value: 1 },
  { label: "Bastante", detail: "Ya afecta mis actividades, mi sueño o mis relaciones", value: 3 },
  { label: "Por completo", detail: "No puedo seguir con mi día", value: 4 },
];

export function CheckIn({ open, onClose, onOpenHelp, onOpenBreathing, playSound }: CheckInProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(true);
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [answers, setAnswers] = useState<ScreeningAnswers>(defaultAnswers);
  const [outcome, setOutcome] = useState<ScreeningOutcome | null>(null);

  const reset = useCallback(() => {
    setStep(0);
    setAccepted(false);
    setAnswers(defaultAnswers);
    setOutcome(null);
  }, []);

  const dismiss = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (open) bodyRef.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [open, step, outcome]);

  const showHelp = () => {
    restoreFocus.current = false;
    dismiss();
    onOpenHelp();
  };

  const advance = (next: ScreeningAnswers, nextStep: number) => {
    playSound();
    setAnswers(next);
    setStep(nextStep);
  };

  const complete = (next: ScreeningAnswers) => {
    playSound();
    setAnswers(next);
    setOutcome(getScreeningOutcome(next));
  };

  const goBack = () => {
    playSound();
    if (outcome) {
      setOutcome(null);
      return;
    }
    setStep((value) => Math.max(0, value - 1));
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!nextOpen) dismiss(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay checkin-overlay" />
        <Dialog.Content className={`checkin${outcome ? ` checkin--${outcome}` : ""}`} aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            restoreFocus.current = true;
            bodyRef.current?.querySelector<HTMLElement>("h2")?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (restoreFocus.current) opener.current?.focus();
          }}
        >
        <header className="checkin__header">
          <div className="checkin__header-left">
            {(step > 0 || outcome) && (
              <button className="icon-button" type="button" onClick={goBack} aria-label="Volver a la pregunta anterior">
                <ArrowLeft aria-hidden="true" />
              </button>
            )}
            <div>
              <strong>Check-in</strong>
              <small>{outcome ? "Tu siguiente paso" : step === 0 ? "Antes de empezar" : `Pregunta ${step} de 5`}</small>
            </div>
          </div>
          <button className="quiet-link checkin__help" type="button" onClick={showHelp}>Ayuda ahora</button>
          <Dialog.Close asChild>
            <button className="icon-button" type="button" aria-label="Cerrar check-in">
              <X aria-hidden="true" />
            </button>
          </Dialog.Close>
        </header>

        <div className="checkin__progress" aria-hidden="true"><i style={{ width: `${outcome ? 100 : (step / 5) * 100}%` }} /></div>

        <div className="checkin__body" ref={bodyRef}>
          {outcome ? (
            <Outcome
              outcome={outcome}
              onBreathing={() => { restoreFocus.current = false; dismiss(); onOpenBreathing(); }}
              onHelp={showHelp}
              onReset={reset}
            />
          ) : step === 0 ? (
            <div className="checkin-intro">
              <span className="checkin-intro__icon"><Sparkles aria-hidden="true" /></span>
              <p className="eyebrow">Toma cerca de 2 minutos</p>
              <Dialog.Title asChild><h2 tabIndex={-1}>Primero ubicamos cómo estás. Después, te damos una salida clara.</h2></Dialog.Title>
              <p className="checkin-intro__lead">
                No hay respuestas buenas o malas. Puedes salir cuando quieras y esta demo no guarda tus respuestas.
              </p>

              <div className="consent-summary">
                <p><Check aria-hidden="true" /> Orientación y bienestar general, no diagnóstico.</p>
                <p><Check aria-hidden="true" /> Si detectamos una urgencia, pausamos el flujo y te mostramos ayuda directa.</p>
                <p><LockKeyhole aria-hidden="true" /> En esta maqueta, tus respuestas no salen de este dispositivo ni se almacenan.</p>
              </div>

              <label className="consent-check">
                <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                <span aria-hidden="true"><Check /></span>
                <strong>Entiendo y quiero continuar</strong>
              </label>
              <button className="button button--coral button--wide" type="button" disabled={!accepted} onClick={() => advance(answers, 1)}>
                Empezar mi check-in <ArrowRight aria-hidden="true" />
              </button>
              <button className="quiet-link" type="button" onClick={showHelp}>Necesito ayuda inmediata</button>
            </div>
          ) : step === 1 ? (
            <Question eyebrow="Tu seguridad" title="¿Estás en peligro ahora o alguien puede lastimarte?" note="Si la respuesta es sí, iremos directo a opciones de ayuda.">
              <ChoiceGrid choices={[
                { label: "No, estoy a salvo", value: false },
                { label: "Sí, necesito ayuda ahora", value: true },
              ]} onSelect={(choice) => {
                const next = { ...answers, immediateDanger: Boolean(choice.value) };
                if (next.immediateDanger) complete(next); else advance(next, 2);
              }} />
            </Question>
          ) : step === 2 ? (
            <Question eyebrow="Lo que sientes" title="En este momento, ¿qué tan intenso se siente?" note="Piensa en la emoción o sensación que más pesa.">
              <ChoiceGrid choices={intensityChoices} onSelect={(choice) => advance({ ...answers, intensity: choice.value as Intensity }, 3)} />
            </Question>
          ) : step === 3 ? (
            <Question eyebrow="Tu día" title="¿Cuánto está afectando lo que necesitas hacer hoy?" note="Puede ser dormir, comer, estudiar, trabajar o convivir.">
              <ChoiceGrid choices={impactChoices} onSelect={(choice) => advance({ ...answers, impact: choice.value as Intensity }, 4)} />
            </Question>
          ) : step === 4 ? (
            <Question eyebrow="Pregunta directa" title="¿Has pensado en hacerte daño o en no querer seguir aquí?" note="Preguntarlo con claridad nos ayuda a orientarte mejor.">
              <ChoiceGrid choices={[
                { label: "No", value: "no" },
                { label: "Me ha pasado, pero no ahora", value: "sometimes" },
                { label: "Sí, ahora", value: "now" },
              ]} onSelect={(choice) => {
                const next = { ...answers, safety: choice.value as SafetyAnswer };
                if (next.safety === "now") complete(next); else advance(next, 5);
              }} />
            </Question>
          ) : (
            <Question eyebrow="Tu red" title="¿Hay alguien con quien puedas hablar hoy?" note="Puede ser una amistad, familiar, docente o profesional.">
              <ChoiceGrid choices={[
                { label: "Sí, sé con quién", value: "yes" },
                { label: "Tal vez; no lo tengo claro", value: "unsure" },
                { label: "No tengo a quién", value: "no" },
              ]} onSelect={(choice) => complete({ ...answers, support: choice.value as SupportAnswer })} />
            </Question>
          )}
        </div>

        <footer className="checkin__footer">
          <span><LockKeyhole aria-hidden="true" /> Demo sin registro ni almacenamiento</span>
          <span>B Lance no sustituye la atención profesional</span>
        </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Question({ eyebrow, title, note, children }: { eyebrow: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="question">
      <p className="eyebrow">{eyebrow}</p>
      <Dialog.Title asChild><h2 tabIndex={-1}>{title}</h2></Dialog.Title>
      <p className="question__note">{note}</p>
      {children}
    </div>
  );
}

function Outcome({
  outcome,
  onBreathing,
  onHelp,
  onReset,
}: {
  outcome: ScreeningOutcome;
  onBreathing: () => void;
  onHelp: () => void;
  onReset: () => void;
}) {
  const content = {
    steady: {
      eyebrow: "Puedes empezar por regular",
      title: "No tienes que resolverlo todo hoy.",
      body: "Si te sirve, puedes tomar una pausa breve y después decidir qué necesitas. También puedes buscar apoyo; esta demo no evalúa tu estado de salud.",
      Icon: HeartHandshake,
    },
    support: {
      eyebrow: "Conviene buscar apoyo",
      title: "Esto merece apoyo humano hoy.",
      body: "Por lo que compartiste, te recomendamos hablar con una persona de confianza o un profesional. No tienes que contar toda tu historia de una vez.",
      Icon: MessageCircleHeart,
    },
    urgent: {
      eyebrow: "Ayuda inmediata",
      title: "Paremos aquí. Tu seguridad es lo primero.",
      body: "No te quedes a solas. Llama a los servicios de emergencia o a Línea de la Vida y acércate ahora a una persona de confianza.",
      Icon: ShieldAlert,
    },
  }[outcome];

  return (
    <div className="outcome">
      <span className="outcome__icon"><content.Icon aria-hidden="true" /></span>
      <p className="eyebrow">{content.eyebrow}</p>
      <Dialog.Title asChild><h2 tabIndex={-1}>{content.title}</h2></Dialog.Title>
      <p className="outcome__body">{content.body}</p>

      {outcome === "urgent" ? (
        <div className="outcome__actions">
          <a className="button button--urgent button--wide" href="tel:911">Llamar al 911</a>
          <a className="button button--paper button--wide" href="tel:8009112000">Línea de la Vida (México) · 800 911 2000</a>
          <button className="quiet-link" type="button" onClick={onHelp}>Ver todas las opciones de ayuda</button>
        </div>
      ) : (
        <div className="outcome__actions">
          <button className="button button--ink button--wide" type="button" onClick={onBreathing}>Hacer una pausa guiada</button>
          <button className="button button--paper button--wide" type="button" onClick={onHelp}>Ver opciones de apoyo</button>
          <button className="quiet-link" type="button" onClick={onReset}><RotateCcw aria-hidden="true" /> Repetir check-in</button>
        </div>
      )}
    </div>
  );
}
