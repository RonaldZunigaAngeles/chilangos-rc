import Image from "next/image";
import AnniversaryGallery from "./anniversary-gallery";
import BirthdayCalendar from "./birthday-calendar";
import CollaborationForm from "./collaboration-form";
import DestinationExplorer from "./destination-explorer";
import HarleyGarage from "./harley-garage";
import HeritageFrame from "./heritage-frame";
import MemberDirectory from "./member-directory";
import MexicoMagicMap from "./mexico-magic-map";
import MileageCounter from "./mileage-counter";
import PatchMilestones from "./patch-milestones";
import RideExplorer from "./ride-explorer";
import YearArchive from "./year-archive";
import { bikerProfiles, prospectProfiles } from "../data/biker-profiles";
import { chilangoAwardCategories } from "../data/club-awards";
import { clubNotices } from "../data/club-notices";
import { club, destinations, getWhatsappLink, individualPatchMilestones, membershipKilometers, nextRide, products, rides, roadTripKilometers } from "../data/chilangos";
import { bikerThursdayMoments, bikerThursdayVenues, prospectJourney, ridingClubValues } from "../data/club-culture";
import { anniversaryAlbums, annualMileage, archiveAlbums, clubHeritage, featuredRides, garageTips, partnerCategories, partnerLocations } from "../data/club-life";
import { pueblosByState } from "../data/pueblos-magicos";

