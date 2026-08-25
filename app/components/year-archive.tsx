"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Ride } from "../data/chilangos";
import type { ArchiveAlbum } from "../data/club-life";

export default function YearArchive({ albums, rides, instagram }: { albums: ArchiveAlbum[]; rides: Ride[]; instagram: string }) {
  const [year, setYear] = useState(() => albums.findLast((album) => rides.some((ride) => ride.date.startsWith(album.year)))?.year ?? albums[0]?.year ?? "2026");
  const current = albums.find((album) => album.year === year) ?? albums[0];
  const annualRides = useMemo(() => rides.filter((ride) => ride.date.startsWith(year)), [rides, year]);
  const totalKilometers = annualRides.reduce((total, ride) => total + ride.roundTripKm, 0);

  if (!current) return null;

  return (
    <div className="year-archive">
      <div className="year-selector" aria-label="Seleccionar temporada">
        {albums.map((album) => (
          <button className={album.year === year ? "year-selector-button active" : "year-selector-button"} onClick={() => setYear(album.year)} aria-pressed={album.year === year} key={album.year}>
            <span>{album.year}</span><small>{rides.filter((ride) => ride.date.startsWith(album.year)).length || "—"} rutas</small>
          </button>
        ))}
      </div>

      <div className="archive-cover">
        <div className="archive-cover-copy"><span>ARCHIVO CHILANGO · {current.year}</span><h3>{current.chapter}</h3><p>{current.story}</p></div>
        <div className="archive-cover-stats"><div><strong>{annualRides.length || "—"}</strong><span>rodadas documentadas</span></div><div><strong>{totalKilometers ? totalKilometers.toLocaleString("es-MX") : "—"}</strong><span>kilómetros registrados</span></div></div>
      </div>

      {current.photos.length > 0 ? (
        <div className="archive-photo-grid">
          {current.photos.map((photo) => (
            <figure className="archive-photo" key={photo.src}><Image src={photo.src} alt={photo.description} width={640} height={440} unoptimized /><figcaption>{photo.title}</figcaption></figure>
          ))}
        </div>
      ) : (
        <div className="archive-empty"><span>Fotos originales pendientes de incorporar</span><p>Este álbum está preparado para publicar imágenes reales del club sin inventar recuerdos.</p><a href={instagram} target="_blank" rel="noreferrer">Ver momentos en Instagram ↗</a></div>
      )}

      {annualRides.length > 0 && <div className="archive-stamps">{annualRides.slice(0, 6).map((ride) => <span key={`${ride.date}-${ride.destination}`}>{ride.destination}</span>)}</div>}
    </div>
  );
}
