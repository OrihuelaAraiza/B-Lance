import { useState } from "react";
import { demoViews as views } from "../data/demo";
import { LockKeyhole } from "lucide-react";

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

      <div className="segmented" role="group" aria-label="Vista de datos">
        <button
          type="button"
          aria-pressed={view === "esferas"}
          className={view === "esferas" ? "is-active" : ""}
          onClick={() => setView("esferas")}
        >
          Por esfera
        </button>
        <button
          type="button"
          aria-pressed={view === "tendencia"}
          className={view === "tendencia" ? "is-active" : ""}
          onClick={() => setView("tendencia")}
        >
          Tendencia
        </button>
      </div>

      <p className="chart-unit" id="chart-unit">
        Cantidad de selecciones ficticias{" "}
        {view === "esferas" ? "por esfera" : "por semana"}. No son porcentajes.
      </p>
      <div className="bar-chart" aria-hidden="true">
        {views[view].map((item) => (
          <div className="bar-chart__row" key={item.label}>
            <span>{item.label}</span>
            <div className="bar-chart__track">
              <i style={{ width: `${item.value}%`, background: item.color }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="sr-only">
        <table>
          <caption>
            Datos ilustrativos: cantidad de selecciones ficticias{" "}
            {view === "esferas" ? "por esfera" : "por semana"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{view === "esferas" ? "Esfera" : "Semana"}</th>
              <th scope="col">Selecciones ficticias</th>
            </tr>
          </thead>
          <tbody>
            {views[view].map((item) => (
              <tr key={item.label}>
                <th scope="row">{item.label}</th>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="realtime-card__footer">
        <p>
          <LockKeyhole aria-hidden="true" /> Ejemplo con datos ficticios. No
          está conectado a respuestas ni a conversaciones.
        </p>
        <span className="realtime-card__scope">Vista previa institucional</span>
      </div>
    </div>
  );
}
