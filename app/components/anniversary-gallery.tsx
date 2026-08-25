"use client";

import Image from "next/image";
import { useState } from "react";
import type { AnniversaryAlbum } from "../data/club-life";

const editions = ["PRIMER", "SEGUNDO", "TERCER"];

export default function AnniversaryGallery({ anniversaries }: { anniversaries: AnniversaryAlbum[] }) {
  const [selectedEdition, setSelectedEdition] = useState(anniversaries.at(-1)?.edition ?? 1);
  const current = anniversaries.find((album) => album.edition === selectedEdition) ?? anniversaries[0];

  if (!current) return null;

  return (
    <div className="anniversary-gallery">
      <div className="anniversary-selector" aria-label="Seleccionar aniversario">
        {anniversaries.map((anniversary) => <button className={anniversary.edition === selectedEdition ? "anniversary-button active" : "anniversary-button"} onClick={() => setSelectedEdition(anniversary.edition)} aria-pressed={anniversary.edition === selectedEdition} key={anniversary.edition}><strong>{anniversary.title}</strong><small>{anniversary.year}</small></button>)}
      </div>

      <div className="anniversary-feature"><span>{editions[current.edition - 1]} ANIVERSARIO · {current.year}</span><h3>{current.title}</h3><p>{current.description}</p>{current.location && <small>{current.location}</small>}</div>

      {current.photos.length > 0
        ? <div className="anniversary-photo-grid">{current.photos.map((photo) => <figure key={photo.src}><Image src={photo.src} alt={photo.description} width={700} height={520} unoptimized /><figcaption>{photo.title}</figcaption></figure>)}</div>
        : <div className="anniversary-empty-grid">{[1, 2, 3].map((slot) => <div key={slot}><span>RECUERDO DE LA BANDA</span><strong>Fotografía oficial</strong><small>Este aniversario espera sus recuerdos.</small></div>)}</div>}
      <p className="anniversary-disclaimer">Solo publicamos fotografías originales y autorizadas por quienes aparecen en ellas.</p>
    </div>
  );
}