export default function ClubHome() {
  return (
    <main>
      <header className="topbar">
        <a className="wordmark branded-wordmark" href="#inicio" aria-label="Chilangos RC, inicio">
          <Image src="/chilangos-logo-original.jpg" alt="" width={58} height={58} className="wordmark-logo" priority unoptimized />
          <span className="wordmark-name">CHILANGOS <span>RC</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#historia">Historia</a>
          <a href="#fundadores">La banda</a>
          <a href="#cumpleanos">Cumpleaños</a>
          <a href="#full-patch">Full patch</a>
          <a href="#rutas">Rodadas</a>
          <a href="#pueblos-magicos">Pueblos mágicos</a>
          <a href="#garage">Garage</a>
          <a href="#comunicados">Comunicados</a>
          <a href="#aliados">Aliados</a>
          <a href="#tienda">Tienda</a>
          <a className="nav-accent" href={getWhatsappLink()} target="_blank" rel="noreferrer">WhatsApp ↗</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy section-shell">
          <div className="hero-mexico-line" aria-label="Hecho en México"><span /><span /><span /></div>
          <p className="hero-origin">Ciudad de México · Riding Club · Desde 2022</p>
          <h1 className="hero-club-title"><span>CHILANGOS</span> <strong>RC</strong></h1>
          <div className="hero-brand-rule" aria-hidden="true"><span /></div>
          <p className="hero-tagline">No somos jerarquías. <strong>Somos una familia.</strong></p>
          <p className="hero-motto">{club.motto}</p>
          <p className="hero-description">
            Quince historias, una misma hermandad y todos los caminos que
            todavía nos faltan por rodar.
          </p>
          <div className="hero-actions"><a className="button button-light" href="#historia">Conoce nuestra historia <span aria-hidden="true">↗</span></a><a className="button button-outline" href="#pueblos-magicos">Explora el mapa <span aria-hidden="true">↗</span></a><a className="button button-whatsapp" href={getWhatsappLink()} target="_blank" rel="noreferrer">Escríbenos por WhatsApp <span aria-hidden="true">↗</span></a></div>
        </div>
        <div className="hero-bottom section-shell">
          <span>CHILANGOS RIDING CLUB</span>
          <span>RODANDO DESDE EL 10 · 12 · 22</span>
        </div>
      </section>

      <section className="stats" aria-label="Chilangos RC en números">
        <div className="stats-inner section-shell">
          <div><strong>{rides.length}</strong><span>rodadas registradas</span></div>
          <div><strong>{roadTripKilometers.toLocaleString("es-MX")}</strong><span>kilómetros en ruta</span></div>
          <div><strong>{destinations.length}</strong><span>destinos por descubrir</span></div>
          <div><strong>{pueblosByState.length}</strong><span>entidades en el mapa</span></div>
        </div>
      </section>

      <section className="next-ride-band" id="proxima-rodada" aria-label="Próxima rodada">
        <div className="section-shell next-ride-poster">
          <div className="next-ride-date">
            <span>{nextRide ? "APARTA LA FECHA" : "PRÓXIMA FECHA"}</span>
            <strong>{nextRide ? new Date(`${nextRide.date}T12:00:00`).toLocaleDateString("es-MX", { day: "2-digit" }) : "?"}</strong>
            <small>{nextRide ? new Date(`${nextRide.date}T12:00:00`).toLocaleDateString("es-MX", { month: "long" }) : "POR CONFIRMAR"}</small>
          </div>

          <div className="next-ride-info">
            <span>{nextRide ? "PRÓXIMA RODADA CONFIRMADA" : "PRÓXIMA RODADA · CHILANGOS RC"}</span>
            <h2>{nextRide ? nextRide.destination : "El siguiente destino está por escribirse."}</h2>
            {nextRide ? (
              <>
                <div className="next-ride-details"><span><strong>DESTINO</strong>{nextRide.state}</span><span><strong>CITA</strong>{nextRide.meetingTime}</span><span><strong>PUNTO DE REUNIÓN</strong>{nextRide.meetingPoint}</span></div>
                {nextRide.notes && <p className="next-ride-notes">{nextRide.notes}</p>}
              </>
            ) : <p><strong>Fecha por confirmar.</strong> Cada mes organizamos una rodada oficial cuando la vida lo permite. Escríbenos y te avisamos cuando la banda confirme el destino.</p>}
            <a className="next-ride-action" href={getWhatsappLink(nextRide ? `Quiero sumarme a la rodada del ${nextRide.date} a ${nextRide.destination}.` : "¿Cuándo es la próxima rodada de Chilangos RC?")} target="_blank" rel="noreferrer">{nextRide ? "Voy en esta rodada" : "Avísenme cuando haya rodada"} ↗</a>
          </div>

          <div className="next-ride-club-mark"><Image src="/chilangos-logo-original.jpg" alt="Logotipo oficial de Chilangos RC" width={180} height={180} className="next-ride-emblem" unoptimized /><span>{club.motto}</span></div>
        </div>
      </section>

      <section className="story section-shell" id="historia">
        <div className="section-heading">
          <p className="eyebrow">El origen</p>
          <h2>Una historia que<br /><em>se escribe rodando.</em></h2>
        </div>
        <div className="story-copy">
          <p className="intro-copy">
            Chilangos RC nació el 10 de diciembre de 2022 con algo mucho más
            importante que un reglamento: las ganas de salir a carretera con
            amigos y volver con una familia.
          </p>
          <p>
            Somos motociclistas de la Ciudad de México unidos por las buenas
            rutas, la amistad y esos planes que empiezan con un «¿jalan?» y
            terminan convertidos en recuerdos para toda la vida.
          </p>
          <p className="signature">La carretera nos presentó. La hermandad nos dejó juntos.</p>
        </div>
      </section>

      <section className="origin-photo-section section-shell" aria-label="La fotografía original de Chilangos RC"><HeritageFrame image={clubHeritage.foundersPhoto} kind="origin" /><div className="origin-photo-caption"><div><span>FIRST 6 · EL INICIO DE UNA FAMILIA</span><h3>{clubHeritage.foundersPhoto.title}</h3></div><p>Seis amigos, una primera historia frente a la montaña y el comienzo de una hermandad que siete personas fundadoras mantienen viva hasta hoy.</p></div></section>

      <section className="club-code-section" id="hermandad">
        <div className="section-shell">
          <div className="section-topline">
            <div className="section-heading"><p className="eyebrow">Nuestra forma de rodar</p><h2>No somos jerarquías.<br /><em>Somos una familia.</em></h2></div>
            <p className="section-side-note">Un riding club de amigos que pone la convivencia por encima de los cargos, las obligaciones y las apariencias.</p>
          </div>
          <div className="club-code-banner"><strong>RIDING CLUB</strong><span>LIBERTAD · CONVIVENCIA · FAMILIA</span></div>
          <div className="club-values-grid">
            {ridingClubValues.map((value) => <article className="club-value-card" key={value.title}><h3>{value.title}</h3><p>{value.description}</p></article>)}
          </div>
          <div className="club-rhythm-note"><strong>Una rodada oficial al mes, cuando la vida lo permite.</strong><span>Familia, trabajo, salud, clima y seguridad también cuentan. Si no se puede, la hermandad sigue intacta.</span></div>
        </div>
      </section>

      <section className="founders" id="fundadores">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <p className="eyebrow light">La banda</p>
            <h2>Quienes encendieron<br /><em>el primer motor.</em></h2>
          </div>
          <p className="member-section-intro">Somos {bikerProfiles.length} integrantes oficiales: siete personas fundadoras y ocho historias que siguen haciendo crecer esta familia sobre dos ruedas.</p>
          <MemberDirectory profiles={bikerProfiles} prospects={prospectProfiles} />
        </div>
      </section>

      <section className="birthday-section" id="cumpleanos">
        <div className="section-shell">
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">Calendario de la hermandad</p><h2>Las fechas que<br /><em>también se celebran juntos.</em></h2></div><p className="section-side-note">Porque la familia no solamente se encuentra en la carretera: también se acuerda de soplarle al pastel.</p></div>
          <BirthdayCalendar />
        </div>
      </section>

      <section className="membership-section" id="full-patch">
        <div className="section-shell">
          <div className="section-topline">
            <div className="section-heading"><p className="eyebrow">El camino al chaleco</p><h2>El parche no se compra.<br /><em>Se gana en el camino.</em></h2></div>
            <p className="section-side-note">Lo primero es convivir. Después vienen las rodadas compartidas, la confianza y una decisión tomada entre toda la banda.</p>
          </div>
          <div className="membership-heritage"><HeritageFrame image={clubHeritage.officialPatch} kind="patch" /><div><span>NO ES UN ADORNO</span><h3>Son nuestros colores.</h3><p>El chaleco representa kilómetros compartidos, confianza y el camino recorrido para ganarse un lugar dentro de la familia Chilanga.</p></div></div>
          <div className="prospect-highlight"><div><span>REQUISITO DE INGRESO</span><strong>{membershipKilometers.toLocaleString("es-MX")} <em>KM</em></strong></div><p>Rodados en compañía de fundadores e integrantes de Chilangos RC. Los kilómetros personales por separado no sustituyen la convivencia.</p></div>
          <div className="prospect-timeline">{prospectJourney.map((stage) => <article className="prospect-step" key={stage.title}><h3>{stage.title}</h3><p>{stage.detail}</p></article>)}</div>
          <div className="prospect-roll"><span>PROSPECTOS EN CAMINO AL FULL PATCH</span><div>{prospectProfiles.map((prospect) => <strong key={prospect.alias}>{prospect.alias}</strong>)}</div></div>
          <p className="membership-disclaimer">No existen cuotas periódicas. Cada prospecto cubre su chaleco y parche; los momentos y materiales internos de la ceremonia permanecen privados.</p>
        </div>
      </section>

      <section className="odometer-section" id="kilometros">
        <div className="section-shell"><MileageCounter total={roadTripKilometers} rides={rides.length} byYear={annualMileage} /><PatchMilestones milestones={individualPatchMilestones} sharedRequirement={membershipKilometers} /></div>
      </section>

      <section className="biker-thursday-section" id="jueves-biker">
        <div className="section-shell">
          <div className="section-topline">
            <div className="section-heading"><p className="eyebrow">La hermandad también se sienta a la mesa</p><h2>Jueves biker.<br /><em>La familia también se reúne.</em></h2></div>
            <p className="section-side-note">Un encuentro para convivir fuera de la carretera, fortalecer la camaradería, ponernos al día y organizar juntos las próximas rodadas y actividades del club.</p>
          </div>
          <div className="biker-thursday-hero"><strong>JUEVES BIKER</strong><span>CAMARADERÍA · CONVIVENCIA · PRÓXIMAS RODADAS</span><p>Cuando estacionamos las motos, la hermandad sigue. Compartimos la mesa, nos escuchamos, resolvemos pendientes y organizamos lo que viene. La sede cambia; lo importante es encontrarnos como amigos y seguir construyendo familia.</p></div>
          <div className="biker-venues" aria-label="Puntos biker de la Ciudad de México"><div className="biker-venues-heading"><span>PUNTOS DONDE NOS GUSTA COINCIDIR</span><p>La ubicación cambia; cada reunión se acuerda entre la banda.</p></div><div className="biker-venue-grid">{bikerThursdayVenues.map((venue) => <a className="biker-venue-card" href={venue.href} target="_blank" rel="noreferrer" key={venue.name}><span>{venue.verifiedInstagram ? "INSTAGRAM OFICIAL" : "PUNTO BIKER"}</span><h3>{venue.name}</h3><p>{venue.description}</p><strong>{venue.handle} ↗</strong></a>)}</div></div>
          <div className="biker-thursday-grid">{bikerThursdayMoments.map((moment) => <article className="biker-thursday-card" key={moment.title}><h3>{moment.title}</h3><p>{moment.detail}</p></article>)}</div>
          <p className="biker-thursday-note">Las reuniones se acuerdan internamente. No publicamos ubicaciones exactas, horarios privados ni datos personales de la banda.</p>
        </div>
      </section>

      <section className="archive-section section-shell" id="archivo">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">Archivo de la hermandad</p><h2>Cada año guarda<br /><em>su propia rodada.</em></h2></div>
          <p className="section-side-note">Un álbum vivo para conservar las fotos, las rutas y los recuerdos que construyeron cada temporada.</p>
        </div>
        <YearArchive albums={archiveAlbums} rides={rides} instagram={club.instagram} />
      </section>

      <section className="anniversary-section" id="aniversarios"><div className="section-shell"><div className="section-topline"><div className="section-heading"><p className="eyebrow">Las vueltas que ya dimos juntos</p><h2>Tres aniversarios.<br /><em>Una misma familia.</em></h2></div><p className="section-side-note">Tres celebraciones, tres capítulos de hermandad y un espacio reservado para las fotografías reales de quienes hicieron posible cada año.</p></div><AnniversaryGallery anniversaries={anniversaryAlbums} /></div></section>

      <section className="rides-section section-shell" id="rutas">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">Bitácora de carretera</p><h2>Los caminos<br /><em>que nos trajeron aquí.</em></h2></div>
          <p className="section-side-note">De Val’Quirico a Taxco. De Chachalacas a Acapulco. Cada ruta tiene su propia historia.</p>
        </div>
        <div className="featured-route-grid">
          {featuredRides.map((ride) => (
            <article className="featured-route-card" key={`${ride.date}-${ride.destination}`}>
              <span>RUTA RODADA · {ride.state.toLocaleUpperCase("es-MX")}</span>
              <h3>{ride.destination}</h3>
              <div><strong>{ride.roundTripKm} km</strong><span className="featured-route-links"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ride.meetingPoint}, Ciudad de México`)}`} target="_blank" rel="noreferrer">Punto de reunión ↗</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ride.destination}, ${ride.state}, México`)}`} target="_blank" rel="noreferrer">Ver destino ↗</a></span></div>
            </article>
          ))}
        </div>
        <RideExplorer rides={rides} />
      </section>

      <section className="quote-band">
        <div className="section-shell"><p>Juntos vamos.</p><p><em>Juntos regresamos.</em></p></div>
      </section>

      <section className="destinations-section section-shell" id="destinos">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">Ideas para prender la moto</p><h2>¿A dónde<br /><em>nos vamos ahora?</em></h2></div>
          <p className="section-side-note">{destinations.length} destinos para comparar por ubicación, distancia y tipo de lugar antes de proponer la siguiente rodada.</p>
        </div>
        <DestinationExplorer destinations={destinations} rides={rides} />
      </section>

      <section className="pueblos-section" id="pueblos-magicos">
        <div className="section-shell">
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">El pasaporte Chilango</p><h2>Todo México<br /><em>nos queda de camino.</em></h2></div><p className="section-side-note">177 Pueblos Mágicos, una bitácora real y suficientes destinos pendientes para seguir rodando durante años.</p></div>
          <MexicoMagicMap />
        </div>
      </section>

      <section className="garage-section" id="garage">
        <div className="section-shell">
          <div className="section-topline"><div className="section-heading light-heading"><p className="eyebrow light">El garage Chilango</p><h2>Rodar chingón<br /><em>también es regresar.</em></h2></div><p className="garage-note">Una guía breve de mantenimiento preventivo, respaldada por fuentes oficiales de Harley-Davidson y siempre subordinada al manual de cada moto.</p></div>
          <HarleyGarage />
          <p className="garage-code-heading">El código Chilango en carretera.</p>
          <div className="route-safety-callout"><div><span>REQUISITOS PARA RODAR CON CHILANGOS RC</span><h3>Seguro vigente y ficha privada de seguridad.</h3><p>Para integrarte a una rodada debes contar con seguro de motocicleta vigente y llenar el cuestionario de seguridad. La información se mantiene privada y solo se consulta para coordinación o respuesta ante una emergencia.</p></div><a href="/seguridad-en-ruta">Llenar ficha de seguridad ↗</a></div>
          <div className="garage-grid">{garageTips.map((tip) => <article className="garage-card" key={tip.category}><div><span>{tip.category}</span></div><h3>{tip.title}</h3><p>{tip.advice}</p><small>{tip.detail}</small></article>)}</div>
          <p className="garage-disclaimer">Cada motocicleta tiene especificaciones propias. Revisa su manual y acude a un mecánico calificado cuando exista una falla o duda de seguridad.</p>
        </div>
      </section>

      <section className="awards-section" id="momentos">
        <div className="awards-layout section-shell">
          <div><div className="section-heading"><p className="eyebrow">Lo que pasa en la rodada</p><h2>La carretera<br /><em>también se ríe.</em></h2></div><p className="awards-intro">Los Chilangos Awards son reconocimientos internos, simbólicos y con humor que la propia banda entrega para celebrar la personalidad, las anécdotas y la forma en que cada integrante aporta a la convivencia. No representan jerarquías ni una competencia.</p></div>
          <div className="awards-grid">{chilangoAwardCategories.map((award) => <article className="award-card" key={award.title}><h3>{award.title}</h3><p>{award.description}</p></article>)}</div>
        </div>
      </section>

      <section className="notices-section" id="comunicados">
        <div className="section-shell">
          <div className="section-topline"><div className="section-heading"><p className="eyebrow">Información oficial del club</p><h2>Comunicados<br /><em>con claridad.</em></h2></div><p className="section-side-note">Este espacio conserva únicamente avisos confirmados por Chilangos RC. No se publican rumores, motivos privados ni datos personales.</p></div>
          <div className="notices-policy"><strong>Uso de nombre, parche y colores.</strong><p>Cuando una baja sea comunicada oficialmente, esa persona deja de pertenecer al club y no está autorizada para presentarse como integrante, representar a Chilangos RC ni usar sus colores como miembro activo.</p></div>
          {clubNotices.length > 0 ? <div className="notices-list">{clubNotices.map((notice) => <article key={`${notice.effectiveDate}-${notice.title}`}><span>{notice.effectiveDate}</span><h3>{notice.title}</h3><p>{notice.statement}</p></article>)}</div> : <div className="notices-empty"><strong>No hay comunicados públicos vigentes.</strong><p>Cuando exista un aviso confirmado, aparecerá aquí con su fecha oficial.</p></div>}
        </div>
      </section>

      <section className="partners-section section-shell" id="aliados">
        <div className="section-topline"><div className="section-heading"><p className="eyebrow">Comunidad, patrocinios y colaboraciones</p><h2>Si sumas al camino,<br /><em>hay lugar en la ruta.</em></h2></div><p className="section-side-note">Queremos construir relaciones honestas con talleres, marcas, bares y restaurantes que compartan nuestro respeto por la comunidad biker.</p></div>
        <div className="partner-featured-grid">{partnerLocations.map((partner) => <article className="partner-featured-card" key={partner.name}><span>{partner.status.toLocaleUpperCase("es-MX")}</span><h3>{partner.name}</h3><p>{partner.relationship}</p><small>{partner.category} · {partner.location}</small>{partner.mapsUrl && <a className="partner-location-link" href={partner.mapsUrl} target="_blank" rel="noreferrer">Cómo llegar ↗</a>}</article>)}<article className="partner-featured-card pending"><span>NUESTROS COLORES PODRÍAN SEGUIR RODANDO</span><h3>Un nuevo punto biker en CDMX.</h3><p>Estamos conversando sobre un espacio adicional para que nuestra comunidad también tenga presencia en la ciudad.</p><small>Sin acuerdo anunciado todavía.</small></article></div>
        <div className="partner-grid">{partnerCategories.map((partner) => <article className="partner-card" key={partner.type}><h3>{partner.type}</h3><p>{partner.value}</p></article>)}</div>
        <div className="partner-callout"><div><span>¿Te gustaría colaborar con Chilangos RC?</span><p>Si tienes un taller, bar, restaurante, marca o proyecto biker, cuéntanos cómo podemos encontrarnos y construir una relación que realmente le sirva a la banda.</p></div><a href="#colaboraciones">Propón una colaboración ↗</a></div>
        <CollaborationForm />
        <p className="partner-disclaimer">Los descuentos, logotipos y convenios se publicarán únicamente después de ser autorizados, acordados y verificados.</p>
      </section>

      <section className="shop-section section-shell" id="tienda">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">Merch oficial</p><h2>El club también<br /><em>se lleva puesto.</em></h2></div>
          <p className="section-side-note">Piezas de Chilangos RC. Hechas para quienes saben que el mejor plan empieza con «¿jalan?».</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className={`product-visual product-visual-${index + 1}`}><Image src="/chilangos-logo-original.jpg" alt="Logotipo original de Chilangos RC México" width={170} height={170} className="product-logo" unoptimized /><small>RIDING CLUB · CDMX</small></div>
              <p className="product-category">{product.category}</p>
              <h3>{product.title}</h3>
              <p className="product-description">{product.description}</p>
              {product.paymentUrl
                ? <a className="product-action" href={product.paymentUrl} target="_blank" rel="noreferrer">Comprar con Mercado Pago ↗</a>
                : <a className="product-action" href={getWhatsappLink(`Me interesa "${product.title}" de Chilangos RC.`)} target="_blank" rel="noreferrer">Preguntar por WhatsApp ↗</a>}
            </article>
          ))}
        </div>
        <p className="shop-note">Colección en preparación: todavía no hay venta en línea activa. Escríbenos por WhatsApp para apartar una pieza o preguntar precios y tiempos.</p>
      </section>

      <section className="social-band">
        <div className="social-layout section-shell">
          <div><p className="eyebrow light">Sigue la rodada</p><h2>Las buenas historias<br /><em>también se comparten.</em></h2></div>
          <div className="social-links"><a href={club.instagram} target="_blank" rel="noreferrer">Instagram · @chilangosrc <span>↗</span></a><a href={club.facebook} target="_blank" rel="noreferrer">Facebook · Chilangos RC México <span>↗</span></a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <div className="footer-brand"><a className="footer-emblem" href="#inicio" aria-label="Chilangos RC, volver al inicio"><Image src="/chilangos-logo-original.jpg" alt="Logotipo original de Chilangos RC México" width={150} height={150} unoptimized /></a><p>Ciudad de México · Rodando desde 2022</p><strong>No somos jerarquías.<br /><em>Somos una familia.</em></strong></div>
          <div className="footer-navigation"><span>LA RUTA</span><a href="#historia">Nuestra historia</a><a href="#fundadores">Toda la banda</a><a href="#cumpleanos">Cumpleaños de la banda</a><a href="#rutas">Rodadas y destinos</a><a href="#jueves-biker">Jueves biker</a></div>
          <div className="footer-navigation"><span>CHILANGOS RC</span><a href="#kilometros">Méritos personales</a><a href="#garage">Garage Chilango</a><a href="/seguridad-en-ruta">Ficha de seguridad</a><a href="#comunicados">Comunicados</a><a href="#aliados">Colaboraciones</a><a href="#tienda">Merch oficial</a></div>
          <div className="footer-connect"><span>SIGUE LA RODADA</span><div className="footer-social-links" aria-label="Redes sociales de Chilangos RC"><a href={club.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={club.facebook} target="_blank" rel="noreferrer">Facebook ↗</a><a href={getWhatsappLink()} target="_blank" rel="noreferrer">WhatsApp ↗</a></div><p>Juntos vamos.<br />Juntos regresamos.</p></div>
        </div>
        <div className="footer-bottom section-shell"><span>CHILANGOS RIDING CLUB · EST. 2022</span><a href="#inicio">VOLVER ARRIBA ↑</a><span>HECHO CON HERMANDAD EN MÉXICO</span></div>
        <div className="footer-dev section-shell"><span>Sitio desarrollado por <a href="https://sosializarte.com" target="_blank" rel="noreferrer">Sosializarte</a></span></div>
      </footer>

      <a className="whatsapp-float" href={getWhatsappLink()} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.36.657 4.566 1.8 6.45L3 29l7.24-2.257A12.44 12.44 0 0 0 16 28c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3zm0 22.7a10.16 10.16 0 0 1-5.19-1.42l-.372-.222-4.293 1.339 1.36-4.19-.242-.384A10.15 10.15 0 0 1 5.8 15.5c0-5.634 4.567-10.2 10.2-10.2 5.633 0 10.2 4.566 10.2 10.2 0 5.633-4.567 10.2-10.2 10.2zm5.59-7.64c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.688.153-.204.306-.79.995-.968 1.199-.178.204-.357.23-.663.077-.306-.153-1.293-.477-2.463-1.52-.91-.812-1.525-1.814-1.703-2.12-.178-.306-.02-.472.134-.624.137-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.05-.383-.026-.535-.077-.153-.688-1.658-.943-2.27-.248-.596-.5-.516-.688-.525-.178-.008-.382-.01-.586-.01-.204 0-.535.077-.815.383-.28.306-1.07 1.045-1.07 2.55 0 1.505 1.096 2.958 1.249 3.162.153.204 2.157 3.293 5.226 4.618.73.315 1.3.503 1.744.644.733.233 1.4.2 1.927.121.588-.088 1.81-.74 2.065-1.454.255-.715.255-1.327.178-1.454-.076-.128-.28-.204-.586-.357z" /></svg>
      </a>
    </main>
  );
}
