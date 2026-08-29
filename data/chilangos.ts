export type Ride = {
  title: string;
  date: string;
  meetingPoint: string;
  destination: string;
  state: string;
  oneWayKm: number;
  roundTripKm: number;
};

export type NextRide = {
  title: string;
  date: string;
  meetingPoint: string;
  meetingTime: string;
  destination: string;
  state: string;
  notes: string;
} | null;

export type Destination = {
  name: string;
  state: string;
  km: number;
  puebloMagico: boolean;
};

export const club = {
  name: "Chilangos RC",
  founded: "2022-12-10",
  location: "Ciudad de México",
  motto: "Juntos vamos, juntos regresamos.",
  instagram: "https://www.instagram.com/chilangosrc/",
  facebook: "https://www.facebook.com/chilangosrcmexico",
  domain: "https://chilangosrc.com",
  dataThrough: "2026-08-16",
  whatsapp: "525572718912",
  whatsappMessage: "Me gustaría conocer más sobre el motoclub.",
};

export function getWhatsappLink(message?: string) {
  const introduction = "¡Hola! Te escribo desde la página web de Chilangos RC.";
  const text = encodeURIComponent(`${introduction} ${message ?? club.whatsappMessage}`);
  return `https://wa.me/${club.whatsapp}?text=${text}`;
}

// Actualiza esta ficha cuando se confirme una nueva salida. Si todavía no
// hay fecha, horario y punto de reunión, se conserva en null.
export const nextRide: NextRide = null;

export const founders = [
  { name: "Adri", motorcycle: "Desde la primera rodada", role: "Fundadora" },
  { name: "Austria", motorcycle: "Road Glide", role: "Fundador" },
  { name: "Charly", motorcycle: "Por confirmar", role: "Fundador" },
  { name: "Fer", motorcycle: "Road Glide", role: "Fundador" },
  { name: "Rafa", motorcycle: "Fat Boy", role: "Fundador" },
  { name: "Ronnie", motorcycle: "Roadster", role: "Fundador" },
  { name: "Rulo", motorcycle: "Street Glide", role: "Fundador" },
];

export const crew = [
  "Alej", "Ángel", "Fátima", "Inra", "Mac", "Richard", "Seb",
];

export const prospects = ["Fer Fucho", "Gi"];

export const membershipKilometers = 5000;

export const individualPatchMilestones = [5000, 10000, 25000, 50000, 100000];

