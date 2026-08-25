"use client";

import { useEffect, useRef, useState } from "react";

type AnnualMileage = { year: string; rideCount: number; kilometers: number };

export default function MileageCounter({ total, rides, byYear }: { total: number; rides: number; byYear: AnnualMileage[] }) {
  const [value, setValue] = useState(total);
  const counter = useRef<HTMLDivElement>(null);
  const goal = Math.ceil((total + 1) / 2500) * 2500;
  const remaining = Math.max(0, goal - total);
  const progress = Math.min(100, Math.round((total / goal) * 100));
  const documentedYears = byYear.filter((year) => year.rideCount > 0);
  const maxKilometers = Math.max(...documentedYears.map((year) => year.kilometers), 1);

  useEffect(() => {
    const element = counter.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let animated = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || animated) return;
      animated = true;
      const started = performance.now();

      function update(now: number) {
        const elapsed = Math.min((now - started) / 1450, 1);
        const eased = 1 - (1 - elapsed) ** 3;
        setValue(Math.round(total * eased));
        if (elapsed < 1) frame = window.requestAnimationFrame(update);
      }

      frame = window.requestAnimationFrame(update);
      observer.disconnect();
    }, { threshold: 0.3 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [total]);

  return (
    <div className="odometer-layout" ref={counter}>
      <div className="odometer-main">
        <p className="eyebrow light">El odómetro de la hermandad</p>
        <div className="odometer-reading"><strong>{value.toLocaleString("es-MX")}</strong><span>KM</span></div>
        <p className="odometer-caption">Kilómetros documentados entre todas nuestras rodadas de ida y vuelta.</p>
        <div className="odometer-progress" aria-label={`${progress}% hacia la siguiente meta`}>
          <div className="odometer-progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="odometer-progress-label"><span>Próxima meta: {goal.toLocaleString("es-MX")} km</span><span>Faltan {remaining.toLocaleString("es-MX")} km</span></div>
        </div>
      </div>

      <div className="odometer-records">
        <div className="odometer-record-heading"><span>Temporadas documentadas</span><strong>{rides} rodadas</strong></div>
        {documentedYears.map((year) => (
          <div className="odometer-year" key={year.year}>
            <div><span>{year.year}</span><strong>{year.kilometers.toLocaleString("es-MX")} km</strong></div>
            <div className="odometer-year-track"><span style={{ width: `${Math.round((year.kilometers / maxKilometers) * 100)}%` }} /></div>
            <small>{year.rideCount} {year.rideCount === 1 ? "rodada registrada" : "rodadas registradas"}</small>
          </div>
        ))}
        <p className="odometer-disclaimer">El contador muestra únicamente rodadas documentadas del club. Los parches personales se calculan aparte; no utilizamos rastreo ni ubicación en tiempo real.</p>
      </div>
    </div>
  );
}
