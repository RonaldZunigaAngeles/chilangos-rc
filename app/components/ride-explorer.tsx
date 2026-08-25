"use client";

import { useMemo, useState } from "react";
import type { Ride } from "../data/chilangos";

const formatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
});

export default function RideExplorer({ rides }: { rides: Ride[] }) {
  const years = useMemo(() => Array.from(new Set(rides.map((ride) => ride.date.slice(0, 4)))).reverse(), [rides]);
  const [year, setYear] = useState<string>(years[0] ?? "todos");
  const filtered = rides.filter((ride) => year === "todos" || ride.date.startsWith(year)).reverse();

  return (
    <div className="ride-explorer">
      <div className="ride-toolbar">
        <div className="year-tabs" aria-label="Filtrar rodadas por año">
          {years.map((option) => (
            <button key={option} className={option === year ? "year-tab active" : "year-tab"} onClick={() => setYear(option)} aria-pressed={option === year}>
              {option}
            </button>
          ))}
          <button className={year === "todos" ? "year-tab active" : "year-tab"} onClick={() => setYear("todos")} aria-pressed={year === "todos"}>
            Todas
          </button>
        </div>
        <span className="ride-count">{filtered.length} {filtered.length === 1 ? "rodada" : "rodadas"}</span>
      </div>
      <div className="ride-list">
        <div className="ride-table-heading" aria-hidden="true"><span>FECHA · RODADA</span><span>SALIDA</span><span>DESTINO · ESTADO</span><span>IDA APROX.</span><span>IDA Y VUELTA</span><span /></div>
        {filtered.map((ride) => (
          <article className="ride-row" key={`${ride.date}-${ride.destination}`}>
            <div className="ride-date-group"><time className="ride-date" dateTime={ride.date}>{formatter.format(new Date(`${ride.date}T12:00:00Z`))}</time><span>{ride.title}</span></div>
            <div className="ride-start"><span className="ride-mobile-label">SALIDA</span><strong>{ride.meetingPoint}</strong></div>
            <div className="ride-destination"><h3>{ride.destination}</h3><p>{ride.state}</p></div>
            <span className="ride-km ride-one-way"><span className="ride-mobile-label">IDA</span>{ride.oneWayKm.toLocaleString("es-MX")} km</span>
            <span className="ride-km ride-total"><span className="ride-mobile-label">TOTAL</span>{ride.roundTripKm.toLocaleString("es-MX")} km</span>
            <a className="ride-map" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ride.destination}, ${ride.state}, México`)}`} target="_blank" rel="noreferrer" aria-label={`Ver ${ride.destination} en Google Maps`}>↗</a>
          </article>
        ))}
      </div>
      <p className="data-caption">Archivo histórico documentado entre enero de 2023 y agosto de 2026. Las distancias son aproximadas: se muestra el trayecto de ida y el total estimado de ida y vuelta. Cuando no tenemos confirmado el punto de salida, se indica expresamente.</p>
    </div>
  );
}
