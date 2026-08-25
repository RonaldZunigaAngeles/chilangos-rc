import Image from "next/image";
import type { ClubHeritageImage } from "../data/club-life";

export default function HeritageFrame({ image, kind }: { image: ClubHeritageImage; kind: "origin" | "patch" }) {
  return (
    <div className={`heritage-frame heritage-frame-${kind}`}>
      {image.src
        ? <Image src={image.src} alt={image.description} width={kind === "origin" ? 828 : 1280} height={kind === "origin" ? 820 : 780} unoptimized />
        : <div className="heritage-placeholder"><span>{kind === "origin" ? "ARCHIVO ORIGINAL · FIRST 6" : "CHILANGOS RC · COLORES OFICIALES"}</span><strong>{image.title}</strong><p>{image.description}</p></div>}
    </div>
  );
}
