import DestinationExplorer from "./components/destination-explorer";
import RideExplorer from "./components/ride-explorer";
import { club, crew, destinations, founders, products, rides, roadTripKilometers } from "./data/chilangos";

const stateCount = new Set(
  destinations.flatMap((place) => place.state.split(" y ")),
).size;

const awards = [
  { title: "El Rodador", description: "Siempre listo, sin importar el destino." },
  { title: "El Fashion Biker", description: "Impecable de pies a cabeza." },
  { title: "El Chambitas", description: "El que siempre resuelve cualquier desperfecto." },
  { title: "El Cositas", description: "Trae herramientas, snacks y lo que haga falta." },
  { title: "El Tragón", description: "La mejor ruta siempre termina donde se come rico." },
  { title: "El Dormilón", description: "Cinco minutitos más… y ya voy para allá." },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Chilangos RC, inicio">
          CHILANGOS <span>RC</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#historia">Historia</a>
          <a href="#fundadores">La banda</a>
          <a href="#rutas">Rodadas</a>
          <a href="#destinos">Destinos</a>
          <a href="#tienda">Tienda</a>
          <a href="/cuestionario">Tu historia</a>
          <a className="nav-accent" href={club.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-overlay" />
        <div className="hero-copy section-shell">
          <p className="eyebrow light">Ciudad de México · Desde 2022</p>
          <h1>La familia<br /><span>se rueda.</span></h1>
          <p className="hero-description">
            Es la banda que te espera, el camino que compartimos y la historia
            que seguimos escribiendo sobre dos ruedas.
          </p>
          <a className="button button-light" href="#historia">
            Conoce nuestra historia <span aria-hidden="true">↗</span>
          </a>
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
          <div><strong>{stateCount}</strong><span>estados en el mapa</span></div>
        </div>
      </section>

      <section className="story section-shell" id="historia">
        <div className="section-heading">
          <p className="eyebrow">01 · El origen</p>
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

      <section className="founders" id="fundadores">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <p className="eyebrow light">02 · La banda</p>
            <h2>Quienes encendieron<br /><em>el primer motor.</em></h2>
          </div>
          <div className="founder-grid">
            {founders.map((member, index) => (
              <article className="founder-card" key={member.name}>
                <span className="founder-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{member.name}</h3>
                <p>{member.motorcycle}</p>
                <span className="founder-role">{member.role}</span>
              </article>
            ))}
          </div>
          <div className="crew-block">
            <p className="eyebrow light">Y una banda que sigue creciendo</p>
            <div className="crew-list">{crew.map((member) => <span key={member}>{member}</span>)}</div>
            <a className="crew-questionnaire" href="/cuestionario">¿Eres parte de Chilangos? Cuéntanos tu historia biker ↗</a>
          </div>
        </div>
      </section>

      <section className="rides-section section-shell" id="rutas">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">03 · Bitácora de carretera</p><h2>Los caminos<br /><em>que nos trajeron aquí.</em></h2></div>
          <p className="section-side-note">De Val’Quirico a Taxco. De Chachalacas a Acapulco. Cada ruta tiene su propia historia.</p>
        </div>
        <RideExplorer rides={rides} />
      </section>

      <section className="quote-band">
        <div className="section-shell"><p>No contamos los días.</p><p><em>Contamos las historias.</em></p></div>
      </section>

      <section className="destinations-section section-shell" id="destinos">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">04 · El mapa Chilango</p><h2>¿A dónde<br /><em>nos vamos ahora?</em></h2></div>
          <p className="section-side-note">50 destinos, once estados y un montón de pretextos para prender la moto.</p>
        </div>
        <DestinationExplorer destinations={destinations} />
      </section>

      <section className="awards-section" id="momentos">
        <div className="awards-layout section-shell">
          <div><div className="section-heading"><p className="eyebrow">05 · Lo que pasa en la rodada</p><h2>La carretera<br /><em>también se ríe.</em></h2></div><p className="awards-intro">Desde nuestro segundo aniversario, los Chilangos Awards celebran a esos personajes que hacen especial cada rodada.</p></div>
          <div className="awards-grid">{awards.map((award, index) => <article className="award-card" key={award.title}><span>{String(index + 1).padStart(2, "0")} · CHILANGOS AWARDS</span><h3>{award.title}</h3><p>{award.description}</p></article>)}</div>
        </div>
      </section>

      <section className="shop-section section-shell" id="tienda">
        <div className="section-topline">
          <div className="section-heading"><p className="eyebrow">06 · Merch oficial</p><h2>El club también<br /><em>se lleva puesto.</em></h2></div>
          <p className="section-side-note">Piezas de Chilangos RC. Hechas para quienes saben que el mejor plan empieza con «¿jalan?».</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className={`product-visual product-visual-${index + 1}`}><span>CHILANGOS</span><small>RIDING CLUB · CDMX</small></div>
              <p className="product-category">{product.category}</p>
              <h3>{product.title}</h3>
              <p className="product-description">{product.description}</p>
              {product.paymentUrl
                ? <a className="product-action" href={product.paymentUrl} target="_blank" rel="noreferrer">Comprar con Mercado Pago ↗</a>
                : <a className="product-action" href={club.instagram} target="_blank" rel="noreferrer">Consultar disponibilidad ↗</a>}
            </article>
          ))}
        </div>
        <p className="shop-note">Colección en preparación. Los precios y enlaces de pago se publicarán cuando las piezas estén disponibles.</p>
      </section>

      <section className="social-band">
        <div className="social-layout section-shell">
          <div><p className="eyebrow light">Sigue la rodada</p><h2>Las buenas historias<br /><em>también se comparten.</em></h2></div>
          <div className="social-links"><a href={club.instagram} target="_blank" rel="noreferrer">Instagram · @chilangosrc <span>↗</span></a><a href={club.facebook} target="_blank" rel="noreferrer">Facebook · Chilangos RC México <span>↗</span></a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <a className="wordmark" href="#inicio">CHILANGOS <span>RC</span></a>
          <p>Ciudad de México · Rodando desde 2022</p>
          <div className="footer-social-links" aria-label="Redes sociales de Chilangos RC"><a href={club.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={club.facebook} target="_blank" rel="noreferrer">Facebook ↗</a></div>
          <span>La verdadera familia no se elige. Se rueda.</span>
        </div>
      </footer>
    </main>
  );
}
