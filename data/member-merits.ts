import { bikerProfiles, prospectProfiles } from "./biker-profiles";
import { individualPatchMilestones, membershipKilometers } from "./chilangos";
import {
  historicalMemberMerits,
  type HistoricMeritSeed,
  type MileageMembership,
  type MileageVerification,
  type MotorcycleMileage,
} from "./merit-history";

export type { MileageMembership, MileageUnit, MileageVerification, MotorcycleMileage } from "./merit-history";

export type MeritRecord = {
  memberSlug: string;
  odometerKm: number;
  awardedMilestones: number[];
  verifiedAt: string | null;
  updatedAt: string;
  motorcycles: MotorcycleMileage[];
  manualAdjustmentKm: number;
  trackingStatus: MileageVerification;
  membershipStatus: MileageMembership;
};

export type StoredMeritRecord = {
  memberSlug: string;
  odometerKm: number;
  awardedMilestonesJson: string;
  verifiedAt: string | null;
  updatedAt: string;
  motorcyclesJson?: string | null;
  manualAdjustmentKm?: number | null;
  trackingStatus?: string | null;
  membershipStatus?: string | null;
};

const MILES_TO_KILOMETERS = 1.60934;

export function normalizeMemberAlias(alias: string) {
  const normalized = alias
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-MX");

  return ["israel", "isra", "inra"].includes(normalized) ? "isra" : normalized;
}

export function findBikerByAlias(alias: string) {
  const normalized = normalizeMemberAlias(alias);
  return bikerProfiles.find((profile) =>
    !profile.partner && (
      normalizeMemberAlias(profile.alias) === normalized ||
      normalizeMemberAlias(profile.slug) === normalized
    ),
  );
}

export function findMileageMemberBySlug(memberSlug: string) {
  const official = bikerProfiles.find(({ slug, partner }) => slug === memberSlug && !partner);
  if (official) return { ...official, prospect: false };

  const prospect = prospectProfiles.find(({ slug }) => slug === memberSlug);
  return prospect ? { ...prospect, founder: false, partner: false, prospect: true } : null;
}

export function motorcycleDistanceKm(motorcycle: MotorcycleMileage) {
  if (motorcycle.initialOdometer === null || motorcycle.latestOdometer === null) return 0;
  const difference = Math.max(0, motorcycle.latestOdometer - motorcycle.initialOdometer);
  return difference * (motorcycle.unit === "mi" ? MILES_TO_KILOMETERS : 1);
}

export function calculateAccumulatedKm(motorcycles: MotorcycleMileage[], manualAdjustmentKm = 0) {
  return Math.max(0, Math.round(
    motorcycles.reduce((total, motorcycle) => total + motorcycleDistanceKm(motorcycle), 0) + manualAdjustmentKm,
  ));
}

export function parseAwardedMilestones(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return individualPatchMilestones.filter((milestone) => parsed.includes(milestone));
  } catch {
    return [];
  }
}

export function parseMotorcycleHistory(value: string | null | undefined): MotorcycleMileage[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((motorcycle): motorcycle is MotorcycleMileage => {
      if (!motorcycle || typeof motorcycle !== "object") return false;
      const candidate = motorcycle as Partial<MotorcycleMileage>;
      return typeof candidate.id === "string" &&
        typeof candidate.model === "string" &&
        (candidate.unit === "km" || candidate.unit === "mi") &&
        (candidate.initialOdometer === null || typeof candidate.initialOdometer === "number") &&
        (candidate.latestOdometer === null || typeof candidate.latestOdometer === "number") &&
        typeof candidate.active === "boolean" &&
        ["verified", "estimated", "pending"].includes(candidate.verification ?? "");
    });
  } catch {
    return [];
  }
}

function seedRecord(seed: HistoricMeritSeed): MeritRecord {
  return {
    memberSlug: seed.memberSlug,
    odometerKm: calculateAccumulatedKm(seed.motorcycles),
    awardedMilestones: seed.awardedMilestones,
    verifiedAt: null,
    updatedAt: "",
    motorcycles: seed.motorcycles,
    manualAdjustmentKm: 0,
    trackingStatus: seed.trackingStatus,
    membershipStatus: seed.membershipStatus,
  };
}

export function getHistoricalMeritRecord(memberSlug: string) {
  const seed = historicalMemberMerits.find((record) => record.memberSlug === memberSlug);
  return seed ? seedRecord(seed) : null;
}

export function getHistoricalMeritNotes(memberSlug: string) {
  return historicalMemberMerits.find((record) => record.memberSlug === memberSlug)?.notes ?? null;
}

export function sanitizeMeritRecord(record: StoredMeritRecord): MeritRecord {
  const historical = getHistoricalMeritRecord(record.memberSlug);
  const motorcycles = parseMotorcycleHistory(record.motorcyclesJson);
  const membershipStatus = ["full_patch", "prospect", "inactive", "withdrawn"].includes(record.membershipStatus ?? "")
    ? record.membershipStatus as MileageMembership
    : historical?.membershipStatus ?? "full_patch";
  const trackingStatus = ["verified", "estimated", "pending"].includes(record.trackingStatus ?? "")
    ? record.trackingStatus as MileageVerification
    : historical?.trackingStatus ?? "pending";

  return {
    memberSlug: record.memberSlug,
    odometerKm: record.odometerKm,
    awardedMilestones: parseAwardedMilestones(record.awardedMilestonesJson),
    verifiedAt: record.verifiedAt,
    updatedAt: record.updatedAt,
    motorcycles: motorcycles.length > 0 ? motorcycles : historical?.motorcycles ?? [],
    manualAdjustmentKm: record.manualAdjustmentKm ?? 0,
    trackingStatus,
    membershipStatus,
  };
}

export function mergeHistoricalMeritRecords(records: MeritRecord[]) {
  const merged = new Map(historicalMemberMerits.map((seed) => [seed.memberSlug, seedRecord(seed)]));

  for (const record of records) {
    merged.set(record.memberSlug, record);
  }

  return Array.from(merged.values());
}

export function earnedMilestones(odometerKm: number, membershipStatus: MileageMembership = "full_patch") {
  if (membershipStatus === "prospect" || membershipStatus === "withdrawn") return [];
  const recognizedKilometers = Math.max(membershipKilometers, odometerKm);
  return individualPatchMilestones.filter((milestone) => recognizedKilometers >= milestone);
}

export function mileageProgress(odometerKm: number, membershipStatus: MileageMembership = "full_patch") {
  if (membershipStatus === "prospect") {
    return Math.min(20, Math.max(0, (odometerKm / membershipKilometers) * 20));
  }

  const achieved = earnedMilestones(odometerKm, membershipStatus);
  if (achieved.length === individualPatchMilestones.length) return 100;

  const recognizedKilometers = Math.max(membershipKilometers, odometerKm);
  const previous = achieved.at(-1) ?? 0;
  const next = individualPatchMilestones[achieved.length];
  const segmentProgress = (recognizedKilometers - previous) / (next - previous);

  return Math.min(
    100,
    Math.max(0, ((achieved.length + segmentProgress) / individualPatchMilestones.length) * 100),
  );
}
