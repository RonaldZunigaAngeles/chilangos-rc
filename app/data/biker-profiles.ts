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
  sponsor: string | null;
  ridingPartner: string | null;
  portrait: string | null;
  age: number | null;
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

export type ProspectProfile = {
  alias: string;
  sponsor: string;
};

type ProfileSeed = Pick<BikerProfile, "slug" | "alias" | "founder" | "partner" | "sponsor" | "ridingPartner">;

function buildProfile(seed: ProfileSeed): BikerProfile {
  const founder = founders.find((person) => person.name === seed.alias);
  const motorcycle = founder && !seed.partner
    ? [{ brand: "Harley-Davidson", model: founder.motorcycle, period: null, photo: null, story: null, current: true }]
    : [];

  return {
    ...seed,
    portrait: null,
    age: null,
    beginnings: null,
    biography: null,
    philosophy: null,
    favoriteRoute: null,
    dreamRoute: null,
    passions: [],
    hobbies: [],
    motorcycles: motorcycle,
    awards: [],
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
  { slug: "gi", alias: "Gi", founder: false, partner: false, sponsor: "Fer", ridingPartner: null },
  { slug: "isra", alias: "Isra", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
  { slug: "mac", alias: "Mac", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
  { slug: "richard", alias: "Richard", founder: false, partner: false, sponsor: null, ridingPartner: null },
  { slug: "seb", alias: "Seb", founder: false, partner: false, sponsor: "Ronnie", ridingPartner: null },
].map(buildProfile);

export const prospectProfiles: ProspectProfile[] = [
  { alias: "Fer Fucho", sponsor: "Austria" },
];

export function getBikerProfile(slug: string) {
  return bikerProfiles.find((profile) => profile.slug === slug);
}

export function getBikerRole(profile: BikerProfile) {
  if (profile.founder && profile.partner) return "Fundadora · Partner";
  if (profile.founder) return "Fundador";
  if (profile.partner) return "Integrante · Partner";
  return "Integrante";
}
