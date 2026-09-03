import Image from "next/image";
import type { BikerProfile } from "../data/biker-profiles";
import { getBikerRole } from "../data/biker-profiles";

function ProfileCard({ profile }: { profile: BikerProfile }) {
  const motorcycle = profile.motorcycles.find((memory) => memory.current);
  const cardPortrait = profile.thumbnail ?? profile.portrait;
  const detail = profile.prospect
    ? motorcycle
      ? `Prospecto · ${motorcycle.brand} ${motorcycle.model}`
      : "Prospecto · Familia Chilanga"
    : profile.partner
    ? `Partner · Rueda con ${profile.ridingPartner}`
    : motorcycle
      ? `${motorcycle.brand} ${motorcycle.model}`
      : "Familia Chilanga · Riding Club";

  return (
    <a className="member-card member-profile-card" href={`/integrantes/${profile.slug}`} aria-label={`Conocer la biografía de ${profile.alias}`}>
      <div className="member-card-top"><span>{getBikerRole(profile)}</span></div>
      <div className="biker-portrait-frame">
        {cardPortrait
          ? <Image src={cardPortrait} alt={`Retrato autorizado de ${profile.alias}`} width={640} height={800} sizes="(max-width: 760px) 50vw, 25vw" unoptimized />
          : <div className="biker-portrait-placeholder"><strong>{profile.alias.slice(0, 2).toLocaleUpperCase("es-MX")}</strong><span>RETRATO OFICIAL</span><small>Próximamente</small></div>}
        <span className="portrait-frame-index">CHILANGOS RC · CDMX</span>
      </div>
      <h3>{profile.alias}</h3>
      <p>{detail}</p>
      <span className="member-profile-link">Conocer su historia ↗</span>
    </a>
  );
}

export default function MemberDirectory({ profiles, prospects }: { profiles: BikerProfile[]; prospects: BikerProfile[] }) {
  const alphabetical = new Intl.Collator("es-MX", { sensitivity: "base" });
  const founders = profiles.filter((profile) => profile.founder).sort((first, second) => alphabetical.compare(first.alias, second.alias));
  const members = profiles.filter((profile) => !profile.founder).sort((first, second) => alphabetical.compare(first.alias, second.alias));

  return (
    <div className="member-directory">
      <div className="member-group-heading member-founder-heading"><div><span>QUIENES ENCENDIERON EL PRIMER MOTOR</span><h3>FUNDADORES</h3></div><strong><b>{founders.length}</b><span>FUNDADORES</span></strong></div>
      <span className="member-privacy-note">Retratos y biografías únicamente con autorización</span>
      <p className="founder-origin-note">Siete personas encendieron el primer motor. Hoy, {profiles.length} historias mantienen viva la misma familia.</p>
      <div className="member-grid member-founder-grid">{founders.map((profile) => <ProfileCard profile={profile} key={profile.slug} />)}</div>

      <div className="member-group-heading"><div><span>LA BANDA QUE SIGUE ESCRIBIENDO LA HISTORIA</span><h3>MIEMBROS</h3></div><strong><b>{members.length}</b><span>MIEMBROS</span></strong></div>
      <div className="member-grid member-official-grid">{members.map((profile) => <ProfileCard profile={profile} key={profile.slug} />)}</div>

      <div className="member-group-heading member-prospect-heading"><div><span>PARTICIPACIÓN ACTIVA EN EL MOTOCLUB</span><h3>PROSPECTOS</h3></div><strong><b>{prospects.length}</b><span>PROSPECTOS</span></strong></div>
      <div className="member-grid member-prospect-grid">{[...prospects].sort((first, second) => alphabetical.compare(first.alias, second.alias)).map((profile) => <ProfileCard profile={profile} key={profile.slug} />)}</div>
      <div className="member-callout"><span>Cada casco guarda una historia distinta.</span><a href="/cuestionario">Contar mi historia biker ↗</a></div>
    </div>
  );
}
