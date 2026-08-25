import Image from "next/image";
import type { BikerProfile, ProspectProfile } from "../data/biker-profiles";
import { getBikerRole } from "../data/biker-profiles";

function ProfileCard({ profile }: { profile: BikerProfile }) {
  const motorcycle = profile.motorcycles.find((memory) => memory.current);
  const detail = profile.partner
    ? `Partner · Rueda con ${profile.ridingPartner}`
    : motorcycle
      ? `${motorcycle.brand} ${motorcycle.model}`
      : "Familia Chilanga · Riding Club";

  return (
    <a className="member-card member-profile-card" href={`/integrantes/${profile.slug}`} aria-label={`Conocer la biografía de ${profile.alias}`}>
      <div className="member-card-top"><span>{getBikerRole(profile)}</span></div>
      <div className="biker-portrait-frame">
        {profile.portrait
          ? <Image src={profile.portrait} alt={`Retrato autorizado de ${profile.alias}`} width={520} height={650} unoptimized />
          : <div className="biker-portrait-placeholder"><strong>{profile.alias.slice(0, 2).toLocaleUpperCase("es-MX")}</strong><span>RETRATO OFICIAL</span><small>Próximamente</small></div>}
        <span className="portrait-frame-index">CHILANGOS RC · CDMX</span>
      </div>
      <h3>{profile.alias}</h3>
      <p>{detail}</p>
      <span className="member-profile-link">Conocer su historia ↗</span>
    </a>
  );
}

export default function MemberDirectory({ profiles, prospects }: { profiles: BikerProfile[]; prospects: ProspectProfile[] }) {
  const alphabetical = new Intl.Collator("es-MX", { sensitivity: "base" });
  const founders = profiles.filter((profile) => profile.founder).sort((first, second) => alphabetical.compare(first.alias, second.alias));
  const members = profiles.filter((profile) => !profile.founder).sort((first, second) => alphabetical.compare(first.alias, second.alias));

  return (
    <div className="member-directory">
      <div className="member-toolbar"><div className="member-section-label"><span>FUNDADORES</span><strong>{founders.length}</strong></div><span className="member-privacy-note">Retratos y biografías únicamente con autorización</span></div>
      <p className="founder-origin-note">Siete personas encendieron el primer motor. Quince historias mantienen viva la misma familia.</p>
      <div className="member-grid member-founder-grid">{founders.map((profile) => <ProfileCard profile={profile} key={profile.slug} />)}</div>

      <div className="member-group-heading"><div><span>LA BANDA QUE SIGUE ESCRIBIENDO LA HISTORIA</span><h3>Toda la banda.</h3></div><strong>{members.length} INTEGRANTES</strong></div>
      <div className="member-grid member-official-grid">{members.map((profile) => <ProfileCard profile={profile} key={profile.slug} />)}</div>

      <div className="member-prospect-summary"><span>Prospectos</span><div>{prospects.map((prospect) => <span key={prospect.alias}>{prospect.alias}</span>)}</div></div>
      <div className="member-callout"><span>Cada casco guarda una historia distinta.</span><a href="/cuestionario">Contar mi historia biker ↗</a></div>
    </div>
  );
}
