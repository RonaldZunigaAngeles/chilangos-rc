import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";

globalThis.__chilangosTestCloudflareEnv = {};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "cloudflare:workers") {
      return {
        shortCircuit: true,
        url: "data:text/javascript,export%20const%20env%20%3D%20globalThis.__chilangosTestCloudflareEnv%3B",
      };
    }

    return nextResolve(specifier, context);
  },
});

async function renderRoute(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  const publicRegistration = path === "/" || path === "/cuestionario-integrantes";

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: {
        accept: "text/html",
        host: publicRegistration ? "registro.chilangosrc.com" : "chilangosrc.com",
        ...(!publicRegistration ? { "oai-authenticated-user-email": "ronaldzunig@gmail.com" } : {}),
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
}

function setQuestionnairePrivacy(form, { profile = "si", photos = "si", social = "no" } = {}) {
  form.set("avisoPrivacidad", "acepto");
  form.set("autorizacionPerfilWeb", profile);
  form.set("autorizacionFotosWeb", photos);
  form.set("autorizacionRedesSociales", social);
}

test("la portada temporal presenta al club y dirige únicamente a la biografía y las fotos", async () => {
  const html = await renderRoute("/");

  assert.match(html, /<title>Chilangos RC<\/title>/);
  assert.match(html, /Sitio en construcción/);
  assert.match(html, /class="launch-skull"/);
  assert.match(html, /class="launch-center-flag" aria-label="Hecho en México"/);
  assert.doesNotMatch(html, /class="launch-emblem"/);
  assert.match(html, /La siguiente ruta no aparece en ningún mapa/);
  assert.match(html, /<h1 id="launch-title" class="launch-title"><span>CHILANGOS<\/span> <strong>RC<\/strong><\/h1>/);
  assert.match(html, /Nuestra historia está por arrancar/);
  assert.match(html, /esta historia no se puede contar sin ti/);
  assert.doesNotMatch(html, /Escribir mi historia/);
  assert.match(html, /href="\/cuestionario-integrantes"/);
  assert.match(html, /Nada se publica automáticamente/);
  assert.match(html, /href="\/aviso-de-privacidad"/);
  assert.match(html, /sesión fotográfica individual/);
  assert.match(html, /fotos que más te gusten de tu moto actual/);
  assert.match(html, /src="\/heritage\/fundadores-first-6\.jpg"/);
  assert.match(html, /Juntos vamos, juntos regresamos\./);
  assert.doesNotMatch(html, /href="\/sitio-completo"/);
  assert.doesNotMatch(html, /href="\/integrantes\//);
  assert.doesNotMatch(html, /href="\/administracion\//);

  const whatsapp = html.match(/https:\/\/wa\.me\/525572718912\?text=([^"<]+)/);
  assert(whatsapp);
  assert.match(decodeURIComponent(whatsapp[1]), /fotos favoritas de mis motocicletas para mi biografía/);
});

test("el aviso de privacidad explica el tratamiento, las autorizaciones y los derechos ARCO", async () => {
  const html = await renderRoute("/aviso-de-privacidad");

  assert.match(html, /<title>Aviso de Privacidad \| Chilangos RC<\/title>/);
  assert.match(html, /Ronald Antonio Zúñiga Ángeles/);
  assert.match(html, /Ficha privada de seguridad/);
  assert.match(html, /Nada se publica automáticamente/);
  assert.match(html, /perfil web, las fotografías del sitio y el uso de material/);
  assert.match(html, /Derechos ARCO y revocación/);
  assert.match(html, /20 días hábiles/);
  assert.match(html, /sosializarte@gmail\.com/);
});

test("renderiza la identidad completa de Chilangos RC sin datos personales", async () => {
  const html = await renderRoute("/sitio-completo");

  assert.match(html, /<title>Chilangos RC<\/title>/);
  assert.match(html, /https:\/\/chilangosrc\.com/);
  assert.match(html, /<h1 class="hero-club-title"><span>CHILANGOS<\/span> <strong>RC<\/strong><\/h1>/);
  assert.doesNotMatch(html, /class="hero-actions"/);
  assert.match(html, /La familia/);
  assert.match(html, /Fundadores, miembros/);
  assert.match(html, /FUNDADORES/);
  assert.match(html, /MIEMBROS/);
  assert.match(html, /PROSPECTOS/);
  assert.match(html, /La banda reúne siete fundadores, siete miembros y dos prospectos activos/);
  assert.match(html, /RETRATO OFICIAL/);
  assert.match(html, /href="\/integrantes\/ronnie"/);
  assert.match(html, /href="\/integrantes\/adri"/);
  assert.match(html, /href="\/integrantes\/fatima"/);
  assert.match(html, /href="\/integrantes\/gi"/);
  assert.match(html, /href="\/integrantes\/fer-fucho"/);
  assert.match(html, /Siete personas encendieron el primer motor/);
  assert.doesNotMatch(html, /Adri estuvo presente desde la primera rodada/);
  assert.match(html, /Fer Fucho/);
  assert.doesNotMatch(html, /padrino/i);
  assert.match(html, /No somos jerarquías/);
  assert.match(html, /La convivencia va primero/);
  assert.match(html, /Sin cuotas periódicas/);
  assert.match(html, /El parche no se compra/);
  assert.match(html, /src="\/heritage\/adri-full-patch\.webp"/);
  assert.match(html, /Adri de espalda portando el full patch oficial/);
  assert.doesNotMatch(html, /biker-patch-logo/);
  assert.match(html, /5,000/);
  assert.match(html, /Esperar la votación/);
  assert.match(html, /ceremonia simbólica y privada/);
  assert.doesNotMatch(html, /PROSPECTOS EN CAMINO AL FULL PATCH/);
  assert.doesNotMatch(html, /Cada prospecto cubre su chaleco y parche/);
  assert.match(html, /El odómetro de la hermandad/);
  assert.doesNotMatch(html, /Kilometraje registrado en tu odómetro/);
  assert.match(html, /MAPA DE MÉRITOS/);
  assert.match(html, /Tu historia/);
  assert.match(html, /eventos especiales/);
  assert.match(html, /100<!-- --> <em>MIL<\/em>/);
  assert.match(html, /Jueves biker/);
  assert.match(html, /fortalecer la camaradería/);
  assert.match(html, /organizamos lo que viene/);
  assert.match(html, /Así rodamos/);
  assert.match(html, /FORMACIÓN ESCALONADA/);
  assert.match(html, /FILA INDIVIDUAL/);
  assert.match(html, /Herramienta básica/);
  assert.match(html, /Inflador/);
  assert.match(html, /Arrancador de batería/);
  assert.match(html, /12 segundos/);
  assert.match(html, /CERO ALCOHOL Y CERO SUSTANCIAS AL MANUBRIO/);
  assert.match(html, /Seguro de cobertura amplia y ficha privada actualizada/);
  assert.match(html, /Arango Riders Club/);
  assert.match(html, /instagram\.com\/arangoriders/);
  assert.match(html, /Klandestino Garage/);
  assert.match(html, /instagram\.com\/klandestino_garage/);
  assert.match(html, /La Disculpita/);
  assert.match(html, /Café El Jarocho/);
  assert.match(html, /División del Norte 2761/);
  assert.match(html, /Próxima meta/);
  assert.match(html, /9,790/);
  assert.match(html, /1,550<!-- --> km/);
  assert.match(html, /880<!-- --> km/);
  assert.match(html, /31<!-- --> rodadas/);
  assert.match(html, /IDA APROX\./);
  assert.match(html, /IDA Y VUELTA/);
  assert.match(html, /Restaurante La Antigua, Taxco/);
  assert.match(html, /Birria El Pomposo, Xochitepec/);
  assert.match(html, /La Mayordomía, Tlayacapan/);
  assert.match(html, /Por confirmar/);
  assert.match(html, /Cada año guarda/);
  assert.match(html, /La foto donde comenzó todo/);
  assert.match(html, /src="\/heritage\/fundadores-first-6\.jpg"/);
  assert.match(html, /Fotografía original de los primeros seis fundadores de Chilangos RC/);
  assert.doesNotMatch(html, /Fotografía original de los primeros seis, pendiente de digitalizar/);
  assert.match(html, /Portar el chaleco significa representar a Chilangos/);
  assert.match(html, /sus acciones también hablan por la familia/);
  assert.match(html, /No concede rango ni privilegios/);
  assert.match(html, /IDENTIDAD/);
  assert.match(html, /RESPETO/);
  assert.match(html, /COMPROMISO/);
  assert.match(html, /HERMANDAD/);
  assert.match(html, /motorcycle-gear-biker-style-history/);
  assert.match(html, /Cuatro aniversarios/);
  assert.match(html, /Primer aniversario/);
  assert.match(html, /src="\/anniversaries\/2025\/portada\.webp"/);
  assert.match(html, /class="anniversary-editorial-card"/);
  assert.match(html, /width="1536" height="1152"/);
  assert.match(html, /Tres años, una misma familia/);
  assert.match(html, /Parque Nacional La Marquesa · Estado de México/);
  assert.match(html, /Segundo aniversario/);
  assert.match(html, /Tercer aniversario/);
  assert.match(html, /Cuarto aniversario/);
  assert.match(html, /Fecha y sede por confirmar/);
  assert.match(html, /Portada original pendiente de incorporar/);
  assert.match(html, /ARCHIVO CHILANGO/);
  assert.match(html, /Nuestras rodadas/);
  assert.match(html, /Año por año/);
  assert.match(html, /Selecciona un año para consultar las salidas documentadas/);
  assert.doesNotMatch(html, /class="featured-route-grid"/);
  assert.match(html, /Los lugares que ya rodamos/);
  assert.match(html, /Pueblos Mágicos/);
  assert.match(html, /177/);
  assert.match(html, /Rodadas realizadas/);
  assert.match(html, /La línea naranja punteada/);
  assert.match(html, /caminos por descubrir/);
  assert.doesNotMatch(html, /destinos por descubrir/);
  assert.match(html, /garage Chilango/);
  assert.match(html, /Ocho revisiones que sí aportan/);
  assert.match(html, /Llantas y presión/);
  assert.match(html, /Aceite y filtro/);
  assert.match(html, /Bujías y cables/);
  assert.match(html, /Frenos/);
  assert.match(html, /Batería/);
  assert.match(html, /Correa, chasis y suspensión/);
  assert.match(html, /Tu manual tiene la última palabra/);
  assert.match(html, /href="\/seguridad-en-ruta"/);
  assert.match(html, /Talleres mecánicos/);
  assert.match(html, /Restaurantes y cafeterías/);
  assert.match(html, /Milwaukee Tlx Biker Bar/);
  assert.match(html, /Panotla, Tlaxcala/);
  assert.match(html, /instagram\.com\/milwaukee\.tlx/);
  assert.match(html, /Instagram · (?:<!-- -->)?@milwaukee\.tlx/);
  assert.match(html, /src="\/partners\/milwaukee-chilangos\.webp"/);
  assert.match(html, /Iron Choppers/);
  assert.match(html, /Barrio 18, Xochimilco/);
  assert.match(html, /instagram\.com\/chopperscycles/);
  assert.match(html, /Instagram · (?:<!-- -->)?@chopperscycles/);
  assert.match(html, /Cómo llegar/);
  assert.match(html, /LUGAR CON CONVENIO/);
  assert.match(html, /Restaurante Bar El Patrón/);
  assert.match(html, /instagram\.com\/elpatron\.ryb/);
  assert.match(html, /Instagram · (?:<!-- -->)?@elpatron\.ryb/);
  assert.match(html, /Un nuevo punto biker en CDMX/);
  assert.match(html, /Propón una colaboración/);
  assert.match(html, /¿Quieres recibir/);
  assert.match(html, /Nombre de tu negocio/);
  assert.match(html, /WhatsApp de contacto/);
  assert.match(html, /Cuéntanos tu propuesta/);
  assert.match(html, /Enviar propuesta a Chilangos RC/);
  assert.match(html, /Todo lo que todavía nos llama/);
  assert.match(html, /El Fashion Biker/);
  assert.match(html, /LAS CATEGORÍAS DE LA NOCHE/);
  assert.match(html, /Una noche para reconocer con humor/);
  assert.match(html, /No representan jerarquías ni una competencia/);
  assert.doesNotMatch(html, /chilangos-awards-statuette/);
  assert.match(html, /Comunicados/);
  assert.match(html, /Conclusión de membresía · Rodas/);
  assert.match(html, /Conclusión de membresía · Pituko/);
  assert.match(html, /Conclusión de membresía · Yisus/);
  assert.match(html, /Conclusión de membresía · Guicho/);
  assert.match(html, /CRC-COM-2025-002/);
  assert.match(html, /2025-09-09-rodas\.webp/);
  assert.match(html, /Ver comunicado/);
  const partnersPosition = html.indexOf('id="aliados"');
  const noticesPosition = html.indexOf('id="comunicados"');
  const shopPosition = html.indexOf('id="tienda"');
  assert(partnersPosition > 0 && noticesPosition > partnersPosition && shopPosition > noticesPosition);
  assert.match(html, /Playera oficial/);
  assert.match(html, /chilangos-logo-original\.jpg/);
  assert.match(html, /Preguntar por WhatsApp/);
  assert.match(html, /Escríbenos por WhatsApp/);
  assert.match(html, /PRÓXIMA RODADA/);
  assert.match(html, /Fecha por confirmar/);
  assert.doesNotMatch(html, /Punto de reunión ↗/);
  assert.doesNotMatch(html, /Ver destino ↗/);
  assert.match(html, /wa\.me\/525572718912/);
  assert.match(html, /Sitio desarrollado por/);
  assert.match(html, /sosializarte\.com/);
  assert.match(html, /SportsOrganization/);
  assert.match(html, /50/);
  assert.match(html, /og\.png/);
  assert.match(html, /instagram\.com\/chilangosrc/);
  assert.match(html, /facebook\.com\/chilangosrcmexico/);
  assert.match(html, /Instagram · @chilangosrc/);
  assert.match(html, /Facebook · Chilangos RC México/);
  assert.match(html, /href="\/cuestionario"/);
  assert.doesNotMatch(html, /Biker\/Teléfono|Afiliación IMSS|Contacto de Emergencia|Seguro\/Póliza/);
  assert.doesNotMatch(html, /dec[aá]logo/i);
  assert.match(html, /Conclusión de membresía · Pituko/);
});

test("el tablero biker muestra méritos personales sin inventar kilómetros", async () => {
  const html = await renderRoute("/sitio-completo");
  const meritSource = await readFile(new URL("../app/components/merit-leaderboard.tsx", import.meta.url), "utf8");
  const meritHistory = await readFile(new URL("../app/data/merit-history.ts", import.meta.url), "utf8");

  assert.match(html, /HONOR EN CADA KILÓMETRO/);
  assert.match(html, /Los kilómetros/);
  assert.match(html, /también se llevan puestos/);
  assert.match(html, /11<\/strong><span>bikers activos en la familia/);
  assert.match(html, /11<\/strong><span>odómetros registrados/);
  assert.match(html, /22<\/strong><span>méritos alcanzados/);
  assert.match(html, /20<\/strong><span>parches entregados/);
  assert.match(html, /odómetros registrados/);
  assert.match(html, /méritos alcanzados/);
  assert.match(html, /parches entregados/);
  assert.match(html, /5K/);
  assert.match(html, /10K/);
  assert.match(html, /25K/);
  assert.match(html, /50K/);
  assert.match(html, /100K/);
  assert.match(html, /24,723/);
  assert.match(html, /30,153/);
  assert.doesNotMatch(html, /8,047/);
  assert.match(html, /LECTURA PENDIENTE/);
  assert.match(html, /SIN ACTIVIDAD/);
  assert.match(html, /Fer Fucho/);
  assert.match(html, /Gi/);
  assert.match(html, /Adri(?:<!-- -->)? · (?:<!-- -->)?Fátima/);
  assert.match(html, /No son rangos ni una competencia/);
  assert.match(html, /href="#meritos"/);
  assert.match(meritSource, /className="merit-rider-scale"/);
  assert.match(meritSource, /Metas de \$\{profile\.alias\}/);
  assert.match(meritHistory, /"ronnie-roadster", "Roadster", 908, 25_631, "km"/);
  assert.match(meritHistory, /"seb-sportster-1200", "Sportster 1200", 4_000, 22_736, "mi"/);
  assert.match(meritHistory, /"isra-ultra-clasic", "Ultra Clasic", 35_635, 40_635, "km"/);
  assert.doesNotMatch(meritSource, /merit-wall-scale/);
  assert.doesNotMatch(meritSource, /merit-prospect-section/);
});

test("la identidad usa el lema del club, evita numeraciones decorativas y reconoce el origen de WhatsApp", async () => {
  const html = await renderRoute("/sitio-completo");

  assert.match(html, /Juntos vamos, juntos regresamos\./);
  assert.match(html, /<p>Juntos vamos\.<\/p><p><em>Juntos regresamos\.<\/em><\/p>/);
  assert.match(html, /class="[^"]*next-ride-poster[^"]*"/);
  assert.match(html, /El siguiente destino está por escribirse/);
  assert.doesNotMatch(html, /<p class="eyebrow(?: light)?">\d{2}\s*·/);
  assert.doesNotMatch(html, /Majuelos\s+142|Paseos del Sur/i);

  const links = [...html.matchAll(/https:\/\/wa\.me\/525572718912\?text=([^"<]+)/g)];
  assert(links.length >= 4);
  for (const link of links) {
    assert.match(decodeURIComponent(link[1]), /Te escribo desde la página web de Chilangos RC/i);
  }
});

test("la fotografía original de los fundadores se publica sin metadatos EXIF", async () => {
  const photograph = await readFile(new URL("../public/heritage/fundadores-first-6.jpg", import.meta.url));

  assert.equal(photograph[0], 0xff);
  assert.equal(photograph[1], 0xd8);
  assert(photograph.length > 100000);
  assert.equal(photograph.includes(Buffer.from("Exif\u0000\u0000", "binary")), false);
});

test("la fotografía de fundadores conserva su proporción y las tarjetas evitan cintillos repetidos", async () => {
  const [styles, home, directory, patches, anniversaries] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/club-home.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/member-directory.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/patch-milestones.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/anniversary-gallery.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(styles, /\.heritage-frame-origin \{[^}]*width: min\(100%, 828px\)[^}]*min-height: 0/);
  assert.match(styles, /\.heritage-frame-origin > img \{[^}]*width: 100%[^}]*height: auto/);
  const cards = [home, directory, patches, anniversaries].join("\n");
  for (const label of ["ASÍ RODAMOS", "FAMILIA CHILANGA", "JUEVES ENTRE CHILANGOS", "MÉRITO CHILANGO", "CELEBRACIÓN CHILANGA"]) {
    assert.doesNotMatch(cards, new RegExp(label));
  }
  assert.equal((home.match(/CAMINO AL FULL PATCH/g) ?? []).length, 0);
});

test("las miniaturas de integrantes conservan el retrato vertical sin perder nitidez", async () => {
  const [styles, directory, profiles, sebThumbnail, ronnieThumbnail, ruloThumbnail, rafaThumbnail] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/components/member-directory.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/biker-profiles.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/portraits/seb-card-v2.webp", import.meta.url)),
    readFile(new URL("../public/portraits/ronnie-card.webp", import.meta.url)),
    readFile(new URL("../public/portraits/rulo-card.webp", import.meta.url)),
    readFile(new URL("../public/portraits/rafa-card.webp", import.meta.url)),
  ]);

  assert.match(styles, /\.biker-portrait-frame \{[^}]*aspect-ratio: 4 \/ 5[^}]*overflow: hidden/);
  assert.match(styles, /\.biker-portrait-frame > img \{[^}]*height: 100%[^}]*object-position: center top[^}]*image-rendering: auto/);
  assert.doesNotMatch(styles, /\.biker-portrait-frame > img \{[^}]*filter:/);
  assert.match(directory, /profile\.thumbnail \?\? profile\.portrait/);
  assert.match(directory, /width=\{640\} height=\{800\}/);
  assert.match(profiles, /thumbnail: "\/portraits\/seb-card-v2\.webp"/);
  assert.match(profiles, /thumbnail: "\/portraits\/ronnie-card\.webp"/);
  assert.match(profiles, /thumbnail: "\/portraits\/rulo-card\.webp"/);
  assert.match(profiles, /thumbnail: "\/portraits\/rafa-card\.webp"/);
  assert(sebThumbnail.length > 25000);
  assert(ronnieThumbnail.length > 40000);
  assert(ruloThumbnail.length > 30000);
  assert(rafaThumbnail.length > 30000);
});

test("el calendario muestra los quince cumpleaños sin divulgar años de nacimiento", async () => {
  const html = await renderRoute("/sitio-completo");

  assert.match(html, /Calendario de la hermandad/);
  assert.match(html, /Las fechas que/);
  assert.match(html, /LA PRÓXIMA CELEBRACIÓN DE LA BANDA/);
  assert.match(html, /Agregar a Google Calendar/);
  assert.match(html, /calendar\.google\.com\/calendar\/render\?action=TEMPLATE/);
  assert.match(html, /recur=RRULE%3AFREQ%3DYEARLY/);

  for (const month of ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]) {
    assert.match(html, new RegExp(`<h3>${month}</h3>`));
  }

  for (const alias of ["Adri", "Gi", "Fátima", "Ángel", "Rafa", "Charly", "Inra", "Fer", "Seb", "Richard", "Mac", "Austria", "Ronnie", "Alej", "Rulo"]) {
    assert.match(html, new RegExp(`Agregar el cumpleaños de ${alias} a Google Calendar`));
  }

  assert.doesNotMatch(html, /03\/01\/1985|06\/01\/2000|31\/01\/1988|30\/08\/1975/);
  assert.match(html, /sin publicar edades ni años de nacimiento/);
});

test("el mapa separa las rodadas del pasaporte nacional y traza la ruta desde CDMX", async () => {
  const html = await renderRoute("/sitio-completo");
  const mapSource = await readFile(new URL("../app/components/mexico-magic-map.tsx", import.meta.url), "utf8");
  const styleSource = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(html, /Mapa de carretera/);
  assert.match(html, /Rodadas realizadas/);
  assert.match(html, /177 Pueblos Mágicos/);
  assert.match(html, /DESTINO SELECCIONADO/);
  assert.match(html, /Val’Quirico/);
  assert.match(html, /La ruta naranja se calcula sobre carreteras disponibles/);
  assert.doesNotMatch(html, /Este explorador sirve para proponer y comparar destinos/);
  assert.match(mapSource, /fetchRoadRoute/);
  assert.match(mapSource, /router\.project-osrm\.org\/route\/v1\/driving/);
  assert.match(mapSource, /leaflet\.polyline\(roadRoute/);
  assert.doesNotMatch(mapSource, /leaflet\.polyline\(\[cdmx, selected\.coordinate\]/);
  assert.match(mapSource, /dashArray: "9 11"/);
  assert.match(mapSource, /visited-skull-icon/);
  assert.match(styleSource, /chilangos-skull\.webp/);
  assert.match(mapSource, /pueblosMagicos\.forEach/);
});

test("la bitácora incluye únicamente rodadas confirmadas y actualiza los kilómetros de 2025 y 2026", async () => {
  const source = await readFile(new URL("../app/data/chilangos.ts", import.meta.url), "utf8");
  const matches = Array.from(source.matchAll(/date: "(\d{4})-[^"]+"[^\n]*oneWayKm: (\d+), roundTripKm: (\d+)/g));
  const yearly = new Map();

  for (const [, year, oneWay, roundTrip] of matches) {
    const record = yearly.get(year) ?? { rides: 0, kilometers: 0 };
    assert.equal(Number(roundTrip), Number(oneWay) * 2);
    record.rides += 1;
    record.kilometers += Number(roundTrip);
    yearly.set(year, record);
  }

  assert.equal(matches.length, 31);
  assert.deepEqual(yearly.get("2025"), { rides: 6, kilometers: 1550 });
  assert.deepEqual(yearly.get("2026"), { rides: 4, kilometers: 880 });
  assert.match(source, /dataThrough: "2026-08-16"/);
  assert.match(source, /Cecina Romi, Yecapixtla", state: "Morelos", oneWayKm: 100/);
  assert.match(source, /Valle del Potrero, La Marquesa", state: "Estado de México", oneWayKm: 50/);
  assert.match(source, /Restaurante La Antigua, Taxco", state: "Guerrero", oneWayKm: 185/);
  assert.match(source, /La Mayordomía, Tlayacapan", state: "Morelos", oneWayKm: 85/);
  assert.doesNotMatch(source, /1900-01-16/);
});

test("la portada prioriza el nombre del club y evita logotipos de fondo forzados", async () => {
  const home = await readFile(new URL("../app/components/club-home.tsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const font = await readFile(new URL("../public/fonts/DejaVuSerif-Bold.ttf", import.meta.url));

  assert.match(home, /<h1 className="hero-club-title"><span>CHILANGOS<\/span> <strong>RC<\/strong><\/h1>/);
  assert.doesNotMatch(home, /section-logo-watermark|hero-logo-watermark|thursday-logo-watermark/);
  assert.match(styles, /font-family: "Chilangos Western"/);
  assert.match(styles, /\.hero \{[^\n]*background: #080808/);
  assert.match(styles, /\.topbar \{[^\n]*display: grid/);
  assert.match(styles, /\.desktop-nav \{[^\n]*justify-content: center/);
  assert(font.length > 10000);
});

test("las colaboraciones se guardan de forma privada sin publicar datos de contacto", async () => {
  const hosting = JSON.parse(await readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"));
  const schema = await readFile(new URL("../db/schema.ts", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/api/colaboraciones/route.ts", import.meta.url), "utf8");

  assert.equal(hosting.d1, "DB");
  assert.match(schema, /collaboration_requests/);
  assert.match(schema, /contact_name/);
  assert.match(schema, /business_name/);
  assert.match(route, /export async function POST/);
  assert.doesNotMatch(route, /export async function GET/);
  assert.match(route, /crypto\.randomUUID/);
});

test("el formulario valida y guarda las propuestas de colaboración", async () => {
  const savedQueries = [];
  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(statement) {
      return {
        bind(...values) {
          return {
            async run() {
              savedQueries.push({ statement, values });
              return { success: true, meta: { changes: 1 } };
            },
          };
        },
      };
    },
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-collaborations`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  const invalid = await worker.fetch(new Request("http://localhost/api/colaboraciones", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contactName: "Alex" }),
  }), runtime, execution);
  assert.equal(invalid.status, 400);

  const valid = await worker.fetch(new Request("http://localhost/api/colaboraciones", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contactName: "Alex",
      businessName: "Garage de prueba",
      businessType: "Taller o agencia",
      location: "Ciudad de México",
      email: "prueba@example.com",
      proposal: "Nos gustaría recibir al club y conversar sobre una colaboración.",
    }),
  }), runtime, execution);

  assert.equal(valid.status, 201);
  assert.deepEqual(await valid.json(), { received: true });
  assert.equal(savedQueries.length, 1);
  assert.match(savedQueries[0].statement, /insert into "collaboration_requests"/i);
  assert(savedQueries[0].values.includes("Garage de prueba"));

  delete globalThis.__chilangosTestCloudflareEnv.DB;
});

test("el padrón reconoce siete fundadores, siete integrantes y dos prospectos", async () => {
  const roster = await readFile(new URL("../app/data/chilangos.ts", import.meta.url), "utf8");
  const culture = await readFile(new URL("../app/data/club-culture.ts", import.meta.url), "utf8");
  const profiles = await readFile(new URL("../app/data/biker-profiles.ts", import.meta.url), "utf8");

  assert.match(roster, /name: "Adri", motorcycle: "Desde la primera rodada", role: "Fundadora"/);
  assert.match(roster, /export const prospects = \["Fer Fucho", "Gi"\]/);
  assert.match(roster, /export const membershipKilometers = 5000/);
  assert.match(roster, /\[5000, 10000, 25000, 50000, 100000\]/);
  assert.doesNotMatch(roster, /Pituko|"Rodas"/);
  assert.match(roster, /"Fátima"/);
  assert.doesNotMatch(roster, /name: "Gi", motorcycle:/);
  assert.match(profiles, /slug: "adri", alias: "Adri", founder: true, partner: true/);
  assert.match(profiles, /slug: "fatima", alias: "Fátima", founder: false, partner: true/);
  assert.match(profiles, /slug: "richard", alias: "Richard", founder: false, partner: false, sponsor: null/);
  assert.match(profiles, /slug: "gi"[\s\S]*prospect: true[\s\S]*sponsor: "Fer"[\s\S]*model: "Sportster 883"/);
  assert.match(profiles, /slug: "fer-fucho", alias: "Fer Fucho", founder: false, partner: false, prospect: true, sponsor: "Austria"/);
  assert.match(culture, /Los 5,000 kilómetros de ingreso deben compartirse/);
  assert.match(culture, /No operamos con presidentes, sargentos de armas ni jerarquías/);
  assert.doesNotMatch(culture, /dec[aá]logo/i);
});

test("las biografías tienen metadatos propios, garage y perfiles activos de prospectos", async () => {
  const ronnie = await renderRoute("/integrantes/ronnie");
  const adri = await renderRoute("/integrantes/adri");
  const fatima = await renderRoute("/integrantes/fatima");
  const richard = await renderRoute("/integrantes/richard");
  const seb = await renderRoute("/integrantes/seb");
  const rulo = await renderRoute("/integrantes/rulo");
  const rafa = await renderRoute("/integrantes/rafa");
  const gi = await renderRoute("/integrantes/gi");
  const ferFucho = await renderRoute("/integrantes/fer-fucho");

  assert.match(ronnie, /<title>Ronnie \| Chilangos RC<\/title>/);
  assert.match(ronnie, /property="og:title" content="Ronnie \| Chilangos RC"/);
  assert.match(ronnie, /name="twitter:title" content="Ronnie \| Chilangos RC"/);
  assert.match(ronnie, /Harley-Davidson<!-- --> <!-- -->Roadster/);
  assert.match(ronnie, /Las motos que/);
  assert.match(ronnie, /Dato opcional/);
  assert.match(ronnie, /PROFESIÓN/);
  assert.match(ronnie, /Por compartir/);
  assert.match(ronnie, /property="og:image" content="https:\/\/chilangosrc\.com\/portraits\/ronnie-studio\.webp"/);
  assert.match(ronnie, /src="\/portraits\/ronnie-studio\.webp"/);
  assert.doesNotMatch(ronnie, /nombre completo|domicilio|teléfono|fecha de nacimiento/i);
  assert.doesNotMatch(ronnie, /padrino/i);

  assert.match(adri, /<title>Adri \| Chilangos RC<\/title>/);
  assert.match(adri, /Fundadora · Partner/);
  assert.match(adri, /Acompañar también es rodar/);
  assert.match(adri, /Partner de(?:<!-- -->)?\s*Rafa/);
  assert.doesNotMatch(adri, /Harley-Davidson/);

  assert.match(fatima, /<title>Fátima \| Chilangos RC<\/title>/);
  assert.match(fatima, /Miembro · Partner/);
  assert.match(fatima, /Partner de(?:<!-- -->)?\s*Austria/);
  assert.doesNotMatch(fatima, /Harley-Davidson/);
  assert.match(richard, /<title>Richard \| Chilangos RC<\/title>/);
  assert.doesNotMatch(richard, /padrino/i);

  assert.match(seb, /<title>Seb \| Chilangos RC<\/title>/);
  assert.match(seb, /Supervisor/);
  assert.match(seb, /30 años/);
  assert.match(seb, /diciembre de 2023/);
  assert.match(seb, /Sportster Low XL 1200/);
  assert.match(seb, /Megan/);
  assert.match(seb, /Chachalacas, Veracruz/);
  assert.match(seb, /Canadá/);
  assert.match(seb, /Videojuegos/);
  assert.match(seb, /Rey del choque/);
  assert.match(seb, /CHILANGOS AWARDS · (?:<!-- -->)?2024/);
  assert.match(seb, /property="og:image" content="https:\/\/chilangosrc\.com\/portraits\/seb-studio-v2\.webp"/);
  assert.match(seb, /src="\/portraits\/seb-studio-v2\.webp"/);
  assert.doesNotMatch(seb, /nombre completo|domicilio|teléfono|fecha de nacimiento/i);

  assert.match(rulo, /<title>Rulo \| Chilangos RC<\/title>/);
  assert.match(rulo, /property="og:image" content="https:\/\/chilangosrc\.com\/portraits\/rulo-studio\.webp"/);
  assert.match(rulo, /src="\/portraits\/rulo-studio\.webp"/);

  assert.match(rafa, /<title>Rafa \| Chilangos RC<\/title>/);
  assert.match(rafa, /property="og:image" content="https:\/\/chilangosrc\.com\/portraits\/rafa-studio\.webp"/);
  assert.match(rafa, /src="\/portraits\/rafa-studio\.webp"/);

  assert.match(gi, /<title>Gi \| Chilangos RC<\/title>/);
  assert.match(gi, /Prospecto activo/);
  assert.match(gi, /Sportster 883/);
  assert.match(gi, /APADRINADO POR/);
  assert.match(ferFucho, /<title>Fer Fucho \| Chilangos RC<\/title>/);
  assert.match(ferFucho, /En camino al full patch/);
});

test("el sitio enlaza los catorce perfiles oficiales y las dos biografías de prospectos", async () => {
  const html = await renderRoute("/sitio-completo");
  const slugs = new Set(Array.from(html.matchAll(/href="\/integrantes\/([^"?#]+)"/g), (match) => match[1]));

  assert.equal(slugs.size, 16);
  assert(slugs.has("ronnie"));
  assert(slugs.has("fatima"));
  assert(slugs.has("richard"));
  assert(slugs.has("gi"));
  assert(slugs.has("fer-fucho"));
});

test("los álbumes usan una portada local y enlazan la colección completa sin cargarla en la página", async () => {
  const [yearArchive, anniversaries, data] = await Promise.all([
    readFile(new URL("../app/components/year-archive.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/anniversary-gallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/club-life.ts", import.meta.url), "utf8"),
  ]);

  assert.match(data, /facebookUrl\?: string \| null/);
  assert.match(yearArchive, /const cover = current\?\.photos\[0\]/);
  assert.match(yearArchive, /Ver álbum completo en Facebook/);
  assert.doesNotMatch(yearArchive, /current\.photos\.map/);
  assert.match(anniversaries, /const cover = current\?\.photos\[0\]/);
  assert.match(anniversaries, /Ver álbum completo en Facebook/);
  assert.doesNotMatch(anniversaries, /current\.photos\.map/);
});

test("renderiza las 56 preguntas biker con autorización individual y privacidad", async () => {
  const html = await renderRoute("/cuestionario");

  assert.match(html, /<title>Tu historia biker \| Chilangos RC<\/title>/);
  assert.match(html, /Debajo del casco/);
  assert.match(html, /56<!-- --> preguntas para elegir/);
  assert.match(html, /primer recuerdo que tienes relacionado con una motocicleta/);
  assert.match(html, /marcas de motocicletas admiras/);
  assert.match(html, /filosofía de vida biker/);
  assert.match(html, /Autorizo incluir esta respuesta en mi perfil público/);
  assert.match(html, /Solo para conocerme dentro de Chilangos RC/);
  assert.match(html, /Copiar solo perfil público/);
  assert.match(html, /guardan únicamente en este navegador/);
  assert.match(html, /instagram\.com\/chilangosrc/);
  assert.match(html, /facebook\.com\/chilangosrcmexico/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /<input[^>]+type="(?:email|tel|date|file)"/i);
});

test("el cuestionario interno acepta biografía y fotografías sin indexarse", async () => {
  const html = await renderRoute("/cuestionario-integrantes");

  assert.match(html, /<title>Cuestionario interno \| Chilangos RC<\/title>/);
  assert.match(html, /name="robots" content="[^"]*noindex/i);
  assert.match(html, /ENTRE CHILANGOS/);
  assert.match(html, /¡Hola, Chilango!/);
  assert.match(html, /Queremos conocer tu historia/);
  assert.match(html, /name="alias"/);
  assert.match(html, /name="profesion"/);
  assert.match(html, /Profesión u oficio/);
  assert.match(html, /name="biografia"/);
  assert.match(html, /name="foto"/);
  assert.match(html, /name="fotoMoto"/);
  assert.match(html, /¿Quién te apadrinó\?/);
  assert.match(html, /Partner: acompaño y comparto la rodada/);
  assert.match(html, /hasta diez motocicletas anteriores/);
  assert.match(html, /name="motoAnteriorMarca0"/);
  assert.match(html, /name="motoAnteriorModelo0"/);
  assert.match(html, /name="motoAnteriorFoto0"/);
  assert.match(html, /name="odometroActual"/);
  assert.match(html, /Película biker/);
  assert.match(html, /Terminator 2/);
  assert.match(html, /Sons of Anarchy/);
  assert.match(html, /moto que no cambiarías por nada/i);
  assert.match(html, /CHILANGOS AWARDS/);
  assert.match(html, /name="avisoPrivacidad"/);
  assert.match(html, /name="autorizacionPerfilWeb"/);
  assert.match(html, /name="autorizacionFotosWeb"/);
  assert.match(html, /name="autorizacionRedesSociales"/);
  assert.match(html, /href="\/aviso-de-privacidad"/);
  assert.match(html, /panel privado de administración/);
  assert.match(html, /nada se publica automáticamente/i);
});

test("el formulario interno guarda respuestas y fotografías de forma privada", async () => {
  const savedQueries = [];
  const uploadedFiles = [];
  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(statement) {
      return {
        bind(...values) {
          return {
            async run() {
              savedQueries.push({ statement, values });
              return { success: true, meta: { changes: 1 } };
            },
          };
        },
      };
    },
  };
  globalThis.__chilangosTestCloudflareEnv.BUCKET = {
    async put(key, bytes, options) {
      uploadedFiles.push({ key, bytes, options });
    },
    async delete() {},
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-member-questionnaire`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  const invalid = await worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
    method: "POST",
    body: new FormData(),
  }), runtime, execution);
  assert.equal(invalid.status, 400);

  const form = new FormData();
  form.set("alias", "Ronnie");
  form.set("profesion", "Empresario y comunicador");
  form.set("biografia", "Fundador y motociclista de Chilangos RC.");
  setQuestionnairePrivacy(form);
  form.set("tipoIntegrante", "biker");
  form.set("motoAnteriorMarca0", "Harley-Davidson");
  form.set("motoAnteriorModelo0", "Sportster");
  form.set("motoAnteriorAnio0", "2012");
  form.set("motoAnteriorFoto0", new Blob(["foto-anterior"], { type: "image/jpeg" }), "sportster.jpg");
  form.set("premioCategoria0", "El Rodador");
  form.set("premioAnio0", "2024");
  form.set("peliculaFavorita", "Terminator 2");
  form.set("foto", new Blob(["imagen-de-prueba"], { type: "image/png" }), "perfil.png");

  const valid = await worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
    method: "POST",
    body: form,
  }), runtime, execution);

  assert.equal(valid.status, 201);
  assert.deepEqual(await valid.json(), { received: true });
  assert.equal(savedQueries.length, 1);
  assert.match(savedQueries[0].statement, /insert into "questionnaire_submissions"/i);
  assert(savedQueries[0].values.includes("Ronnie"));
  assert.equal(uploadedFiles.length, 2);
  assert.match(uploadedFiles[0].key, /^cuestionarios\/.+\/perfil\.png$/);
  assert.match(uploadedFiles[1].key, /^cuestionarios\/.+\/moto-anterior-01\.jpg$/);

  const storedAnswers = savedQueries[0].values.find((value) => typeof value === "string" && value.startsWith("{"));
  const parsed = JSON.parse(storedAnswers);
  assert.equal(parsed.previousMotorcycles.length, 1);
  assert.equal(parsed.profession, "Empresario y comunicador");
  assert.equal(parsed.previousMotorcycles[0].model, "Sportster");
  assert.deepEqual(parsed.awards, [{ title: "El Rodador", year: "2024", story: "" }]);
  assert.equal(parsed.bikerCulture.favoriteMovie, "Terminator 2");
  assert.equal(parsed.publicationConsent, "revisar-antes");
  assert.equal(parsed.privacyConsent.noticeVersion, "2026-08-27");
  assert.equal(parsed.privacyConsent.acknowledged, true);
  assert.equal(parsed.privacyConsent.profileWebsite, "si");
  assert.equal(parsed.privacyConsent.photosWebsite, "si");
  assert.equal(parsed.privacyConsent.socialMedia, "no");

  const partnerForm = new FormData();
  partnerForm.set("alias", "Fátima");
  partnerForm.set("tipoIntegrante", "partner");
  partnerForm.set("conQuienRuedas", "Austria");
  setQuestionnairePrivacy(partnerForm, { profile: "no", photos: "no", social: "no" });

  const partner = await worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
    method: "POST",
    body: partnerForm,
  }), runtime, execution);

  assert.equal(partner.status, 201);
  assert.equal(savedQueries.length, 2);
  const partnerAnswers = savedQueries[1].values.find((value) => typeof value === "string" && value.startsWith("{"));
  const parsedPartner = JSON.parse(partnerAnswers);
  assert.equal(parsedPartner.memberType, "partner");
  assert.equal(parsedPartner.ridesWith, "Austria");
  assert.deepEqual(parsedPartner.previousMotorcycles, []);
  assert.equal(parsedPartner.publicationConsent, "solo-interno");
  assert.equal(parsedPartner.privacyConsent.profileWebsite, "no");

  delete globalThis.__chilangosTestCloudflareEnv.DB;
  delete globalThis.__chilangosTestCloudflareEnv.BUCKET;
});

test("el correo avisa registros reales solo cuando existe un proveedor configurado", async () => {
  const originalFetch = globalThis.fetch;
  const deliveries = [];
  const savedQueries = [];

  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(statement) {
      return {
        bind(...values) {
          return {
            async run() {
              savedQueries.push({ statement, values });
              return { success: true, meta: { changes: 1 } };
            },
          };
        },
      };
    },
  };
  globalThis.__chilangosTestCloudflareEnv.RESEND_API_KEY = "test-key-not-real";
  globalThis.__chilangosTestCloudflareEnv.REGISTRATION_NOTIFICATION_TO = "founder@example.test";
  globalThis.__chilangosTestCloudflareEnv.REGISTRATION_NOTIFICATION_FROM = "Chilangos RC <avisos@example.test>";
  globalThis.fetch = async (url, options) => {
    deliveries.push({ url: String(url), payload: JSON.parse(options.body) });
    return Response.json({ id: "test-email" });
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-registration-email`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  async function submit(alias) {
    const form = new FormData();
    form.set("alias", alias);
    setQuestionnairePrivacy(form);
    return worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
      method: "POST",
      body: form,
    }), runtime, execution);
  }

  try {
    assert.equal((await submit("Rafa")).status, 201);
    assert.equal((await submit("QA_CHILANGOS_TEST")).status, 201);
    assert.equal(savedQueries.length, 2);
    assert.equal(deliveries.length, 1);
    assert.equal(deliveries[0].url, "https://api.resend.com/emails");
    assert.deepEqual(deliveries[0].payload.to, ["founder@example.test"]);
    assert.match(deliveries[0].payload.subject, /Nueva historia Chilanga: Rafa/);
    assert.match(deliveries[0].payload.text, /administracion\/cuestionarios/);
    assert.doesNotMatch(JSON.stringify(deliveries[0].payload), /QA_CHILANGOS_TEST/);
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.__chilangosTestCloudflareEnv.DB;
    delete globalThis.__chilangosTestCloudflareEnv.RESEND_API_KEY;
    delete globalThis.__chilangosTestCloudflareEnv.REGISTRATION_NOTIFICATION_TO;
    delete globalThis.__chilangosTestCloudflareEnv.REGISTRATION_NOTIFICATION_FROM;
  }
});

test("el registro es público mientras el sitio oficial y las biografías permanecen privados", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-public-registration`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  const officialHome = await worker.fetch(new Request("https://chilangosrc.com/", {
    headers: { accept: "text/html", host: "chilangosrc.com" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(officialHome.status));
  assert.match(officialHome.headers.get("location") ?? "", /signin-with-chatgpt/);

  const officialProfile = await worker.fetch(new Request("https://chilangosrc.com/integrantes/ronnie", {
    headers: { accept: "text/html", host: "chilangosrc.com" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(officialProfile.status));

  const stranger = await worker.fetch(new Request("https://chilangosrc.com/", {
    headers: {
      accept: "text/html",
      host: "chilangosrc.com",
      "oai-authenticated-user-email": "otra-persona@example.com",
    },
  }), runtime, execution);
  assert.equal(stranger.status, 404);

  const registration = await worker.fetch(new Request("https://registro.chilangosrc.com/", {
    headers: { accept: "text/html", host: "registro.chilangosrc.com" },
  }), runtime, execution);
  assert.equal(registration.status, 200);
  const registrationHtml = await registration.text();
  assert.match(registrationHtml, /Nuestra historia está por arrancar/);
  assert.doesNotMatch(registrationHtml, /Escribir mi historia/);
  assert.match(registrationHtml, /Quiero contar mi historia/);
  assert.match(registrationHtml, /name="robots" content="[^"]*noindex/i);
  assert.match(registrationHtml, /https:\/\/registro\.chilangosrc\.com/);
  assert.doesNotMatch(registrationHtml, /href="https:\/\/[^\"]*chatgpt\.site/i);

  const publicQuestionnaire = await worker.fetch(new Request("https://registro.chilangosrc.com/cuestionario-integrantes", {
    headers: { accept: "text/html", host: "registro.chilangosrc.com" },
  }), runtime, execution);
  assert.equal(publicQuestionnaire.status, 200);
  assert.match(await publicQuestionnaire.text(), /¡Hola, Chilango!/);

  const ownerHome = await worker.fetch(new Request("https://chilangosrc.com/", {
    headers: {
      accept: "text/html",
      host: "chilangosrc.com",
      "oai-authenticated-user-email": "ronaldzunig@gmail.com",
    },
  }), runtime, execution);
  assert.equal(ownerHome.status, 200);
  assert.match(await ownerHome.text(), /Fundadores, miembros/);

  const protectedOfficialForm = await worker.fetch(new Request("https://chilangosrc.com/cuestionario-integrantes", {
    headers: { accept: "text/html", host: "chilangosrc.com" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(protectedOfficialForm.status));
});

test("el panel y las fotografías privadas requieren la cuenta propietaria", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-admin-access`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  const anonymousFullSite = await worker.fetch(new Request("http://localhost/sitio-completo", {
    headers: { accept: "text/html" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(anonymousFullSite.status));
  assert.match(anonymousFullSite.headers.get("location") ?? "", /signin-with-chatgpt/);

  const anonymousPanel = await worker.fetch(new Request("http://localhost/administracion/cuestionarios", {
    headers: { accept: "text/html" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(anonymousPanel.status));
  assert.match(anonymousPanel.headers.get("location") ?? "", /signin-with-chatgpt/);

  const anonymousSafetyPanel = await worker.fetch(new Request("http://localhost/administracion/seguridad", {
    headers: { accept: "text/html" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(anonymousSafetyPanel.status));
  assert.match(anonymousSafetyPanel.headers.get("location") ?? "", /signin-with-chatgpt/);

  const anonymousQaPanel = await worker.fetch(new Request("http://localhost/administracion/pruebas", {
    headers: { accept: "text/html" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(anonymousQaPanel.status));
  assert.match(anonymousQaPanel.headers.get("location") ?? "", /signin-with-chatgpt/);

  const anonymousMeritsPanel = await worker.fetch(new Request("http://localhost/administracion/meritos", {
    headers: { accept: "text/html" },
  }), runtime, execution);
  assert([302, 303, 307, 308].includes(anonymousMeritsPanel.status));
  assert.match(anonymousMeritsPanel.headers.get("location") ?? "", /signin-with-chatgpt/);

  const anonymousRegistrationFeed = await worker.fetch(new Request("http://localhost/api/administracion/registros"), runtime, execution);
  assert.equal(anonymousRegistrationFeed.status, 401);

  const strangerRegistrationFeed = await worker.fetch(new Request("http://localhost/api/administracion/registros", {
    headers: { "oai-authenticated-user-email": "otra-persona@example.com" },
  }), runtime, execution);
  assert.equal(strangerRegistrationFeed.status, 403);

  const anonymousMeritUpdate = await worker.fetch(new Request("http://localhost/api/administracion/meritos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ memberSlug: "ronnie", odometerKm: 5000, awardedMilestones: [5000] }),
  }), runtime, execution);
  assert.equal(anonymousMeritUpdate.status, 401);

  const anonymousPhoto = await worker.fetch(new Request("http://localhost/api/administracion/foto?registro=x&archivo=y"), runtime, execution);
  assert.equal(anonymousPhoto.status, 401);

  const strangerPhoto = await worker.fetch(new Request("http://localhost/api/administracion/foto?registro=x&archivo=y", {
    headers: { "oai-authenticated-user-email": "otra-persona@example.com" },
  }), runtime, execution);
  assert.equal(strangerPhoto.status, 403);

  const anonymousCleanup = await worker.fetch(new Request("http://localhost/api/administracion/pruebas", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ runId: "TEST123" }),
  }), runtime, execution);
  assert.equal(anonymousCleanup.status, 401);
});

test("el seguimiento identifica registros reales y el tablero conserva méritos privados", async () => {
  const database = new DatabaseSync(":memory:");
  const migrations = [
    "0000_natural_tony_stark.sql",
    "0001_wonderful_skreet.sql",
    "0002_strange_tenebrous.sql",
    "0003_old_liz_osborn.sql",
    "0004_many_molten_man.sql",
  ];

  for (const migration of migrations) {
    database.exec(await readFile(new URL(`../drizzle/${migration}`, import.meta.url), "utf8"));
  }

  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(sql) {
      return {
        bind(...values) {
          const statement = database.prepare(sql);
          return {
            async run() {
              const result = statement.run(...values);
              return { success: true, meta: { changes: Number(result.changes) } };
            },
            async all() {
              return { results: statement.all(...values), success: true };
            },
            async raw() {
              return statement.all(...values).map((row) => Object.values(row));
            },
          };
        },
      };
    },
  };

  database.prepare("insert into questionnaire_submissions (id, alias, answers_json) values (?, ?, ?)").run(
    "real-ronnie",
    "Ronnie",
    JSON.stringify({ memberType: "biker", publicationConsent: "revisar-antes" }),
  );
  database.prepare("insert into questionnaire_submissions (id, alias, answers_json) values (?, ?, ?)").run(
    "real-fatima",
    "Fatima",
    JSON.stringify({ memberType: "partner", publicationConsent: "solo-interno" }),
  );
  database.prepare("insert into questionnaire_submissions (id, alias, answers_json) values (?, ?, ?)").run(
    "dummy",
    "QA_CHILANGOS_TEST_DUMMY",
    "{}",
  );

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-registration-merits`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  async function ownerFetch(path, init = {}) {
    const headers = new Headers(init.headers);
    headers.set("host", "registro.chilangosrc.com");
    headers.set("oai-authenticated-user-email", "ronaldzunig@gmail.com");
    headers.set("accept", "text/html,application/json");
    return worker.fetch(new Request(`http://localhost${path}`, { ...init, headers }), runtime, execution);
  }

  try {
    const registrationFeed = await ownerFetch("/api/administracion/registros");
    assert.equal(registrationFeed.status, 200);
    const feed = await registrationFeed.json();
    assert.equal(feed.total, 2);
    assert.deepEqual(feed.items.map(({ alias }) => alias).sort(), ["Fatima", "Ronnie"]);
    assert.doesNotMatch(JSON.stringify(feed), /QA_CHILANGOS_TEST_DUMMY/);
    assert.match(registrationFeed.headers.get("cache-control") ?? "", /private, no-store/);

    const historyPanel = await ownerFetch("/administracion/cuestionarios");
    const historyHtml = await historyPanel.text();
    assert.equal(historyPanel.status, 200);
    assert.match(historyHtml, /¿Quién ya contó su historia\?/);
    assert.match(historyHtml, /2<\/strong><span>ya compartieron su historia/);
    assert.match(historyHtml, /14<\/strong><span>todavía están pendientes/);
    assert.match(historyHtml, /Fátima/);
    assert.match(historyHtml, /Activar avisos de nuevos registros/);

    const invalidPartner = await ownerFetch("/api/administracion/meritos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberSlug: "fatima", odometerKm: 5000, awardedMilestones: [5000] }),
    });
    assert.equal(invalidPartner.status, 400);

    const invalidPatch = await ownerFetch("/api/administracion/meritos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ memberSlug: "gi", odometerKm: 5000, membershipStatus: "prospect", awardedMilestones: [5000] }),
    });
    assert.equal(invalidPatch.status, 400);

    const saved = await ownerFetch("/api/administracion/meritos", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        memberSlug: "ronnie",
        odometerKm: 12800,
        awardedMilestones: [5000, 10000],
        notes: "Esta nota sensible debe permanecer privada",
      }),
    });
    assert.equal(saved.status, 200);
    const savedRecord = await saved.json();
    assert.deepEqual(savedRecord.record.awardedMilestones, [5000, 10000]);
    assert.equal(database.prepare("select odometer_km from member_mileage_records where member_slug = ?").get("ronnie").odometer_km, 12800);

    const meritsPanel = await ownerFetch("/administracion/meritos");
    const meritsHtml = await meritsPanel.text();
    assert.equal(meritsPanel.status, 200);
    assert.match(meritsHtml, /<title>Méritos de carretera \| Chilangos RC<\/title>/);
    assert.match(meritsHtml, /12,800/);
    assert.match(meritsHtml, /5K/);
    assert.match(meritsHtml, /ENTREGADO/);
    assert.match(meritsHtml, /Guardar expediente y méritos/);
    assert.match(meritsHtml, /name="robots" content="[^"]*noindex/i);

    const officialPage = await ownerFetch("/sitio-completo");
    const officialHtml = await officialPage.text();
    assert.match(officialHtml, /12,800/);
    assert.match(officialHtml, /parches entregados/);
    assert.doesNotMatch(officialHtml, /Esta nota sensible debe permanecer privada/);

    const form = new FormData();
    form.set("alias", "Austria");
    form.set("tipoIntegrante", "biker");
    form.set("odometroActual", "25100");
    form.set("odometroUnidad", "km");
    setQuestionnairePrivacy(form);
    const registration = await worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
      method: "POST",
      body: form,
    }), runtime, execution);
    assert.equal(registration.status, 201);
    const austriaMerit = database.prepare("select odometer_km from member_mileage_records where member_slug = ?").get("austria");
    assert.equal(austriaMerit, undefined);
    const austriaSubmission = database.prepare("select answers_json from questionnaire_submissions where alias = ? order by created_at desc limit 1").get("Austria");
    const austriaAnswers = JSON.parse(austriaSubmission.answers_json);
    assert.equal(austriaAnswers.currentMotorcycle.odometerKm, "25100");
    assert.equal(austriaAnswers.currentMotorcycle.odometerUnit, "km");

    const lowerOdometer = new FormData();
    lowerOdometer.set("alias", "Austria");
    lowerOdometer.set("odometroActual", "20000");
    setQuestionnairePrivacy(lowerOdometer);
    const lowerRegistration = await worker.fetch(new Request("http://localhost/api/cuestionario-integrantes", {
      method: "POST",
      body: lowerOdometer,
    }), runtime, execution);
    assert.equal(lowerRegistration.status, 201);
    assert.equal(database.prepare("select odometer_km from member_mileage_records where member_slug = ?").get("austria"), undefined);
  } finally {
    delete globalThis.__chilangosTestCloudflareEnv.DB;
    database.close();
  }
});

test("el panel QA mantiene el código independiente y la ejecución protegidos", async () => {
  const [html, script, source] = await Promise.all([
    renderRoute("/administracion/pruebas"),
    readFile(new URL("../public/pruebas-cuestionarios.js", import.meta.url), "utf8"),
    readFile(new URL("../app/administracion/pruebas/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<title>Pruebas funcionales \| Chilangos RC<\/title>/);
  assert.match(html, /Ejecutar prueba completa/);
  assert.match(html, /Descargar código independiente/);
  assert.match(html, /QA_CHILANGOS_/);
  assert.match(source, /requireClubAdministrator\("\/administracion\/pruebas"\)/);
  assert.match(script, /export async function runQuestionnaireQa/);
  assert.match(script, /export async function cleanupQuestionnaireQa/);
  assert.match(script, /index < 10/);
});

test("el código QA valida la captura completa y elimina únicamente sus datos ficticios", async () => {
  const database = new DatabaseSync(":memory:");
  const images = new Map();

  for (const migration of ["0000_natural_tony_stark.sql", "0001_wonderful_skreet.sql", "0002_strange_tenebrous.sql"]) {
    database.exec(await readFile(new URL(`../drizzle/${migration}`, import.meta.url), "utf8"));
  }

  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(sql) {
      return {
        bind(...values) {
          const statement = database.prepare(sql);
          return {
            async run() {
              const result = statement.run(...values);
              return { success: true, meta: { changes: Number(result.changes) } };
            },
            async all() {
              return { results: statement.all(...values), success: true };
            },
            async raw() {
              return statement.all(...values).map((row) => Object.values(row));
            },
          };
        },
      };
    },
  };

  globalThis.__chilangosTestCloudflareEnv.BUCKET = {
    async put(key, bytes, options) {
      images.set(key, { bytes, httpMetadata: options.httpMetadata });
    },
    async get(key) {
      const image = images.get(key);
      return image ? { body: image.bytes, httpMetadata: image.httpMetadata } : null;
    },
    async delete(key) {
      images.delete(key);
    },
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-qa-full-capture`);
  const { default: worker } = await import(workerUrl.href);
  const { runQuestionnaireQa, cleanupQuestionnaireQa } = await import(new URL("../public/pruebas-cuestionarios.js", import.meta.url));
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  async function ownerFetch(url, init = {}) {
    const headers = new Headers(init.headers);
    headers.set("host", "registro.chilangosrc.com");
    headers.set("oai-authenticated-user-email", "ronaldzunig@gmail.com");
    headers.set("accept", "text/html,application/json");
    return worker.fetch(new Request(url, { ...init, headers }), runtime, execution);
  }

  try {
    const report = await runQuestionnaireQa({ baseUrl: "http://localhost", runId: "TEST2026", fetch: ownerFetch });
    assert.equal(report.failed, 0, JSON.stringify(report.results.filter((result) => result.status === "failed")));
    assert(report.passed >= 18);
    assert.equal(database.prepare("select count(*) as total from questionnaire_submissions").get().total, 2);
    assert.equal(database.prepare("select count(*) as total from ride_safety_submissions").get().total, 2);
    assert.equal(database.prepare("select count(*) as total from collaboration_requests").get().total, 1);
    assert.equal(images.size, 4);

    const cleaned = await cleanupQuestionnaireQa(report.runId, { baseUrl: "http://localhost", fetch: ownerFetch });
    assert.deepEqual(cleaned, { cleaned: true, runId: "TEST2026", biographies: 2, safetyRecords: 2, collaborations: 1, images: 4 });
    assert.equal(database.prepare("select count(*) as total from questionnaire_submissions").get().total, 0);
    assert.equal(database.prepare("select count(*) as total from ride_safety_submissions").get().total, 0);
    assert.equal(database.prepare("select count(*) as total from collaboration_requests").get().total, 0);
    assert.equal(images.size, 0);
  } finally {
    delete globalThis.__chilangosTestCloudflareEnv.DB;
    delete globalThis.__chilangosTestCloudflareEnv.BUCKET;
    database.close();
  }
});

test("la ficha de seguridad se mantiene privada, pide seguro y no se indexa", async () => {
  const [html, api, schema, admin] = await Promise.all([
    renderRoute("/seguridad-en-ruta"),
    readFile(new URL("../app/api/seguridad-en-ruta/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/administracion/seguridad/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<title>Ficha privada de seguridad \| Chilangos RC<\/title>/);
  assert.match(html, /name="robots" content="[^"]*noindex/i);
  assert.match(html, /Seguro vigente para salir con la banda/);
  assert.match(html, /name="emergencyContactName"/);
  assert.match(html, /name="insuranceActive"/);
  assert.match(html, /name="policyDetails"/);
  assert.match(html, /name="privacyAcknowledgement"/);
  assert.match(html, /name="sensitiveDataConsent"/);
  assert.match(html, /href="\/aviso-de-privacidad"/);
  assert.doesNotMatch(html, /name="plates"/);
  assert.match(html, /No compartas el número completo/);
  assert.match(html, /No se publica automáticamente ningún dato/);
  assert.match(schema, /ride_safety_submissions/);
  assert.match(api, /export async function POST/);
  assert.doesNotMatch(api, /export async function GET/);
  assert.match(admin, /requireClubAdministrator\("\/administracion\/seguridad"\)/);
});

test("la API guarda la ficha de seguridad y rechaza registros incompletos", async () => {
  const savedQueries = [];
  globalThis.__chilangosTestCloudflareEnv.DB = {
    prepare(statement) {
      return {
        bind(...values) {
          return { async run() { savedQueries.push({ statement, values }); return { success: true, meta: { changes: 1 } }; } };
        },
      };
    },
  };

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-route-safety`);
  const { default: worker } = await import(workerUrl.href);
  const runtime = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const execution = { waitUntil() {}, passThroughOnException() {} };

  const invalid = await worker.fetch(new Request("http://localhost/api/seguridad-en-ruta", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ alias: "Rafa" }),
  }), runtime, execution);
  assert.equal(invalid.status, 400);

  const valid = await worker.fetch(new Request("http://localhost/api/seguridad-en-ruta", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fullName: "Persona de prueba", alias: "Rafa", phone: "5555555555", email: "rafa@example.com",
      birthDate: "1983-03-24", bloodType: "O+", medicalNotes: "N/A",
      emergencyContactName: "Contacto de prueba", emergencyContactPhone: "5555550000",
      healthInstitution: "IMSS", insuranceActive: "si", motorcycleModel: "Fat Boy",
      motorcycleYear: "2020", engineCc: "1868",
      policyDetails: "Aseguradora de prueba · vigente · 1234",
      privacyAcknowledgement: "acepto", sensitiveDataConsent: "acepto",
    }),
  }), runtime, execution);

  assert.equal(valid.status, 201);
  assert.deepEqual(await valid.json(), { received: true });
  assert.equal(savedQueries.length, 1);
  assert.match(savedQueries[0].statement, /insert into "ride_safety_submissions"/i);
  assert(savedQueries[0].values.includes("Rafa"));
  assert(savedQueries[0].values.includes("si"));

  delete globalThis.__chilangosTestCloudflareEnv.DB;
});

test("las biografías admiten Chilango Awards confirmados con su año", async () => {
  const [profilePage, profileData] = await Promise.all([
    readFile(new URL("../app/integrantes/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/biker-profiles.ts", import.meta.url), "utf8"),
  ]);

  assert.match(profileData, /awards: ChilangoAward\[\]/);
  assert.match(profilePage, /profile\.awards\.length > 0/);
  assert.match(profilePage, /CHILANGOS AWARDS · \{award\.year\}/);
});

test("la documentación versionada contiene los diez capítulos y 56 preguntas", async () => {
  const questionnaire = await readFile(
    new URL("../docs/cuestionario-integrantes.md", import.meta.url),
    "utf8",
  );

  assert.equal((questionnaire.match(/^## \d{2}\./gm) ?? []).length, 10);
  assert.equal((questionnaire.match(/^\d+\. /gm) ?? []).length - 3, 56);
  assert.match(questionnaire, /La autorización general siempre prevalece/);
});

test("los álbumes explican cómo cargar fotos reales sin exponer información personal", async () => {
  const albums = await readFile(
    new URL("../public/albums/README.md", import.meta.url),
    "utf8",
  );

  assert.match(albums, /public\/albums\/2022/);
  assert.match(albums, /public\/albums\/2026/);
  assert.match(albums, /app\/data\/club-life\.ts/);
  assert.match(albums, /facebookUrl/);
  assert.match(albums, /portada\.webp/);

  const anniversaries = await readFile(new URL("../public/anniversaries/README.md", import.meta.url), "utf8");
  const members = await readFile(new URL("../public/members/README.md", import.meta.url), "utf8");
  const heritage = await readFile(new URL("../public/heritage/README.md", import.meta.url), "utf8");

  assert.match(anniversaries, /public\/anniversaries\/2025/);
  assert.match(anniversaries, /facebookUrl/);
  assert.match(members, /perfil\.webp/);
  assert.match(members, /moto-anterior-10\.webp/);
  assert.match(members, /public` → `members/);
  assert.match(heritage, /fundadores-first-6\.jpg/);
  assert.match(heritage, /parche-oficial\.jpg/);
});

test("el padrón de pueblos distingue las rodadas reales de los destinos pendientes", async () => {
  const roster = await readFile(new URL("../app/data/pueblos-magicos.ts", import.meta.url), "utf8");
  const townEntries = roster.match(/^  \{ name: /gm) ?? [];
  const stateCenterBlock = roster.split("export const stateCenters")[1].split("};")[0];
  const stateCenters = stateCenterBlock.match(/^  "?[A-ZÁÉÍÓÚÑ][^:\n]+"?: \[-?\d/gm) ?? [];

  assert.equal(townEntries.length, 177);
  assert.equal(stateCenters.length, 32);
  assert.match(roster, /"Ciudad de México": \[19\.4326, -99\.1332\]/);
  assert.match(roster, /"Real del Monte": \["Mineral del Monte"\]/);
  assert.match(roster, /Bernal: \["Peña de Bernal"\]/);
  assert.match(roster, /rides\.some/);
  assert.match(roster, /pueblos pendientes agrupados por estado|Centros regionales de referencia/);
});

test("la guía Harley cita fuentes oficiales y evita presiones inventadas", async () => {
  const guide = await readFile(new URL("../app/data/harley-guide.ts", import.meta.url), "utf8");

  assert.match(guide, /serviceinfo\.harley-davidson\.com/);
  assert.match(guide, /6-motorcycle-maintenance-essentials/);
  assert.match(guide, /motorcycle-oil-basics/);
  assert.match(guide, /motorcycle-spark-plug-wire-faqs/);
  assert.match(guide, /Mide la presión en frío/);
  assert.match(guide, /SAE 20W-50/);
  assert.match(guide, /Milwaukee-Eight/);
  assert.match(guide, /2,500 mi/);
  assert.doesNotMatch(guide, /(?:delantera|trasera)\D{0,15}\b(?:30|32|34|36|38|40|42)\s*PSI/i);
});
