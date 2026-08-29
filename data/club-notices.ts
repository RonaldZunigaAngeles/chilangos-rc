export type ClubNotice = {
  folio: string;
  title: string;
  effectiveDate: string;
  imageSrc: string;
};

// Publica aquí únicamente comunicados confirmados por la administración del club.
// Nunca incluyas teléfonos, domicilios, datos médicos ni motivos privados.
export const clubNotices: ClubNotice[] = [
  {
    folio: "CRC-COM-2025-002",
    title: "Conclusión de membresía · Rodas",
    effectiveDate: "9 de septiembre de 2025",
    imageSrc: "/notices/2025-09-09-rodas.webp",
  },
  {
    folio: "CRC-COM-2025-001",
    title: "Conclusión de membresía · Pituko",
    effectiveDate: "5 de septiembre de 2025",
    imageSrc: "/notices/2025-09-05-pituko.webp",
  },
  {
    folio: "CRC-COM-2024-001",
    title: "Conclusión de membresía · Yisus",
    effectiveDate: "14 de marzo de 2024",
    imageSrc: "/notices/2024-03-14-yisus.webp",
  },
  {
    folio: "CRC-COM-2023-001",
    title: "Conclusión de membresía · Guicho",
    effectiveDate: "14 de diciembre de 2023",
    imageSrc: "/notices/2023-12-14-guicho.webp",
  },
];
