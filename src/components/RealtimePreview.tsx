import { useState } from "react";
import { LockKeyhole } from "lucide-react";

const views = {
  esferas: [
    { label: "Académica", value: 68, color: "var(--coral)" },
    { label: "Individual", value: 52, color: "var(--lilac)" },
    { label: "Familiar", value: 31, color: "var(--mint-deep)" },
    { label: "Social", value: 24, color: "var(--yellow-deep)" },
  ],
  tendencia: [
    { label: "Semana 1", value: 35, color: "var(--lilac)" },
    { label: "Semana 2", value: 47, color: "var(--lilac)" },
    { label: "Semana 3", value: 42, color: "var(--lilac)" },
    { label: "Semana 4", value: 58, color: "var(--lilac)" },
  ],
};

export function RealtimePreview() {
  const [view, setView] = useState<keyof typeof views>("esferas");

  return (
    <div className="realtime-card">
      <div className="realtime-card__top">
        <div>
          <p className="eyebrow">ROMI Real Time</p>
          <h3>Pulso socioemocional</h3>
        </div>
        <span className="demo-label">Datos ilustrativos</span>
      </div>

      <div className="segmented" aria-label="Vista de datos">
        <button type="button" className={view === "esferas" ? "is-active" : ""} onClick={() => setView("esferas")}>Por esfera</button>
        <button type="button" className={view === "tendencia" ? "is-active" : ""} onClick={() => setView("tendencia")}>Tendencia</button>
      </div>

      <div className="bar-chart" role="img" aria-label={view === "esferas" ? "Distribución ilustrativa por esfera" : "Tendencia ilustrativa por semana"}>
        {views[view].map((item) => (
          <div className="bar-chart__row" key={item.label}>
            <span>{item.label}</span>
            <div className="bar-chart__track"><i style={{ width: `${item.value}%`, background: item.color }} /></div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="realtime-card__footer">
        <p><LockKeyhole aria-hidden="true" /> Solo información agregada. Nunca expone conversaciones individuales.</p>
        <span className="realtime-card__scope">Vista previa institucional</span>
      </div>
    </div>
  );
}
