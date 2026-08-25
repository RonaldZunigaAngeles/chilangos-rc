"use client";

import { useState } from "react";

function formatKilometers(value: number) {
  return value.toLocaleString("es-MX");
}

export default function PatchMilestones({ milestones, sharedRequirement }: { milestones: number[]; sharedRequirement: number }) {
  const [rawKilometers, setRawKilometers] = useState("");
  const hasKilometers = rawKilometers !== "";
  const kilometers = Math.max(0, Math.floor(Number(rawKilometers) || 0));
  const earnedMilestones = hasKilometers ? milestones.filter((milestone) => kilometers >= milestone) : [];
  const nextMilestone = milestones.find((milestone) => kilometers < milestone);
  const previousMilestone = milestones.filter((milestone) => kilometers >= milestone).at(-1) ?? 0;
  const progress = hasKilometers
    ? nextMilestone
      ? Math.min(100, Math.round(((kilometers - previousMilestone) / (nextMilestone - previousMilestone)) * 100))
      : 100
    : 0;

  return (
    <div className="patch-section" aria-label="Méritos personales registrados con el odómetro">
      <div className="patch-intro">
        <div className="section-heading light-heading">
          <p className="eyebrow light">Méritos personales · Kilómetros que se ganan</p>
          <h2>Tu odómetro.<br /><em>Tus méritos.</em></h2>
        </div>
        <p>Cada biker es responsable de registrar su odómetro y comprobar su recorrido personal. Chilangos RC entrega estos méritos de forma individual durante eventos especiales. Los {formatKilometers(sharedRequirement)} km para obtener el full patch son distintos: esos deben rodarse junto a la banda.</p>
      </div>

      <div className="patch-km-form">
        <label htmlFor="patch-kilometers">Kilometraje registrado en tu odómetro</label>
        <div><input id="patch-kilometers" type="number" min="0" step="1" inputMode="numeric" placeholder="Ingresa la lectura de tu odómetro" value={rawKilometers} onChange={(event) => setRawKilometers(event.target.value)} /><span>KM</span></div>
        <small>Consulta personal: esta calculadora no guarda tu lectura. Cada biker conserva su propio registro para solicitar su mérito.</small>
      </div>

      <div className="patch-grid">
        {milestones.map((milestone) => {
          const earned = hasKilometers && kilometers >= milestone;

          return (
            <article className={earned ? "patch-card earned" : "patch-card"} key={milestone}>
              <strong>{formatKilometers(milestone / 1000)} <em>MIL</em></strong>
              <small>{earned ? "Mérito alcanzado" : "Mérito personal"}</small>
            </article>
          );
        })}
      </div>

      <div className="patch-progress" aria-live="polite">
        <div className="patch-progress-track"><span style={{ width: `${progress}%` }} /></div>
        {hasKilometers
          ? nextMilestone
            ? <p>{earnedMilestones.length} {earnedMilestones.length === 1 ? "mérito alcanzado" : "méritos alcanzados"} · Faltan {formatKilometers(nextMilestone - kilometers)} km para tu siguiente mérito.</p>
            : <p>Alcanzaste los cinco méritos: {formatKilometers(kilometers)} kilómetros de historia sobre dos ruedas.</p>
          : <p>Ingresa la lectura de tu odómetro para descubrir tu siguiente mérito.</p>}
      </div>
    </div>
  );
}
