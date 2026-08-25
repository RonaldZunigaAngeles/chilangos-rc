"use client";

import { useMemo, useState } from "react";
import type { Destination, Ride } from "../data/chilangos";
import { allMexicanStates } from "../data/pueblos-magicos";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");

export default function DestinationExplorer({ destinations, rides }: { destinations: Destination[]; rides: Ride[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("Todos los estados");
  const [distance, setDistance] = useState("Cualquier distancia");
  const [magicOnly, setMagicOnly] = useState(false);
  const [visible, setVisible] = useState(9);
  const states = useMemo(() => allMexicanStates, []);

  const matching = destinations.filter((place) => {
    const normalizedQuery = normalize(query).trim();
    const matchesDistance = distance === "Cualquier distancia"
      || (distance === "Hasta 100 km" && place.km <= 100)
      || (distance === "De 101 a 200 km" && place.km > 100 && place.km <= 200)
      || (distance === "Más de 200 km" && place.km > 200);

    return (state === "Todos los estados" || place.state === state)
      && matchesDistance
      && (!magicOnly || place.puebloMagico)
      && (!normalizedQuery || normalize(`${place.name} ${place.state}`).includes(normalizedQuery));
  });

  const filtersActive = query || state !== "Todos los estados" || distance !== "Cualquier distancia" || magicOnly;

  function clearFilters() {
    setQuery("");
    setState("Todos los estados");
    setDistance("Cualquier distancia");
    setMagicOnly(false);
    setVisible(9);
  }

  return (
    <div className="destination-explorer">
      <div className="destination-explanation"><strong>Ideas para la próxima rodada.</strong><p>Explora lugares que podemos visitar, elige un estado, calcula qué tan lejos quieres llegar o muestra únicamente Pueblos Mágicos. Cada destino abre su ubicación en Google Maps.</p></div>
      <div className="destination-toolbar">
        <label className="search-box"><span className="visually-hidden">Buscar destino</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(9); }} placeholder="Busca un destino..." /></label>
        <label className="state-select"><span className="visually-hidden">Filtrar por estado</span><select value={state} onChange={(event) => { setState(event.target.value); setVisible(9); }}><option>Todos los estados</option>{states.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label className="state-select"><span className="visually-hidden">Filtrar por distancia desde Ciudad de México</span><select value={distance} onChange={(event) => { setDistance(event.target.value); setVisible(9); }}><option>Cualquier distancia</option><option>Hasta 100 km</option><option>De 101 a 200 km</option><option>Más de 200 km</option></select></label>
        <button type="button" className={magicOnly ? "magic-toggle active" : "magic-toggle"} aria-pressed={magicOnly} onClick={() => { setMagicOnly(!magicOnly); setVisible(9); }}>✦ Pueblos mágicos</button>
      </div>
      <div className="destination-result-bar"><span>{matching.length} {matching.length === 1 ? "destino encontrado" : "destinos encontrados"}</span>{filtersActive && <button type="button" onClick={clearFilters}>Limpiar filtros</button>}</div>
      <div className="destination-grid">
        {matching.slice(0, visible).map((place) => {
          const documented = rides.some((ride) => normalize(ride.destination).includes(normalize(place.name)));

          return (
            <a className={`destination-card${documented ? " destination-documented" : ""}`} key={`${place.name}-${place.state}`} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.state}, México`)}`} target="_blank" rel="noreferrer">
              <div className="destination-card-heading"><span className="destination-state">{place.state}</span>{documented && <span className="destination-visited">YA RODADO</span>}</div>
              <h3>{place.name}</h3>
              <div className="destination-meta"><span>{place.km} km aprox.</span>{place.puebloMagico && <span className="magic-badge">✦ Pueblo mágico</span>}<span className="destination-map-link">MAPA ↗</span></div>
            </a>
          );
        })}
      </div>
      {!matching.length && <p className="empty-results">Todavía no tenemos una sugerencia cargada para ese estado. Prueba con otro filtro o propón un nuevo destino a la banda.</p>}
      {matching.length > visible && <button className="show-more" onClick={() => setVisible((current) => current + 12)}>Ver más destinos <span>({matching.length - visible} pendientes)</span></button>}
      <p className="data-caption">Este explorador sirve para proponer y comparar destinos; no representa una agenda de eventos confirmados. Las distancias son aproximadas y corresponden al trayecto de ida desde la Ciudad de México.</p>
    </div>
  );
}
