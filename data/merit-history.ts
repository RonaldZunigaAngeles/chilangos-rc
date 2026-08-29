export type MileageUnit = "km" | "mi";
export type MileageVerification = "verified" | "estimated" | "pending";
export type MileageMembership = "full_patch" | "prospect" | "inactive" | "withdrawn";

export type MotorcycleMileage = {
  id: string;
  model: string;
  unit: MileageUnit;
  initialOdometer: number | null;
  latestOdometer: number | null;
  active: boolean;
  verification: MileageVerification;
};

export type HistoricMeritSeed = {
  memberSlug: string;
  membershipStatus: MileageMembership;
  trackingStatus: MileageVerification;
  motorcycles: MotorcycleMileage[];
  awardedMilestones: number[];
  notes: string | null;
};

function motorcycle(
  id: string,
  model: string,
  initialOdometer: number | null,
  latestOdometer: number | null,
  unit: MileageUnit,
  active = true,
): MotorcycleMileage {
  return {
    id,
    model,
    unit,
    initialOdometer,
    latestOdometer,
    active,
    verification: initialOdometer === null || latestOdometer === null ? "pending" : "verified",
  };
}

// Historial reconocido del archivo «docs/data/Kilometros.xlsx». Las lecturas se
// conservan en su unidad original; nunca se interpreta un odómetro como el
// kilometraje acumulado personalmente por su biker.
export const historicalMemberMerits: HistoricMeritSeed[] = [
  {
    memberSlug: "alej",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("alej-sportster", "Sportster", 51_510, 56_510, "km", false),
      motorcycle("alej-fat-boy", "Fat Boy", 37_824, 41_153, "mi"),
    ],
    awardedMilestones: [5_000],
    notes: "Parche de 10,000 km pendiente de entrega.",
  },
  {
    memberSlug: "austria",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("austria-street-glide", "Street Glide", 34_862, 51_354, "km", false),
      motorcycle("austria-road-glide", "Road Glide", null, null, "km"),
    ],
    awardedMilestones: [5_000, 10_000],
    notes: "La Road Glide actual todavía necesita su lectura inicial.",
  },
  {
    memberSlug: "charly",
    membershipStatus: "inactive",
    trackingStatus: "pending",
    motorcycles: [motorcycle("charly-street-glide", "Street Glide", null, null, "km", false)],
    awardedMilestones: [5_000],
    notes: "Fundador sin actividad reciente. Cambió de motocicleta y no ha registrado odómetro.",
  },
  {
    memberSlug: "fer",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("fer-ultra-glide", "Ultra Glide", 12_200, 31_220, "km", false),
      motorcycle("fer-road-glide", "Road Glide", 37_002, 42_421, "km"),
    ],
    awardedMilestones: [5_000, 10_000],
    notes: null,
  },
  {
    memberSlug: "mac",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("mac-sportster-883", "Sportster 883", 9_738, 16_069, "km", false),
      motorcycle("mac-sportster-1200", "Sportster 1200", 27_773, 27_773, "km"),
    ],
    awardedMilestones: [5_000],
    notes: null,
  },
  {
    memberSlug: "richard",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("richard-sportster-883", "Sportster 883", 36_973, 43_523, "km", false),
      motorcycle("richard-dyna", "Dyna", 13_941, 14_642, "mi"),
    ],
    awardedMilestones: [5_000],
    notes: null,
  },
  {
    memberSlug: "ronnie",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [motorcycle("ronnie-roadster", "Roadster", 908, 25_631, "km")],
    awardedMilestones: [5_000, 10_000],
    notes: null,
  },
  {
    memberSlug: "rulo",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [motorcycle("rulo-street-glide", "Street Glide", 35_516, 50_475, "km")],
    awardedMilestones: [5_000, 10_000],
    notes: null,
  },
  {
    memberSlug: "rafa",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [motorcycle("rafa-fat-boy", "Fat Boy", 65_093, 83_129, "mi")],
    awardedMilestones: [5_000, 10_000, 25_000],
    notes: null,
  },
  {
    memberSlug: "seb",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [motorcycle("seb-sportster-1200", "Sportster 1200", 4_000, 22_736, "mi")],
    awardedMilestones: [5_000, 10_000, 25_000],
    notes: null,
  },
  {
    memberSlug: "isra",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [
      motorcycle("isra-iron-883", "Iron 883", null, null, "km", false),
      motorcycle("isra-road-king", "Road King", null, null, "km", false),
      motorcycle("isra-ultra-clasic", "Ultra Clasic", 35_635, 40_635, "km"),
    ],
    awardedMilestones: [5_000],
    notes: "Datos corregidos desde Kilometros.xlsx: Iron 883 y Road King conservan lecturas pendientes; Ultra Clasic verificada con 5,000 km reconocidos.",
  },
  {
    memberSlug: "angel",
    membershipStatus: "full_patch",
    trackingStatus: "verified",
    motorcycles: [motorcycle("angel-sportster-1200", "Sportster 1200", 20_172, 26_467.4, "mi")],
    awardedMilestones: [10_000],
    notes: "Parche físico de 5,000 km pendiente de entrega.",
  },
  {
    memberSlug: "gi",
    membershipStatus: "prospect",
    trackingStatus: "pending",
    motorcycles: [motorcycle("gi-sportster-883", "Sportster 883", null, null, "km")],
    awardedMilestones: [],
    notes: null,
  },
  {
    memberSlug: "fer-fucho",
    membershipStatus: "prospect",
    trackingStatus: "pending",
    motorcycles: [],
    awardedMilestones: [],
    notes: null,
  },
];

// Integrantes dados de baja: se conserva únicamente la referencia histórica
// para administración, sin mostrarlos como parte del club ni del dashboard.
export const archivedMemberMerits = [
  { alias: "Rodas", accumulatedKm: 11_249, status: "Baja definitiva" },
  { alias: "Pituko", accumulatedKm: 10_000, status: "Baja definitiva" },
] as const;
