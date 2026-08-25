export type ClubNotice = {
  title: string;
  effectiveDate: string;
  statement: string;
};

// Publica aquí únicamente comunicados confirmados por la administración del club.
// Nunca incluyas teléfonos, domicilios, datos médicos ni motivos privados.
export const clubNotices: ClubNotice[] = [];