export const rides: Ride[] = [
  { title: "Open Road 2023", date: "2023-01-14", meetingPoint: "Foro Sol", destination: "Val’Quirico", state: "Tlaxcala", oneWayKm: 150, roundTripKm: 300 },
  { title: "2.ª rodada", date: "2023-02-18", meetingPoint: "Gasolinera Estadio Azteca", destination: "Mil Cascadas", state: "Guerrero", oneWayKm: 130, roundTripKm: 260 },
  { title: "3.ª rodada", date: "2023-03-11", meetingPoint: "Gasolinera Viaducto", destination: "Huamantla y Tlaxco", state: "Tlaxcala", oneWayKm: 180, roundTripKm: 360 },
  { title: "4.ª rodada", date: "2023-04-22", meetingPoint: "Gasolinera Viaducto", destination: "Lucca Riders, Metepec", state: "Estado de México", oneWayKm: 70, roundTripKm: 140 },
  { title: "5.ª rodada", date: "2023-05-06", meetingPoint: "Gasolinera Tacubaya", destination: "Cervecería Hércules", state: "Querétaro", oneWayKm: 220, roundTripKm: 440 },
  { title: "6.ª rodada", date: "2023-06-03", meetingPoint: "Gasolinera Viaducto", destination: "Mineral del Monte y Mineral del Chico", state: "Hidalgo", oneWayKm: 140, roundTripKm: 280 },
  { title: "7.ª rodada", date: "2023-07-22", meetingPoint: "Gasolinera Estadio Azteca", destination: "Temixco y Xochitepec", state: "Morelos", oneWayKm: 110, roundTripKm: 220 },
  { title: "8.ª rodada", date: "2023-08-19", meetingPoint: "Gasolinera Xochimilco", destination: "Cuautla", state: "Morelos", oneWayKm: 80, roundTripKm: 160 },
  { title: "11.ª rodada", date: "2023-11-04", meetingPoint: "Gasolinera Estadio Azteca", destination: "Birria El Pomposo", state: "Morelos", oneWayKm: 100, roundTripKm: 200 },
  { title: "Primer aniversario", date: "2023-12-16", meetingPoint: "Gasolinera Tacubaya", destination: "El Patrón, Alfajayucan", state: "Hidalgo", oneWayKm: 200, roundTripKm: 400 },
  { title: "Open Road 2024", date: "2024-01-13", meetingPoint: "Gasolinera Xochimilco", destination: "Yecapixtla y Atlixco", state: "Morelos y Puebla", oneWayKm: 150, roundTripKm: 300 },
  { title: "2.ª rodada", date: "2024-02-03", meetingPoint: "Caseta San Marcos", destination: "Chachalacas", state: "Veracruz", oneWayKm: 400, roundTripKm: 800 },
  { title: "3.ª rodada", date: "2024-03-03", meetingPoint: "Caseta San Marcos", destination: "Chachalacas", state: "Veracruz", oneWayKm: 400, roundTripKm: 800 },
  { title: "4.ª rodada", date: "2024-04-27", meetingPoint: "Gasolinera Estadio Azteca", destination: "Malinalco", state: "Estado de México", oneWayKm: 100, roundTripKm: 200 },
  { title: "5.ª rodada", date: "2024-05-18", meetingPoint: "Deportivo Oceanía", destination: "Peña de Bernal", state: "Querétaro", oneWayKm: 240, roundTripKm: 480 },
  { title: "6.ª rodada", date: "2024-06-15", meetingPoint: "Gasolinera Xochimilco", destination: "Carnitas Don Agus, Juchitepec", state: "Estado de México", oneWayKm: 70, roundTripKm: 140 },
  { title: "7.ª rodada", date: "2024-08-03", meetingPoint: "Gasolinera Viaducto", destination: "Black Dog Saloon, Tequisquiapan", state: "Querétaro", oneWayKm: 200, roundTripKm: 400 },
  { title: "8.ª rodada", date: "2024-08-24", meetingPoint: "Gasolinera Viaducto", destination: "Minas de Tiza", state: "Tlaxcala", oneWayKm: 120, roundTripKm: 240 },
  { title: "9.ª rodada", date: "2024-09-20", meetingPoint: "Caseta Tlalpan", destination: "Acapulco", state: "Guerrero", oneWayKm: 390, roundTripKm: 780 },
  { title: "10.ª rodada", date: "2024-10-26", meetingPoint: "Gasolinera Viaducto", destination: "Milwaukee Tlaxcala", state: "Tlaxcala", oneWayKm: 150, roundTripKm: 300 },
  { title: "Segundo aniversario", date: "2024-12-14", meetingPoint: "Gasolinera Xochimilco", destination: "Cuautla", state: "Morelos", oneWayKm: 80, roundTripKm: 160 },
  { title: "Open Road 2025", date: "2025-01-18", meetingPoint: "Caseta Tlalpan", destination: "Taxco", state: "Guerrero", oneWayKm: 185, roundTripKm: 370 },
  { title: "2.ª rodada", date: "2025-03-22", meetingPoint: "Deportivo Oceanía", destination: "Cervecería Hércules", state: "Querétaro", oneWayKm: 220, roundTripKm: 440 },
  { title: "3.ª rodada", date: "2025-05-31", meetingPoint: "Klandestino Garage", destination: "Fogón do Brasil, Toluca", state: "Estado de México", oneWayKm: 70, roundTripKm: 140 },
  { title: "8.ª rodada", date: "2025-08-09", meetingPoint: "Por confirmar", destination: "Cecina Romi, Yecapixtla", state: "Morelos", oneWayKm: 100, roundTripKm: 200 },
  { title: "10.ª rodada", date: "2025-10-25", meetingPoint: "Por confirmar", destination: "Tlaxcala", state: "Tlaxcala", oneWayKm: 150, roundTripKm: 300 },
  { title: "Tercer aniversario", date: "2025-12-13", meetingPoint: "Por confirmar", destination: "Valle del Potrero, La Marquesa", state: "Estado de México", oneWayKm: 50, roundTripKm: 100 },
  { title: "Open Road 2026", date: "2026-02-14", meetingPoint: "Gasolinera Estadio Azteca", destination: "Restaurante La Antigua, Taxco", state: "Guerrero", oneWayKm: 185, roundTripKm: 370 },
  { title: "3.ª rodada", date: "2026-03-14", meetingPoint: "Klandestino Garage", destination: "Metepec", state: "Estado de México", oneWayKm: 70, roundTripKm: 140 },
  { title: "8.ª rodada", date: "2026-08-08", meetingPoint: "Por confirmar", destination: "Birria El Pomposo, Xochitepec", state: "Morelos", oneWayKm: 100, roundTripKm: 200 },
  { title: "9.ª rodada", date: "2026-08-16", meetingPoint: "Por confirmar", destination: "La Mayordomía, Tlayacapan", state: "Morelos", oneWayKm: 85, roundTripKm: 170 },
];

