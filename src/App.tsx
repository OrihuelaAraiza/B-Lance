import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Check,
  CircleUserRound,
  Headphones,
  Heart,
  Home,
  LockKeyhole,
  MessageCircle,
  Music2,
  Pause,
  QrCode,
  School,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { BreathingRoom } from "./components/BreathingRoom";
import { CheckIn } from "./components/CheckIn";
import { HelpPanel } from "./components/HelpPanel";
import { RealtimePreview } from "./components/RealtimePreview";
import { useSoftSound } from "./hooks/useSoftSound";

const spheres = [
  {
    key: "mente",
    label: "Mi mente no para",
    response: "Vamos a bajar el volumen, una pregunta a la vez.",
    Icon: Brain,
  },
  {
    key: "cuerpo",
    label: "Lo siento en el cuerpo",
    response: "Primero ubicamos la sensación. No tienes que pelear con ella.",
    Icon: Heart,
  },
  {
    key: "escuela",
    label: "Escuela o trabajo",
    response: "Podemos separar lo urgente de lo que puede esperar.",
    Icon: School,
  },
  {
    key: "casa",
    label: "Algo en casa",
    response: "Este es un espacio para ordenar lo que está pasando, sin juicios.",
    Icon: Home,
  },
  {
    key: "relaciones",
    label: "Una relación",
    response: "Vamos a entender qué necesitas para sentirte más seguro.",
    Icon: UsersRound,
  },
];

const supportPaths = [
  { number: "01", title: "Te escucha", text: "Mensajes breves, lenguaje cercano y sin interrogatorios.", color: "pink" },
  { number: "02", title: "Ubica contigo", text: "Un check-in rápido reconoce intensidad, impacto y seguridad.", color: "lilac" },
  { number: "03", title: "Te da una salida", text: "Una pausa guiada, una persona de confianza o ayuda inmediata.", color: "mint" },
];

