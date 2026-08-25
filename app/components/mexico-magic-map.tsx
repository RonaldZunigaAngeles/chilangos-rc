"use client";

import { useEffect, useRef, useState } from "react";
import {
  puebloSources,
  pueblosByState,
  pueblosMagicos,
  stateCenters,
  verifiedTownCoordinates,
  visitedPueblos,
  visitedStates,
  visitedTownNames,
  type PuebloMagico,
} from "../data/pueblos-magicos";

type LatLng = [number, number];

type LeafletMap = {
  remove: () => void;
  setView: (center: LatLng, zoom: number) => LeafletMap;
};

type LeafletLayer = {
  addTo: (map: LeafletMap) => LeafletLayer;
  bindPopup: (content: string) => LeafletLayer;
  on: (event: string, handler: () => void) => LeafletLayer;
};

type Leaflet = {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, options: Record<string, unknown>) => LeafletLayer;
  circleMarker: (position: LatLng, options: Record<string, unknown>) => LeafletLayer;
  marker: (position: LatLng, options: Record<string, unknown>) => LeafletLayer;
  divIcon: (options: Record<string, unknown>) => unknown;
};

declare global {
  interface Window {
    L?: Leaflet;
  }
}

function loadLeaflet(): Promise<Leaflet> {
  if (window.L) return Promise.resolve(window.L);

  if (!document.querySelector('link[data-chilangos-leaflet="true"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    stylesheet.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    stylesheet.crossOrigin = "anonymous";
    stylesheet.dataset.chilangosLeaflet = "true";
    document.head.appendChild(stylesheet);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-chilangos-leaflet="true"]');
    if (existing) {
      existing.addEventListener("load", () => window.L ? resolve(window.L) : reject(new Error("Mapa no disponible.")), { once: true });
      existing.addEventListener("error", () => reject(new Error("Mapa no disponible.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "anonymous";
    script.dataset.chilangosLeaflet = "true";
    script.onload = () => window.L ? resolve(window.L) : reject(new Error("Mapa no disponible."));
    script.onerror = () => reject(new Error("No se pudo cargar el mapa. El padrón sigue disponible abajo."));
    document.head.appendChild(script);
  });
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");

export default function MexicoMagicMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const pendingTownFocus = useRef<LatLng | null>(null);
  const [state, setState] = useState("Todos los estados");
  const [stateScope, setStateScope] = useState<"todos" | "visitados" | "pendientes">("todos");
  const [status, setStatus] = useState<"todos" | "visitados" | "pendientes">("todos");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const [mapError, setMapError] = useState("");

  const filteredTowns = pueblosMagicos
    .filter((town) => state === "Todos los estados" || town.state === state)
    .filter((town) => stateScope === "todos" || (stateScope === "visitados" ? visitedStates.has(town.state) : !visitedStates.has(town.state)))
    .filter((town) => status === "todos" || (status === "visitados" ? visitedTownNames.has(town.name) : !visitedTownNames.has(town.name)))
    .filter((town) => !search || normalize(`${town.name} ${town.state}`).includes(normalize(search)))
    .sort((first, second) => {
      const visitOrder = Number(visitedTownNames.has(second.name)) - Number(visitedTownNames.has(first.name));
      return visitOrder || first.name.localeCompare(second.name, "es-MX");
    });

  useEffect(() => {
    if (!mapElement.current) return;
    let disposed = false;

    loadLeaflet().then((leaflet) => {
      if (disposed || !mapElement.current) return;
      mapInstance.current?.remove();

      const center = state === "Todos los estados" ? [23.6, -102.4] as LatLng : stateCenters[state];
      const map = leaflet.map(mapElement.current, { scrollWheelZoom: false, minZoom: 4 }).setView(center, state === "Todos los estados" ? 5 : 8);
      mapInstance.current = map;

      leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (status !== "visitados") {
        pueblosByState
          .filter((item) => state === "Todos los estados" || item.state === state)
          .filter((item) => stateScope === "todos" || (stateScope === "visitados" ? visitedStates.has(item.state) : !visitedStates.has(item.state)))
          .filter((item) => item.towns.length > 0)
          .forEach((item) => {
            const pending = item.towns.length - item.visitedCount;
            const icon = leaflet.divIcon({
              className: "state-map-icon",
              html: `<span>${pending}</span>`,
              iconSize: [42, 42],
              iconAnchor: [21, 21],
            });
            leaflet.marker(item.center, { icon })
              .addTo(map)
              .bindPopup(`<strong>${item.state}</strong><br>${item.towns.length} pueblos mágicos · ${item.visitedCount} visitados`)
              .on("click", () => setState(item.state));
          });
      }

      if (status !== "pendientes") {
        visitedPueblos
          .filter((town) => state === "Todos los estados" || town.state === state)
          .filter((town) => stateScope === "todos" || (stateScope === "visitados" ? visitedStates.has(town.state) : !visitedStates.has(town.state)))
          .forEach((town) => {
            const location = verifiedTownCoordinates[town.name];
            if (!location) return;

            const icon = leaflet.divIcon({
              className: "visited-map-icon",
              html: '<span class="visited-map-halo"></span><span class="visited-map-dot"></span>',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });
            leaflet.marker(location, { icon, zIndexOffset: 1800, riseOnHover: true })
              .addTo(map)
              .bindPopup(`<strong>${town.name}</strong><br>${town.state}<br>Rodada documentada de Chilangos RC`);
          });
      }

      if (pendingTownFocus.current) {
        map.setView(pendingTownFocus.current, 11);
        pendingTownFocus.current = null;
      }
      setMapError("");
    }).catch((error: unknown) => {
      if (!disposed) setMapError(error instanceof Error ? error.message : "No se pudo cargar el mapa.");
    });

    return () => {
      disposed = true;
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [state, stateScope, status]);

  function updateState(value: string) {
    setState(value);
    setVisibleCount(24);
  }

  function focusTown(town: PuebloMagico) {
    const coordinate = verifiedTownCoordinates[town.name] ?? stateCenters[town.state];
    if (state === town.state) {
      mapInstance.current?.setView(coordinate, verifiedTownCoordinates[town.name] ? 11 : 8);
      return;
    }

    pendingTownFocus.current = coordinate;
    updateState(town.state);
  }

  return (
    <div className="magic-map">
      <div className="magic-map-intro"><div><span>MÉXICO COMPLETO</span><strong>{pueblosMagicos.length}</strong><small>Pueblos Mágicos</small></div><div><span>RODADAS DOCUMENTADAS</span><strong>{visitedPueblos.length}</strong><small>pueblos visitados</small></div><div><span>LO QUE FALTA POR RODAR</span><strong>{pueblosMagicos.length - visitedPueblos.length}</strong><small>historias pendientes</small></div><div><span>FILTRO NACIONAL</span><strong>{pueblosByState.length}</strong><small>entidades federativas</small></div></div>
      <div className="magic-map-canvas" ref={mapElement} aria-label="Mapa de pueblos mágicos y rodadas documentadas en México" />
      {mapError ? <p className="magic-map-error">{mapError}</p> : null}
      <div className="magic-map-legend"><span><i className="legend-visited" /> Visitado en una rodada documentada</span><span><i className="legend-pending" /> Pueblos pendientes agrupados por estado</span></div>
      <div className="visited-town-strip" aria-label="Destinos ya visitados por Chilangos RC"><span>NUESTROS PUNTOS NARANJAS</span>{visitedPueblos.map((town) => <button type="button" key={`${town.name}-${town.state}`} onClick={() => focusTown(town)}><i aria-hidden="true" />{town.name}</button>)}</div>
      <p className="magic-map-disclaimer">Los círculos naranjas muestran pueblos que Chilangos RC ya visitó y aparecen por encima de los marcadores estatales. Toca un nombre para acercarte a su ubicación.</p>

      <div className="magic-map-filter-copy"><strong>Filtra el pasaporte nacional.</strong><p>Primero decide si quieres ver estados que ya hemos rodado o territorios pendientes. Después busca sus Pueblos Mágicos.</p></div>
      <div className="magic-directory-toolbar"><label className="magic-search"><span className="visually-hidden">Buscar pueblo mágico</span><input type="search" placeholder="Busca un pueblo, estado o nueva aventura…" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(24); }} /></label><label className="magic-state"><span>Estados</span><select value={stateScope} onChange={(event) => { setStateScope(event.target.value as typeof stateScope); updateState("Todos los estados"); }}><option value="todos">Todos los estados (32)</option><option value="visitados">Estados que ya hemos rodado</option><option value="pendientes">Estados por descubrir</option></select></label><label className="magic-state"><span>Entidad</span><select value={state} onChange={(event) => updateState(event.target.value)}><option>Todos los estados</option>{pueblosByState.map((item) => <option key={item.state}>{item.state}</option>)}</select></label></div>
      <div className="magic-status-tabs">{[{ id: "todos", label: "Todos" }, { id: "visitados", label: "Ya rodados" }, { id: "pendientes", label: "Por descubrir" }].map((filter) => <button key={filter.id} type="button" className={status === filter.id ? "active" : ""} onClick={() => { setStatus(filter.id as typeof status); setVisibleCount(24); }}>{filter.label}</button>)}<span>{filteredTowns.length} resultados</span></div>

      <div className="magic-town-grid">{filteredTowns.slice(0, visibleCount).map((town) => { const visited = visitedTownNames.has(town.name); return <article className={`magic-town-card${visited ? " visited" : ""}`} key={`${town.name}-${town.state}`}><div><span>{town.state}</span>{visited ? <strong>YA RODADO</strong> : <strong>POR DESCUBRIR</strong>}</div><h4>{town.name}</h4><div className="magic-town-actions"><button type="button" onClick={() => focusTown(town)}>Ver en el mapa</button><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${town.name}, ${town.state}, México`)}`} target="_blank" rel="noreferrer">Abrir ruta ↗</a></div></article>; })}</div>
      {filteredTowns.length > visibleCount ? <button className="magic-load-more" type="button" onClick={() => setVisibleCount((current) => current + 24)}>Mostrar más pueblos <span>({filteredTowns.length - visibleCount} pendientes por mostrar)</span></button> : null}
      {filteredTowns.length === 0 ? <p className="magic-no-results">No encontramos pueblos con esos filtros. Prueba con otro estado o nombre.</p> : null}
      <p className="magic-source-note">Padrón de referencia: programa Pueblos Mágicos y nombramientos publicados por la Secretaría de Turismo. <a href={puebloSources.announcement2023} target="_blank" rel="noreferrer">Consultar fuente oficial ↗</a></p>
    </div>
  );
}