export const destinations: Destination[] = [
  { name: "Aguascalientes", state: "Aguascalientes", km: 480, puebloMagico: false },
  { name: "Metepec", state: "Estado de México", km: 50, puebloMagico: true },
  { name: "Avándaro", state: "Estado de México", km: 140, puebloMagico: false },
  { name: "El Oro", state: "Estado de México", km: 130, puebloMagico: true },
  { name: "Ixtapan de la Sal", state: "Estado de México", km: 130, puebloMagico: true },
  { name: "Juchitepec", state: "Estado de México", km: 70, puebloMagico: false },
  { name: "Malinalco", state: "Estado de México", km: 115, puebloMagico: true },
  { name: "Presa Brockman", state: "Estado de México", km: 120, puebloMagico: false },
  { name: "Temoaya", state: "Estado de México", km: 60, puebloMagico: false },
  { name: "Toluca", state: "Estado de México", km: 70, puebloMagico: false },
  { name: "Valle del Potrero", state: "Estado de México", km: 50, puebloMagico: false },
  { name: "Valle de Bravo", state: "Estado de México", km: 140, puebloMagico: true },
  { name: "San Miguel de Allende", state: "Guanajuato", km: 270, puebloMagico: false },
  { name: "Dolores Hidalgo", state: "Guanajuato", km: 320, puebloMagico: true },
  { name: "Taxco", state: "Guerrero", km: 180, puebloMagico: true },
  { name: "Alfajayucan", state: "Hidalgo", km: 150, puebloMagico: false },
  { name: "El Tejocotal", state: "Hidalgo", km: 130, puebloMagico: false },
  { name: "Huasca de Ocampo", state: "Hidalgo", km: 130, puebloMagico: true },
  { name: "Los Frailes", state: "Hidalgo", km: 160, puebloMagico: false },
  { name: "Mineral del Chico", state: "Hidalgo", km: 140, puebloMagico: true },
  { name: "Pachuca", state: "Hidalgo", km: 90, puebloMagico: false },
  { name: "Presa El Mogote", state: "Hidalgo", km: 180, puebloMagico: false },
  { name: "Presa Zimapán", state: "Hidalgo", km: 150, puebloMagico: false },
  { name: "Prismas Basálticos", state: "Hidalgo", km: 115, puebloMagico: false },
  { name: "Real del Monte", state: "Hidalgo", km: 130, puebloMagico: true },
  { name: "Tlanalapa", state: "Hidalgo", km: 140, puebloMagico: false },
  { name: "Morelia", state: "Michoacán", km: 300, puebloMagico: false },
  { name: "Cocoyoc", state: "Morelos", km: 85, puebloMagico: false },
  { name: "Cuautla", state: "Morelos", km: 100, puebloMagico: false },
  { name: "Oaxtepec", state: "Morelos", km: 75, puebloMagico: false },
  { name: "Temixco", state: "Morelos", km: 85, puebloMagico: false },
  { name: "Tres Marías", state: "Morelos", km: 60, puebloMagico: false },
  { name: "Tlayacapan", state: "Morelos", km: 85, puebloMagico: true },
  { name: "Totolapan", state: "Morelos", km: 80, puebloMagico: false },
  { name: "Xochitepec", state: "Morelos", km: 95, puebloMagico: true },
  { name: "Yecapixtla", state: "Morelos", km: 100, puebloMagico: false },
  { name: "Tepoztlán", state: "Morelos", km: 80, puebloMagico: true },
  { name: "Atlixco", state: "Puebla", km: 130, puebloMagico: true },
  { name: "Chignahuapan", state: "Puebla", km: 190, puebloMagico: true },
  { name: "Hacienda de Chautla", state: "Puebla", km: 90, puebloMagico: false },
  { name: "San Andrés Calpan", state: "Puebla", km: 130, puebloMagico: false },
  { name: "San Andrés Cholula", state: "Puebla", km: 120, puebloMagico: true },
  { name: "Ruta de los volcanes", state: "Puebla y Morelos", km: 90, puebloMagico: false },
  { name: "Peña de Bernal", state: "Querétaro", km: 215, puebloMagico: true },
  { name: "Querétaro", state: "Querétaro", km: 210, puebloMagico: false },
  { name: "Tequisquiapan", state: "Querétaro", km: 190, puebloMagico: true },
  { name: "Huamantla", state: "Tlaxcala", km: 140, puebloMagico: true },
  { name: "Val’Quirico", state: "Tlaxcala", km: 110, puebloMagico: false },
  { name: "Tlaxco", state: "Tlaxcala", km: 150, puebloMagico: true },
  { name: "Tlaxcala", state: "Tlaxcala", km: 130, puebloMagico: false },
  { name: "Cardel", state: "Veracruz", km: 390, puebloMagico: false },
  { name: "Chachalacas", state: "Veracruz", km: 400, puebloMagico: false },
  { name: "Puerto de Veracruz", state: "Veracruz", km: 410, puebloMagico: false },
];

export const products = [
  { id: "playera-oficial", category: "Colección 01", title: "Playera oficial", description: "El parche en el pecho. La carretera por delante.", paymentUrl: "" },
  { id: "hoodie-chilangos", category: "Colección 01", title: "Hoodie Chilangos", description: "Para las rodadas tempraneras y los afters largos.", paymentUrl: "" },
  { id: "parche-oficial", category: "Colección 01", title: "Parche del club", description: "Una historia bordada que se gana kilómetro a kilómetro.", paymentUrl: "" },
  { id: "gorra-chilangos", category: "Colección 01", title: "Gorra Chilangos", description: "Para cuando el casco descansa, pero el estilo no.", paymentUrl: "" },
];

export const roadTripKilometers = rides.reduce((total, ride) => total + ride.roundTripKm, 0);
