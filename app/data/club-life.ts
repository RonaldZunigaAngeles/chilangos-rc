import { rides } from "./chilangos";

export type ArchivePhoto = {
  src: string;
  title: string;
  description: string;
};

export type ArchiveAlbum = {
  year: string;
  chapter: string;
  story: string;
  photos: ArchivePhoto[];
};

export type AnniversaryAlbum = {
  edition: number;
  year: string;
  title: string;
  description: string;
  location: string | null;
  photos: ArchivePhoto[];
};

export type ClubHeritageImage = {
  src: string | null;
  title: string;
  description: string;
};

export const clubHeritage = {
  foundersPhoto: {
    src: "/heritage/fundadores-first-6.jpg",
    title: "La foto donde comenzó todo",
    description: "Fotografía original de los primeros seis fundadores de Chilangos RC, reunidos frente a las montañas al comienzo de nuestra historia.",
  },
  officialPatch: {
    src: null,
    title: "Nuestros colores, nuestra historia",
    description: "Espacio reservado para una fotografía real del parche oficial o del chaleco Chilangos RC.",
  },
} satisfies Record<string, ClubHeritageImage>;

export const anniversaryAlbums: AnniversaryAlbum[] = [
  {
    edition: 1,
    year: "2023",
    title: "Primer aniversario",
    description: "La primera vuelta completa de la familia Chilanga.",
    location: "Alfajayucan, Hidalgo",
    photos: [],
  },
  {
    edition: 2,
    year: "2024",
    title: "Segundo aniversario",
    description: "Otra temporada compartiendo carretera y hermandad.",
    location: "Cuautla, Morelos",
    photos: [],
  },
  {
    edition: 3,
    year: "2025",
    title: "Tercer aniversario",
    description: "El tercer capítulo de una historia que sigue creciendo.",
    location: "Valle del Potrero, La Marquesa, Estado de México",
    photos: [],
  },
];

export const archiveAlbums: ArchiveAlbum[] = [
  {
    year: "2022",
    chapter: "Donde nació la banda",
    story: "El 10 de diciembre nació Chilangos RC. El primer capítulo todavía espera sus fotos originales.",
    photos: [],
  },
  {
    year: "2023",
    chapter: "La primera temporada",
    story: "Val’Quirico, Huamantla, Alfajayucan y las primeras historias que nos hicieron regresar juntos.",
    photos: [],
  },
  {
    year: "2024",
    chapter: "El mapa se hizo más grande",
    story: "Chachalacas, Peña de Bernal, Acapulco y un segundo aniversario que confirmó la hermandad.",
    photos: [],
  },
  {
    year: "2025",
    chapter: "La historia sigue rodando",
    story: "Taxco, Querétaro, Toluca, Yecapixtla, Tlaxcala y un tercer aniversario en Valle del Potrero marcaron otra temporada juntos.",
    photos: [],
  },
  {
    year: "2026",
    chapter: "Lo que estamos escribiendo",
    story: "Taxco, Metepec, Xochitepec y Tlayacapan ya forman parte del capítulo que estamos escribiendo sobre dos ruedas.",
    photos: [],
  },
];

export const annualMileage = archiveAlbums.map((album) => {
  const documentedRides = rides.filter((ride) => ride.date.startsWith(album.year));
  return {
    year: album.year,
    rideCount: documentedRides.length,
    kilometers: documentedRides.reduce((total, ride) => total + ride.roundTripKm, 0),
  };
});

export const featuredRideDates = [
  "2024-02-03",
  "2024-09-20",
  "2025-12-13",
  "2026-08-16",
];

export const featuredRides = featuredRideDates
  .map((date) => rides.find((ride) => ride.date === date))
  .filter((ride): ride is (typeof rides)[number] => Boolean(ride));

export const garageTips = [
  {
    category: "Antes de arrancar",
    title: "La revisión empieza en frío.",
    advice: "Comprueba la presión indicada por el fabricante, el estado de las llantas y cualquier desgaste o daño visible antes de salir.",
    detail: "Consulta siempre el manual de tu moto: no existe una presión universal.",
  },
  {
    category: "Frenos y controles",
    title: "Si algo se siente raro, no lo normalices.",
    advice: "Verifica el tacto de los frenos, las luces, las direccionales y que los controles respondan sin resistencia extraña.",
    detail: "Una duda de frenado se revisa con un profesional antes de rodar.",
  },
  {
    category: "Aceite y transmisión",
    title: "La moto avisa; hay que escucharla.",
    advice: "Busca fugas, revisa los niveles conforme al manual y observa la cadena o banda sin manipular componentes con el motor encendido.",
    detail: "No improvises ajustes sin especificaciones, herramientas y experiencia.",
  },
  {
    category: "Lluvia y visibilidad",
    title: "Llegar bien siempre vale más.",
    advice: "Reduce el ritmo cuando llueva, aumenta tu distancia, evita movimientos bruscos y lleva equipo impermeable que conserve visibilidad.",
    detail: "Respeta tus límites: una parada también puede ser una buena decisión.",
  },
  {
    category: "Equipo personal",
    title: "La facha también puede cuidarte.",
    advice: "Casco bien ajustado, guantes, botas y chamarra adecuada forman parte del viaje. Revisa el desgaste antes de confiar en tu equipo.",
    detail: "Elegir protección es respeto por ti y por quienes te esperan.",
  },
  {
    category: "Rodar en grupo",
    title: "La hermandad también se mide al regreso.",
    advice: "Acuerden la ruta, mantengan un ritmo compartido, dejen espacio suficiente y acompañen a quien todavía está ganando confianza.",
    detail: "Sin presión, sin alcohol al conducir y sin dejar a nadie atrás.",
  },
];

export const partnerCategories = [
  {
    type: "Talleres mecánicos",
    value: "Mantenimiento confiable, orientación especializada y beneficios acordados para integrantes.",
  },
  {
    type: "Restaurantes y cafeterías",
    value: "Paradas con buen servicio, espacio para la banda y experiencias que valgan la rodada.",
  },
  {
    type: "Bares y puntos biker",
    value: "Encuentros, eventos y espacios con identidad para compartir después de una buena ruta.",
  },
  {
    type: "Hoteles y destinos",
    value: "Escapadas, fines de semana y lugares que reciban bien a quienes llegan sobre dos ruedas.",
  },
  {
    type: "Equipo y accesorios",
    value: "Marcas de protección, accesorios, mantenimiento y productos relevantes para la comunidad.",
  },
  {
    type: "Fotografía y experiencias",
    value: "Fotógrafos de carretera, creadores y proyectos que quieran contar historias auténticas.",
  },
];

export const partnerLocations = [
  {
    name: "Milwaukee Bar Tlaxcala",
    category: "Bar biker",
    location: "Tlaxcala",
    relationship: "Nuestros colores ya tienen un lugar en este espacio biker.",
    status: "Presencia confirmada",
    logo: null,
    mapsUrl: null,
  },
  {
    name: "Iron Choppers",
    category: "Taller y refacciones de motocicletas",
    location: "Av. Muyuguarda 163, Barrio 18, Xochimilco, CDMX",
    relationship: "Un taller de confianza para acompañar a la banda con servicio, experiencia y atención a nuestras motocicletas.",
    status: "Taller de confianza",
    logo: null,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Iron%20Choppers%20Av.%20Muyuguarda%20163%2C%20Barrio%2018%2C%20Xochimilco%2C%20Ciudad%20de%20M%C3%A9xico",
  },
];
