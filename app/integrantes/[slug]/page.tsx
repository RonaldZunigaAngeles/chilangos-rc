import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireClubAdministrator } from "../../administracion/access";
import { bikerProfiles, getBikerProfile, getBikerRole } from "../../data/biker-profiles";
import { club } from "../../data/chilangos";

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return bikerProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getBikerProfile(slug);

  if (!profile) return { title: "Integrante no encontrado | Chilangos RC" };

  const title = `${profile.alias} | Chilangos RC`;
  const description = `${getBikerRole(profile)} de Chilangos RC. Su historia biker, pasiones y motocicletas compartidas con autorización.`;
  const images = profile.portrait ? [{ url: new URL(profile.portrait, club.domain).toString(), alt: `Retrato de ${profile.alias}` }] : [];

  return {
    title,
    description,
    alternates: { canonical: `/integrantes/${profile.slug}` },
    openGraph: { title, description, type: "profile", url: `/integrantes/${profile.slug}`, images },
    twitter: { card: profile.portrait ? "summary_large_image" : "summary", title, description, images: images.map((image) => image.url) },
  };
}

export default async function BikerProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  await requireClubAdministrator(`/integrantes/${slug}`);
  const profile = getBikerProfile(slug);

  if (!profile) notFound();

  const index = bikerProfiles.findIndex((person) => person.slug === slug);
  const nextProfile = bikerProfiles[(index + 1) % bikerProfiles.length];
  const currentMotorcycle = profile.motorcycles.find((motorcycle) => motorcycle.current);

  return (
    <main className="profile-page">
      <header className="profile-topbar section-shell"><Link className="wordmark" href="/">CHILANGOS <span>RC</span></Link><Link className="profile-back" href="/sitio-completo#fundadores">← Volver a la banda</Link></header>

      <section className="profile-hero section-shell">
        <div className="profile-hero-copy"><p className="eyebrow">Una historia de nuestra familia</p><span className="profile-role">{getBikerRole(profile)}</span><h1>{profile.alias}<span>.</span></h1><p>{profile.partner ? "La hermandad también se vive desde el asiento de atrás. Ser partner es compartir la carretera, la convivencia y la familia Chilanga." : "Cada motociclista carga una historia distinta. Esta página conserva únicamente los recuerdos y datos que decide compartir."}</p><div className="profile-hero-meta"><span>CHILANGOS RC · CDMX</span>{profile.founder && <span>DESDE EL ORIGEN</span>}{profile.ridingPartner && <span>RUEDA CON {profile.ridingPartner.toLocaleUpperCase("es-MX")}</span>}</div></div>
        <div className="profile-portrait"><div className="profile-portrait-frame">{profile.portrait ? <Image src={profile.portrait} alt={`Retrato oficial de ${profile.alias}`} width={850} height={1100} unoptimized /> : <div className="profile-portrait-placeholder"><strong>{profile.alias.slice(0, 2).toLocaleUpperCase("es-MX")}</strong><span>RETRATO OFICIAL</span><small>Próximamente</small></div>}</div><span>FOTOGRAFÍA AUTORIZADA · CHILANGOS RC</span></div>
      </section>

      <section className="profile-facts section-shell" aria-label={`Información autorizada de ${profile.alias}`}>
        <div><span>EN LA BANDA</span><strong>{getBikerRole(profile)}</strong></div>
        <div><span>NUESTRA HISTORIA</span><strong>{profile.founder ? "Desde el origen" : "Familia Chilanga"}</strong></div>
        <div><span>EDAD</span><strong>{profile.age === null ? "Dato opcional" : `${profile.age} años`}</strong></div>
        <div><span>{profile.partner ? "EN LA RODADA" : "MOTO ACTUAL"}</span><strong>{profile.partner ? `Partner de ${profile.ridingPartner}` : currentMotorcycle ? currentMotorcycle.model : "Por compartir"}</strong></div>
      </section>

      <section className="profile-story section-shell">
        <div className="section-heading"><p className="eyebrow">Debajo del casco</p><h2>Una historia<br /><em>que merece contarse.</em></h2></div>
        <div className="profile-story-copy">{profile.biography ? <p>{profile.biography}</p> : <><p>La historia personal de {profile.alias} aparecerá aquí cuando decida contarla y autorice su publicación.</p><p>Este espacio está reservado para sus inicios, los momentos que definieron su gusto por las motocicletas y lo que significa pertenecer a Chilangos.</p></>}<a href="/cuestionario">Compartir mi historia biker ↗</a></div>
      </section>

      <section className="profile-passions"><div className="section-shell"><div className="section-topline"><div className="section-heading light-heading"><p className="eyebrow light">Fuera y dentro de la carretera</p><h2>Las cosas<br /><em>que encienden el motor.</em></h2></div><p className="profile-passions-note">Pasiones, hobbies y filosofía personal compartidos únicamente con autorización.</p></div><div className="profile-interest-grid"><article><span>PASIONES</span>{profile.passions.length ? profile.passions.map((passion) => <strong key={passion}>{passion}</strong>) : <p>Por compartir cuando {profile.alias} lo decida.</p>}</article><article><span>HOBBIES</span>{profile.hobbies.length ? profile.hobbies.map((hobby) => <strong key={hobby}>{hobby}</strong>) : <p>Un espacio para todo lo que también disfruta fuera de la rodada.</p>}</article><article><span>FILOSOFÍA BIKER</span>{profile.philosophy ? <strong>{profile.philosophy}</strong> : <p>Las palabras que definen su manera de vivir el camino.</p>}</article></div></div></section>

      <section className="profile-garage section-shell"><div className="section-topline"><div className="section-heading"><p className="eyebrow">Mi garage personal</p><h2>{profile.partner ? "La carretera también" : "Las motos que"}<br /><em>{profile.partner ? "se comparte." : "me trajeron hasta aquí."}</em></h2></div><p className="section-side-note">{profile.partner ? "Una partner forma parte de la historia del club sin necesidad de tener motocicleta propia." : "Un registro de las motocicletas que han acompañado cada etapa de su historia biker."}</p></div>{profile.partner ? <div className="profile-partner-note"><strong>Acompañar también es rodar.</strong><span>{profile.alias} comparte la vida biker con {profile.ridingPartner} y forma parte activa de la familia Chilanga.</span></div> : profile.motorcycles.length ? <div className="motorcycle-timeline">{profile.motorcycles.map((motorcycle, motorcycleIndex) => <article className="motorcycle-card" key={`${motorcycle.brand}-${motorcycle.model}-${motorcycleIndex}`}><div className="motorcycle-photo">{motorcycle.photo ? <Image src={motorcycle.photo} alt={`${motorcycle.brand} ${motorcycle.model}`} width={680} height={420} unoptimized /> : <><span>GARAGE CHILANGO</span><strong>FOTOGRAFÍA DE LA MOTO</strong><small>Próximamente</small></>}</div><div className="motorcycle-card-copy"><span>{motorcycle.current ? "MOTO ACTUAL" : "PARTE DE LA HISTORIA"}{motorcycle.period ? ` · ${motorcycle.period}` : ""}</span><h3>{motorcycle.brand} {motorcycle.model}</h3>{motorcycle.story && <p>{motorcycle.story}</p>}</div></article>)}<article className="motorcycle-add-note"><span>EL GARAGE SIGUE CRECIENDO</span><strong>Aquí también caben las motos anteriores.</strong><p>Se agregarán modelos, fotografías y recuerdos cuando {profile.alias} los comparta.</p></article></div> : <div className="profile-garage-empty"><strong>El garage está listo para recibir su historia.</strong><p>Las motocicletas actuales y anteriores aparecerán cuando sean confirmadas por {profile.alias}.</p></div>}</section>

      {profile.awards.length > 0 && (
        <section className="profile-awards section-shell" aria-label={`Chilangos Awards de ${profile.alias}`}>
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">Reconocimientos de la banda</p><h2>Los premios que<br /><em>también hicieron historia.</em></h2></div><p className="section-side-note">Chilangos Awards entregados durante los encuentros y aniversarios del club.</p></div>
          <div className="profile-award-grid">{profile.awards.map((award) => <article className="profile-award-card" key={`${award.title}-${award.year}`}><span>CHILANGOS AWARDS · {award.year}</span><h3>{award.title}</h3>{award.note && <p>{award.note}</p>}</article>)}</div>
        </section>
      )}

      <section className="profile-routes"><div className="section-shell profile-routes-inner"><div><span>RUTA FAVORITA</span><strong>{profile.favoriteRoute ?? "Por compartir"}</strong></div><div><span>LA RUTA QUE SUEÑA</span><strong>{profile.dreamRoute ?? "Por descubrir"}</strong></div></div></section>

      <section className="profile-next section-shell"><div><span>OTRA HISTORIA DE LA BANDA</span><a href={`/integrantes/${nextProfile.slug}`}>{nextProfile.alias} <em>↗</em></a></div><Link href="/sitio-completo#fundadores">Conocer a toda la familia ↗</Link></section>

      <footer className="profile-footer"><div className="section-shell"><span>CHILANGOS RIDING CLUB · CIUDAD DE MÉXICO</span><a href={club.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div></footer>
    </main>
  );
}
