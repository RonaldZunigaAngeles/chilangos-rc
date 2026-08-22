"use client";

import { useMemo, useState } from "react";
import type { Destination } from "../data/chilangos";

export default function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("Todos los estados");
  const [magicOnly, setMagicOnly] = useState(false);
  const [visible, setVisible] = useState(9);
  const states = useMemo(() => Array.from(new Set(destinations.map((place) => place.state))).sort((a, b) => a.localeCompare(b, "es")), [destinations]);

  const matching = destinations.filter((place) => {
    const normalizedQuery = query.toLocaleLowerCase("es-MX").trim();
    return (state === "Todos los estados" || place.state === state)
      && (!magicOnly || place.puebloMagico)
      && (!normalizedQuery || `${place.name} ${place.state}`.toLocaleLowerCase("es-MX").includes(normalizedQuery));
  });

  return (
    <div className="destination-explorer">
      <div className="destination-toolbar">
        <label className="search-box"><span className="visually-hidden">Buscar destino</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(9); }} placeholder="Busca un destino..." /></label>
        <label className="state-select"><span className="visually-hidden">Filtrar por estado</span><select value={state} onChange={(event) => { setState(event.target.value); setVisible(9); }}><option>Todos los estados</option>{states.map((option) => <option key={option}>{option}</option>)}</select></label>
        <button className={magicOnly ? "magic-toggle active" : "magic-toggle"} aria-pressed={magicOnly} onClick={() => { setMagicOnly(!magicOnly); setVisible(9); }}>✦ Pueblos mágicos</button>
      </div>
      <div className="destination-grid">
        {matching.slice(0, visible).map((place) => (
          <a className="destination-card" key={`${place.name}-${place.state}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.state}, México`)}`} target="_blank" rel="noreferrer">
            <span className="destination-state">{place.state}</span>
            <h3>{place.name}</h3>
            <div className="destination-meta"><span>{place.km} km aprox.</span>{place.puebloMagico && <span className="magic-badge">✦ Pueblo mágico</span>}</div>
          </a>
        ))}
      </div>
      {!matching.length && <p className="empty-results">Todavía no encontramos ese destino. Prueba con otro nombre o estado.</p>}
      {matching.length > visible && <button className="show-more" onClick={() => setVisible((current) => current + 12)}>Ver más destinos <span>({matching.length - visible} pendientes)</span></button>}
      <p className="data-caption">Las distancias son aproximadas y corresponden al trayecto de ida desde la Ciudad de México.</p>
    </div>
  );
}