function App() {
  const [selectedSphere, setSelectedSphere] = useState(spheres[0]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play: playSound } = useSoftSound();

  useEffect(() => {
    const overlayOpen = checkInOpen || helpOpen || breathingOpen;
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [breathingOpen, checkInOpen, helpOpen]);

  const selectSphere = (sphere: typeof spheres[number]) => {
    playSound();
    setSelectedSphere(sphere);
  };

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <BrandMark />
          <nav aria-label="Navegación principal">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#instituciones">Para instituciones</a>
            <a href="#privacidad">Privacidad</a>
          </nav>
          <div className="site-header__actions">
            <button
              className="sound-toggle"
              type="button"
              aria-pressed={soundEnabled}
              onClick={() => setSoundEnabled((value) => !value)}
            >
              {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              <span>Sonido {soundEnabled ? "sí" : "no"}</span>
            </button>
            <button className="button button--small button--paper" type="button" onClick={() => setHelpOpen(true)}>Ayuda ahora</button>
          </div>
        </div>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero__wash" aria-hidden="true">
            <i /><i /><i />
          </div>
          <div className="shell hero__grid">
            <div className="hero__copy">
              <div className="availability"><span /> Un espacio para cuando algo pesa</div>
              <h1>Aquí puedes<br /><em>bajar el ruido.</em></h1>
              <p className="hero__lead">
                B Lance es una primera pausa para entender cómo estás y encontrar el siguiente paso. Sin diagnósticos. Sin juicios. A tu ritmo.
              </p>
              <div className="hero__actions">
                <button className="button button--ink" type="button" onClick={() => setCheckInOpen(true)}>
                  Hacer mi check-in <ArrowRight aria-hidden="true" />
                </button>
                <button className="button button--ghost" type="button" onClick={() => setBreathingOpen(true)}>
                  <Pause aria-hidden="true" /> Tomar una pausa
                </button>
              </div>
              <div className="hero__trust">
                <span><LockKeyhole aria-hidden="true" /> Demo sin registro</span>
                <span><ShieldCheck aria-hidden="true" /> No diagnostica</span>
                <span><CircleUserRound aria-hidden="true" /> Para jóvenes de 10 a 29</span>
              </div>
            </div>

            <div className="pulse-card" aria-label="Vista previa interactiva de B Lance">
              <div className="pulse-card__top">
                <div className="mini-brand"><span>B</span><strong>B Lance</strong></div>
                <div className="pulse-card__status"><span /> contigo</div>
              </div>
              <div className="pulse-card__conversation">
                <div className="message message--romi">
                  <span className="message__avatar">B</span>
                  <p>No necesitas explicarlo perfecto. ¿Qué se parece más a lo que traes hoy?</p>
                </div>
                <div className="sphere-picker">
                  {spheres.map((sphere) => (
                    <button
                      className={selectedSphere.key === sphere.key ? "is-selected" : ""}
                      key={sphere.key}
                      type="button"
                      onClick={() => selectSphere(sphere)}
                    >
                      <sphere.Icon aria-hidden="true" /> {sphere.label}
                    </button>
                  ))}
                </div>
                <div className="message message--romi message--reply" key={selectedSphere.key}>
                  <span className="message__avatar">B</span>
                  <p>{selectedSphere.response}</p>
                </div>
              </div>
              <button className="pulse-card__cta" type="button" onClick={() => setCheckInOpen(true)}>
                Seguir con mi check-in <ArrowRight aria-hidden="true" />
              </button>
              <div className="balance-orb" aria-hidden="true"><i /><i /><i /></div>
            </div>
          </div>
          <a className="scroll-cue" href="#como-funciona">Descubre cómo te acompaña <ArrowDown aria-hidden="true" /></a>
        </section>

        <section className="section section--paper" id="como-funciona">
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">Una conversación que sí llega a algo</p>
                <h2>Dos minutos.<br />Una salida clara.</h2>
              </div>
              <p>No queremos que una persona cansada tenga que leer párrafos eternos. Cada interacción reduce carga y acerca una decisión concreta.</p>
            </div>

            <div className="path-grid">
              {supportPaths.map((path) => (
                <article className={`path-card path-card--${path.color}`} key={path.number}>
                  <span>{path.number}</span>
                  <h3>{path.title}</h3>
                  <p>{path.text}</p>
                </article>
              ))}
            </div>

            <div className="outcome-strip">
              <div className="outcome-strip__intro">
                <p className="eyebrow">Orientación, no etiqueta</p>
                <h3>Cada ruta termina con un siguiente paso.</h3>
              </div>
              <div className="outcome-strip__paths">
                <div><span className="dot dot--mint" /><strong>Regular</strong><small>Ejercicio breve y recursos</small></div>
                <div><span className="dot dot--yellow" /><strong>Acompañar</strong><small>Conectar con alguien hoy</small></div>
                <div><span className="dot dot--coral" /><strong>Proteger</strong><small>Ayuda inmediata y directa</small></div>
              </div>
              <button className="button button--coral" type="button" onClick={() => setCheckInOpen(true)}>Probar el flujo <ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
        </section>

        <section className="section section--ink sensory-section">
          <div className="shell sensory-section__grid">
            <div className="sensory-section__copy">
              <p className="eyebrow eyebrow--light">PIP · mindfulness sensorial</p>
              <h2>Tu cuerpo también puede decir: “ya bajó un poco”.</h2>
              <p>Movimiento lento, sonido opcional y respiración guiada. Diseñado para sumar calma, nunca estímulo de más.</p>
              <button className="button button--cream" type="button" onClick={() => setBreathingOpen(true)}>
                <Headphones aria-hidden="true" /> Probar pausa de 50 segundos
              </button>
            </div>
            <div className="sensory-stage" aria-hidden="true">
              <div className="sensory-stage__rings"><i /><i /><i /><span /></div>
              <div className="sensory-stage__caption"><Music2 /><span>inhala</span><b>4</b><span>suelta</span><b>6</b></div>
            </div>
          </div>
        </section>

        <section className="section institutional-section" id="instituciones">
          <div className="shell institutional-section__grid">
            <div>
              <p className="eyebrow">Para escuelas e instituciones</p>
              <h2>Del primer mensaje a una prevención que sí se puede leer.</h2>
              <p className="section-lead">
                B Lance conecta una entrada contextual por QR, un flujo conversacional breve y señales agregadas para orientar intervenciones de salud mental sin exhibir historias individuales.
              </p>
              <ul className="feature-list">
                <li><QrCode aria-hidden="true" /><span><strong>Entrada contextual</strong>QR por plantel, zona y nivel educativo.</span></li>
                <li><MessageCircle aria-hidden="true" /><span><strong>Lenguaje que se adapta</strong>Mensajes cercanos según edad y contexto.</span></li>
                <li><BarChart3 aria-hidden="true" /><span><strong>Inteligencia poblacional</strong>Indicadores por esfera, territorio y tendencia.</span></li>
                <li><BookOpenCheck aria-hidden="true" /><span><strong>Continuidad clínica</strong>Resumen estructurado para evitar volver a contar todo.</span></li>
              </ul>
            </div>
            <RealtimePreview />
          </div>
        </section>

        <section className="section privacy-section" id="privacidad">
          <div className="shell privacy-card">
            <div className="privacy-card__mark"><ShieldCheck aria-hidden="true" /></div>
            <div className="privacy-card__copy">
              <p className="eyebrow">Un límite que no se negocia</p>
              <h2>Lo que sientes no es una calificación.</h2>
              <p>Los datos emocionales no deben usarse para castigar, disciplinar, vender o perfilar. Las instituciones reciben tendencias agregadas, no conversaciones personales.</p>
            </div>
            <div className="privacy-card__checks">
              <span><Check aria-hidden="true" /> Sin uso punitivo</span>
              <span><Check aria-hidden="true" /> Sin venta de datos</span>
              <span><Check aria-hidden="true" /> IA siempre identificada</span>
            </div>
          </div>
        </section>

        <section className="section final-cta">
          <div className="shell final-cta__inner">
            <span className="final-cta__spark"><Sparkles aria-hidden="true" /></span>
            <p className="eyebrow">No tienes que llegar con las palabras correctas</p>
            <h2>Solo empieza por cómo estás hoy.</h2>
            <div className="final-cta__actions">
              <button className="button button--ink" type="button" onClick={() => setCheckInOpen(true)}>Hacer mi check-in <ArrowRight aria-hidden="true" /></button>
              <button className="quiet-link" type="button" onClick={() => setHelpOpen(true)}>Necesito ayuda inmediata</button>
            </div>
            <p className="final-cta__note">B Lance brinda orientación de bienestar general y no sustituye una consulta con profesionales de la salud.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <BrandMark inverse />
          <p>Contención accesible y prevención temprana para juventudes de Iberoamérica.</p>
          <div>
            <button type="button" onClick={() => setHelpOpen(true)}>Ayuda ahora</button>
            <span>Maqueta conceptual · 2026</span>
          </div>
        </div>
      </footer>

      <button className="mobile-help" type="button" onClick={() => setHelpOpen(true)}>Ayuda ahora</button>

      <CheckIn
        open={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenBreathing={() => setBreathingOpen(true)}
        playSound={playSound}
      />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
      <BreathingRoom open={breathingOpen} onClose={() => setBreathingOpen(false)} />
    </>
  );
}

export default App;
