import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ClubHome from "./components/club-home";
import { club, getWhatsappLink } from "./data/chilangos";
import { isRegistrationHostname } from "./site-access";

const motorcyclePhotoMessage =
  "Soy integrante de Chilangos RC y quiero compartir las fotos favoritas de mis motocicletas para mi biografía.";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  if (await isRegistrationHostname()) {
    return {
      title: "Chilangos RC",
      description: "Cuestionario interno para las historias de la familia Chilangos RC.",
      alternates: { canonical: "https://registro.chilangosrc.com" },
      robots: { index: false, follow: false, nocache: true },
    };
  }

  return {};
}

export default async function Home() {
  if (!(await isRegistrationHostname())) {
    return <ClubHome />;
  }

  return (
    <main className="launch-page">
      <header className="launch-header launch-shell" aria-label="Chilangos Riding Club">
        <div className="launch-origin">
          <span className="launch-flag" aria-label="México"><i /><i /><i /></span>
          <span>Ciudad de México · Est. 2022</span>
        </div>
        <span className="launch-status"><i aria-hidden="true" />Sitio en construcción</span>
      </header>

      <section className="launch-hero" aria-labelledby="launch-title">
        <div className="launch-road" aria-hidden="true">
          <Image src="/chilangos-hero.png" alt="" width={1849} height={851} priority unoptimized />
        </div>

        <div className="launch-skull" aria-hidden="true">
          <Image src="/chilangos-logo-original.jpg" alt="" width={1600} height={1600} priority unoptimized />
        </div>

        <div className="launch-hero-content launch-shell">
          <span className="launch-center-flag" aria-label="Hecho en México"><i /><i /><i /></span>
          <p className="launch-kicker">La siguiente ruta no aparece en ningún mapa.</p>
          <h1 id="launch-title" className="launch-title"><span>CHILANGOS</span> <strong>RC</strong></h1>
          <div className="launch-title-rule" aria-hidden="true"><span /></div>
          <p className="launch-announcement">Nuestra historia está por arrancar.</p>
          <p className="launch-intro">Estamos construyendo la casa digital de la familia Chilanga. Pero hay un detalle: esta historia no se puede contar sin ti.</p>
        </div>

        <div className="launch-hero-footer launch-shell"><span>CHILANGOS RIDING CLUB</span><span>{club.motto}</span></div>
      </section>

      <section className="launch-family-section" aria-labelledby="launch-family-title">
        <div className="launch-shell launch-family-grid">
          <div className="launch-family-copy">
            <span className="launch-section-kicker">Una página hecha entre todos</span>
            <h2 id="launch-family-title">Primero fuimos amigos.<br /><em>Después, familia.</em></h2>
            <p>Las mejores rodadas, los momentos que nos marcaron, las motos que amamos y la gente que hizo posible todo esto merecen tener su propio lugar. Ayúdanos a construirlo con tu voz.</p>
            <strong>No somos jerarquías. Somos una familia.</strong>
          </div>
          <figure className="launch-family-photo"><Image src="/heritage/fundadores-first-6.jpg" alt="Los primeros seis fundadores de Chilangos RC reunidos frente a la montaña" width={828} height={820} unoptimized /><figcaption>Donde empezó todo · Chilangos RC</figcaption></figure>
        </div>
      </section>

      <section className="launch-contribute-section" aria-labelledby="launch-contribute-title">
        <div className="launch-shell">
          <div className="launch-contribute-heading"><div><span className="launch-section-kicker">Tu lugar ya está reservado</span><h2 id="launch-contribute-title">Tu historia es<br /><em>el primer kilómetro.</em></h2></div><p>Cada integrante tiene algo que contar. Así vamos a darle forma a su biografía.</p></div>
          <div className="launch-contribute-grid">
            <article className="launch-contribute-card"><span className="launch-card-symbol" aria-hidden="true">✎</span><h3>Cuéntanos quién eres.</h3><p>Tus inicios, tus anécdotas, tu película biker favorita, tus sueños y lo que significa para ti ser parte de Chilangos. Seas biker o partner, tu historia importa.</p><Link href="/cuestionario-integrantes">Completar mi biografía ↗</Link></article>
            <article className="launch-contribute-card"><span className="launch-card-symbol" aria-hidden="true">◉</span><h3>Tu retrato va por nuestra cuenta.</h3><p>Organizaremos una sesión fotográfica individual para que cada integrante tenga un retrato que le haga justicia. La fecha y los detalles se acordarán entre la banda.</p><span className="launch-card-note">Sesión fotográfica próximamente</span></article>
            <article className="launch-contribute-card"><span className="launch-card-symbol" aria-hidden="true">↗</span><h3>Tu garage, a tu manera.</h3><p>Elige las fotos que más te gusten de tu moto actual y de todas las que has tenido. Compártelas por WhatsApp y armaremos un garage que se sienta completamente tuyo.</p><a href={getWhatsappLink(motorcyclePhotoMessage)} target="_blank" rel="noreferrer">Compartir fotos de mis motos ↗</a></article>
          </div>
        </div>
      </section>

      <section className="launch-final-section" aria-labelledby="launch-final-title"><div className="launch-shell launch-final-content"><span>ESTO APENAS ESTÁ ARRANCANDO.</span><h2 id="launch-final-title">Si eres Chilango,<br /><em>esta página también es tuya.</em></h2><Link className="launch-primary-action" href="/cuestionario-integrantes">Quiero contar mi historia <span aria-hidden="true">↗</span></Link><span className="launch-privacy-note">Cuestionario privado · Nada se publica automáticamente</span></div></section>

      <footer className="launch-footer"><div className="launch-shell"><span>CHILANGOS RC · MÉXICO · DESDE 2022</span><strong>{club.motto}</strong></div></footer>
    </main>
  );
}
