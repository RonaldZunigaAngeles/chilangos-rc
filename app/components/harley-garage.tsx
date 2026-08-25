import type { ReactNode } from "react";
import { harleySources, maintenanceTips, type MaintenanceTip } from "../data/harley-guide";

function TipIcon({ type }: { type: MaintenanceTip["id"] }) {
  const paths: Record<MaintenanceTip["id"], ReactNode> = {
    tires: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
    oil: <path d="M12 3s-5 6-5 11a5 5 0 0 0 10 0c0-5-5-11-5-11Z" />,
    spark: <path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z" />,
    brakes: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2M18 5l3 3" /></>,
    battery: <><rect x="4" y="7" width="16" height="11" rx="1" /><path d="M8 7V5h3v2m3 4h3m-1.5-1.5v3M7 11h3" /></>,
    lights: <><path d="M9 15c-1.2-.9-2-2.3-2-4a5 5 0 0 1 10 0c0 1.7-.8 3.1-2 4l-1 2h-4l-1-2Z" /><path d="M10 21h4m-5-3h6" /></>,
    drive: <><path d="M8 8h8v8H8z" /><path d="M5 5h4v4H5zm10 10h4v4h-4z" /></>,
    service: <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z" />,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

export default function HarleyGarage() {
  return (
    <div className="harley-garage">
      <div className="garage-guide-heading">
        <div><span>GUÍA ESENCIAL H-D</span><h3>Ocho revisiones que sí aportan.</h3></div>
        <p>Consejos resumidos a partir de materiales oficiales de Harley-Davidson. Son una guía de prevención: el manual de tu año y modelo siempre define presión, piezas, líquidos, intervalos y torques exactos.</p>
      </div>

      <div className="maintenance-tip-grid">
        {maintenanceTips.map((tip) => (
          <article className="maintenance-tip-card" key={tip.id}>
            <div className="maintenance-tip-icon"><TipIcon type={tip.id} /></div>
            <div className="maintenance-tip-copy">
              <span>{tip.timing}</span>
              <h4>{tip.title}</h4>
              <p>{tip.summary}</p>
              <ul>{tip.checks.map((check) => <li key={check}>{check}</li>)}</ul>
              <a href={tip.source} target="_blank" rel="noreferrer">Fuente oficial H-D ↗</a>
            </div>
          </article>
        ))}
      </div>

      <div className="garage-manual-callout"><div><strong>Tu manual tiene la última palabra.</strong><p>Busca el manual oficial de propietario por año y modelo antes de comprar consumibles o hacer un ajuste.</p></div><a href={harleySources.manuals} target="_blank" rel="noreferrer">Abrir portal de manuales H-D ↗</a></div>
    </div>
  );
}
