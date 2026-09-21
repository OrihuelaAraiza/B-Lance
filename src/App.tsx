import { useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  CircleUserRound,
  Headphones,
  LockKeyhole,
  MessageCircle,
  Menu,
  X,
  Music2,
  Pause,
  QrCode,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { spheres, supportPaths } from "./data/demo";
import { BrandMark } from "./components/BrandMark";
import { BreathingRoom } from "./components/BreathingRoom";
import { CheckIn } from "./components/CheckIn";
import { HelpPanel } from "./components/HelpPanel";
import { RealtimePreview } from "./components/RealtimePreview";
import { useSoftSound } from "./hooks/useSoftSound";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const [selectedSphere, setSelectedSphere] = useState(spheres[0]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const { audioRef, enabled: soundEnabled, loading: soundLoading, error: soundError, toggle: toggleSound, play: playSound } = useSoftSound();

  const selectSphere = (sphere: typeof spheres[number]) => {
    playSound();
    setSelectedSphere(sphere);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/ambiente-suave.mp3" preload="none" loop />
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="shell site-header__inner">
          <BrandMark />
          <button ref={menuButton} className="menu-toggle icon-button" type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen} aria-controls="primary-navigation"
              onClick={() => setMenuOpen((value) => !value)}
          >{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
          <nav id="primary-navigation" className={menuOpen ? "is-open" : ""} aria-label="Navegación principal"
            onKeyDown={(event) => {
              if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); }
            }}
            onClick={(event) => {
              if (event.target instanceof HTMLAnchorElement) {
                setMenuOpen(false);
                document.querySelector<HTMLElement>(event.target.hash)?.focus({ preventScroll: true });
              }
            }}
          >
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#instituciones">Para instituciones</a>
            <a href="#privacidad">Privacidad</a>
          </nav>
          <div className="site-header__actions">
            <button
              className="sound-toggle"
              type="button"
              aria-pressed={soundEnabled}
              aria-label={soundLoading ? "Cargando sonido" : `Sonido ${soundEnabled ? "activado" : "desactivado"}`}
              aria-busy={soundLoading}
              aria-describedby={soundError ? "sound-error" : undefined}
              onClick={() => void toggleSound()}
            >
              {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
              <span>{soundLoading ? "Cargando sonido…" : `Sonido ${soundEnabled ? "activado" : "desactivado"}`}</span>
            </button>
            {soundError && <p id="sound-error" className="sound-error" role="status">{soundError}</p>}
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
            <m.div
              className="hero__copy"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
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
                <span><ShieldCheck aria-hidden="true" /> No ofrece diagnósticos</span>
                <span><CircleUserRound aria-hidden="true" /> Para jóvenes de 10 a 29 años</span>
              </div>
            </m.div>

            <m.div
              className="pulse-card"
              aria-label="Vista previa interactiva de B Lance"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ duration: 0.72, delay: reduceMotion ? 0 : 0.08, ease: "easeOut" }}
            >
              <div className="pulse-card__top">
                <div className="mini-brand"><span>B</span><strong>B Lance</strong></div>
                <div className="pulse-card__status"><span /> contigo</div>
              </div>
              <div className="pulse-card__conversation">
                <div className="message message--romi">
                  <span className="message__avatar">B</span>
                  <p>No necesitas encontrar las palabras perfectas. ¿Qué se parece más a lo que traes hoy?</p>
                </div>
                <div className="sphere-picker">
                  {spheres.map((sphere) => (
                    <m.button
                      className={selectedSphere.key === sphere.key ? "is-selected" : ""}
                      key={sphere.key}
                      aria-pressed={selectedSphere.key === sphere.key}
                      type="button"
                      onClick={() => selectSphere(sphere)}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    >
                      <sphere.Icon aria-hidden="true" /> {sphere.label}
                    </m.button>
                  ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    className="message message--romi message--reply"
                    role="status"
                    key={selectedSphere.key}
                    initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <span className="message__avatar">B</span>
                    <p>{selectedSphere.response}</p>
                  </m.div>
                </AnimatePresence>
              </div>
              <button className="pulse-card__cta" type="button" onClick={() => setCheckInOpen(true)}>
                Seguir con mi check-in <ArrowRight aria-hidden="true" />
              </button>
              <div className="balance-orb" aria-hidden="true"><i /><i /><i /></div>
            </m.div>
          </div>
          <a className="scroll-cue" href="#como-funciona">Descubre cómo te acompaña <ArrowDown aria-hidden="true" /></a>
        </section>

        <section className="section section--paper" id="como-funciona" tabIndex={-1}>
          <div className="shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">Una conversación que sí llega a algo</p>
                <h2>Dos minutos.<br />Una salida clara.</h2>
              </div>
              <p>No queremos que una persona cansada tenga que leer párrafos eternos. Cada interacción reduce la carga y facilita una decisión concreta.</p>
            </div>

            <div className="path-grid">
              {supportPaths.map((path) => (
                <m.article
                  className={`path-card path-card--${path.color}`}
                  key={path.number}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <span>{path.number}</span>
                  <h3>{path.title}</h3>
                  <p>{path.text}</p>
                </m.article>
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
              <p className="eyebrow eyebrow--light">PIP · atención plena sensorial</p>
              <h2>Tu cuerpo también puede decir: «Ya bajó un poco».</h2>
              <p>Movimiento lento, sonido opcional y respiración guiada. Todo está diseñado para sumar calma sin añadir estímulos de más.</p>
              <button className="button button--cream" type="button" onClick={() => setBreathingOpen(true)}>
                <Headphones aria-hidden="true" /> Probar pausa de 50 segundos
              </button>
            </div>
            <div className="sensory-stage" aria-hidden="true">
              <m.div
                className="sensory-stage__rings"
                animate={reduceMotion ? undefined : { rotate: [0, 2.5, -1.5, 0], scale: [1, 1.018, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              ><i /><i /><i /><span /></m.div>
              <div className="sensory-stage__caption"><Music2 /><span>inhala</span><b>4 s</b><span>suelta</span><b>6 s</b></div>
            </div>
          </div>
        </section>

        <section className="section institutional-section" id="instituciones" tabIndex={-1}>
          <div className="shell institutional-section__grid">
            <div>
              <p className="eyebrow">Para escuelas e instituciones</p>
              <h2>Del primer mensaje a señales que sí ayudan a prevenir.</h2>
              <p className="section-lead">
                Esta demo permite explorar un check-in y una vista de indicadores ficticios. La propuesta institucional contempla las siguientes capacidades futuras; todavía no están conectadas a servicios ni a datos reales.
              </p>
              <ul className="feature-list">
                <li><QrCode aria-hidden="true" /><span><strong>Entrada contextual · prevista</strong>Códigos QR por plantel, zona y nivel educativo.</span></li>
                <li><MessageCircle aria-hidden="true" /><span><strong>Lenguaje que se adapta · previsto</strong>Mensajes cercanos según edad y contexto.</span></li>
                <li><BarChart3 aria-hidden="true" /><span><strong>Inteligencia poblacional · demostración</strong>Ejemplos ficticios por esfera y semana; sin mediciones reales.</span></li>
                <li><BookOpenCheck aria-hidden="true" /><span><strong>Continuidad clínica · prevista</strong>Resumen estructurado para evitar volver a contar todo.</span></li>
              </ul>
            </div>
            <RealtimePreview />
          </div>
        </section>

        <section className="section privacy-section" id="privacidad" tabIndex={-1}>
          <div className="shell privacy-card">
            <div className="privacy-card__mark"><ShieldCheck aria-hidden="true" /></div>
            <div className="privacy-card__copy">
              <p className="eyebrow">Un límite que no se negocia</p>
              <h2>Lo que sientes no es una calificación.</h2>
              <p>Los datos emocionales no deben utilizarse para castigar, disciplinar o perfilar a nadie, ni venderse. Esta demo no recopila respuestas ni entrega datos a instituciones. La propuesta futura contempla tendencias agregadas, no conversaciones personales.</p>
            </div>
            <div className="privacy-card__checks">
              <span><Check aria-hidden="true" /> Sin uso punitivo</span>
              <span><Check aria-hidden="true" /> Sin venta de datos</span>
              <span><Check aria-hidden="true" /> Demo sin IA</span>
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
            <p className="final-cta__note">B Lance brinda orientación sobre bienestar general y no sustituye una consulta con profesionales de la salud.</p>
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

      <m.button
        className="mobile-help"
        type="button"
        onClick={() => setHelpOpen(true)}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      >Ayuda ahora</m.button>

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
