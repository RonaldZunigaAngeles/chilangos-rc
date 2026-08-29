import { founders } from "./chilangos";
import type { ChilangoAward } from "./club-awards";

export type MotorcycleMemory = {
  brand: string;
  model: string;
  period: string | null;
  photo: string | null;
  story: string | null;
  current: boolean;
};

export type BikerProfile = {
  slug: string;
  alias: string;
  founder: boolean;
  partner: boolean;
  prospect: boolean;
  sponsor: string | null;
  ridingPartner: string | null;
  portrait: string | null;
  thumbnail?: string | null;
  age: number | null;
  profession: string | null;
  beginnings: string | null;
  biography: string | null;
  philosophy: string | null;
  favoriteRoute: string | null;
  dreamRoute: string | null;
  passions: string[];
  hobbies: string[];
  motorcycles: MotorcycleMemory[];
  awards: ChilangoAward[];
};

export type ProspectProfile = BikerProfile;

type ProfileSeed = Pick<BikerProfile, "slug" | "alias" | "founder" | "partner" | "sponsor" | "ridingPartner"> & {
  prospect?: boolean;
  motorcycle?: MotorcycleMemory;
};

const profileDetails: Partial<Record<string, Partial<BikerProfile>>> = {
  rafa: {
    portrait: "/portraits/rafa-studio.webp",
    thumbnail: "/portraits/rafa-card.webp",
  },
  ronnie: {
    portrait: "/portraits/ronnie-studio.webp",
    thumbnail: "/portraits/ronnie-card.webp",
  },
  rulo: {
    portrait: "/portraits/rulo-studio.webp",
    thumbnail: "/portraits/rulo-card.webp",
  },
  seb: {
    portrait: "/portraits/seb-studio-v2.webp",
    thumbnail: "/portraits/seb-card-v2.webp",
    age: 30,
    profession: "Supervisor",
    beginnings: "Su historia sobre dos ruedas comenzó en 2023, cuando tuvo la oportunidad de convertir una Harley-Davidson en su primera motocicleta.",
    biography: "Seb se integró a Chilangos RC en diciembre de 2023 de la mano de su padre. En el club encontró una familia para aprender, convivir y apoyarse. Disfruta los viajes, los videojuegos, la cultura custom y la convivencia después de cada rodada. Entre sus recuerdos destaca una tormenta de tierra rumbo a Veracruz: una escena con vibra de Mad Max que quedó grabada en la historia de la banda.",
    philosophy: "Déjaselo al Sebastián del futuro.",
    favoriteRoute: "Chachalacas, Veracruz",
    dreamRoute: "Canadá",
    passions: ["Viajes"],
    hobbies: ["Videojuegos"],
    motorcycles: [
      {
        brand: "Harley-Davidson",
        model: "Sportster Low XL 1200",
        period: "Desde 2023",
        photo: null,
        story: "Megan es una Sportster Low XL 1200 modelo 2007, negra y de 1,200 cc. Siempre quiso tener una Harley-Davidson y la oportunidad de adquirirla convirtió ese sueño en su primera motocicleta.",
        current: true,
      },
    ],
    awards: [
      {
        title: "Rey del choque",
        year: 2024,
        note: "Tres caídas convertidas en aprendizaje, experiencia y una de las categorías más memorables de la banda.",
      },
    ],
  },
};

function buildProfile(seed: ProfileSeed): BikerProfile {
  const founder = founders.find((person) => person.name === seed.alias);
  const motorcycle = seed.motorcycle
    ? [seed.motorcycle]
    : founder && !seed.partner && founder.motorcycle !== "Por confirmar"
      ? [{ brand: "Harley-Davidson", model: founder.motorcycle, period: null, photo: null, story: null, current: true }]
    : [];

  return {
    slug: seed.slug,
    alias: seed.alias,
    founder: seed.founder,
    partner: seed.partner,
    prospect: seed.prospect ?? false,
    sponsor: seed.sponsor,
    ridingPartner: seed.ridingPartner,
    portrait: null,
    age: null,
    profession: null,
    beginnings: null,
    biography: null,
    philosophy: null,
    favoriteRoute: null,
    dreamRoute: null,
    passions: [],
    hobbies: [],
    motorcycles: motorcycle,
    awards: [],
    ...profileDetails[seed.slug],
  };
}

export const bikerProfiles: BikerProfile[] = [
  { slug: "adri", alias: "Adri", founder: true, partner: true, sponsor: "Rafa", ridingPartner: "Rafa" },
  { slug: "austria", alias: "Austria", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "charly", alias: "Charly", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "fer", alias: "Fer", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "rafa", alias: "Rafa", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "ronnie", alias: "Ronnie", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "rulo", alias: "Rulo", founder: true, partner: false, sponsor: null, ridingPartner: null },
  { slug: "alej", alias: "Alej", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
  { slug: "angel", alias: "Ángel", founder: false, partner: false, sponsor: "Rafa", ridingPartner: null },
  { slug: "fatima", alias: "Fátima", founder: false, partner: true, sponsor: null, ridingPartner: "Austria" },
  { slug: "isra", alias: "Inra", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
  { slug: "mac", alias: "Mac", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
  { slug: "richard", alias: "Richard", founder: false, partner: false, sponsor: null, ridingPartner: null },
  { slug: "seb", alias: "Seb", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
].map(buildProfile);

export const prospectProfiles: ProspectProfile[] = [
  { slug: "fer-fucho", alias: "Fer Fucho", founder: false, partner: false, prospect: true, sponsor: "Austria", ridingPartner: null },
  {
    slug: "gi",
    alias: "Gi",
    founder: false,
    partner: false,
    prospect: true,
    sponsor: "Fer",
    ridingPartner: null,
    motorcycle: { brand: "Harley-Davidson", model: "Sportster 883", period: null, photo: null, story: null, current: true },
  },
].map(buildProfile);

export const allClubProfiles = [...bikerProfiles, ...prospectProfiles];

export function getBikerProfile(slug: string) {
  return allClubProfiles.find((profile) => profile.slug === slug);
}

export function getBikerRole(profile: BikerProfile) {
  if (profile.prospect) return "Prospecto activo";
  if (profile.founder && profile.partner) return "Fundadora · Partner";
  if (profile.founder) return "Fundador";
  if (profile.partner) return "Miembro · Partner";
  return "Miembro";
}
