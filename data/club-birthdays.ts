export type ClubBirthday = {
  alias: string;
  slug: string;
  day: number;
  month: number;
};

export const birthdayMonths = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Los años de nacimiento no se almacenan ni se publican: basta el día y mes
// para festejar a la banda sin exponer información personal innecesaria.
export const clubBirthdays: ClubBirthday[] = [
  { alias: "Adri", slug: "adri", day: 3, month: 1 },
  { alias: "Gi", slug: "gi", day: 6, month: 1 },
  { alias: "Fátima", slug: "fatima", day: 31, month: 1 },
  { alias: "Ángel", slug: "angel", day: 13, month: 2 },
  { alias: "Rafa", slug: "rafa", day: 24, month: 3 },
  { alias: "Charly", slug: "charly", day: 1, month: 4 },
  { alias: "Inra", slug: "isra", day: 28, month: 4 },
  { alias: "Fer", slug: "fer", day: 30, month: 5 },
  { alias: "Seb", slug: "seb", day: 19, month: 6 },
  { alias: "Richard", slug: "richard", day: 10, month: 7 },
  { alias: "Mac", slug: "mac", day: 5, month: 8 },
  { alias: "Austria", slug: "austria", day: 17, month: 8 },
  { alias: "Ronnie", slug: "ronnie", day: 30, month: 8 },
  { alias: "Alej", slug: "alej", day: 24, month: 11 },
  { alias: "Rulo", slug: "rulo", day: 27, month: 12 },
];

function dateNumber(year: number, month: number, day: number) {
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
}

export function mexicoToday(reference = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(reference);

  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return { year, month, day };
}

export function nextBirthdayYear(birthday: ClubBirthday, today = mexicoToday()) {
  return birthday.month < today.month || (birthday.month === today.month && birthday.day < today.day)
    ? today.year + 1
    : today.year;
}

export function googleBirthdayLink(birthday: ClubBirthday, today = mexicoToday()) {
  const year = nextBirthdayYear(birthday, today);
  const followingDay = new Date(Date.UTC(year, birthday.month - 1, birthday.day + 1));
  const begins = dateNumber(year, birthday.month, birthday.day);
  const ends = dateNumber(followingDay.getUTCFullYear(), followingDay.getUTCMonth() + 1, followingDay.getUTCDate());
  const parameters = new URLSearchParams({
    action: "TEMPLATE",
    text: `Cumpleaños de ${birthday.alias} · Chilangos RC`,
    dates: `${begins}/${ends}`,
    details: "Un año más de historia para nuestra familia Chilanga. Juntos vamos, juntos regresamos.",
    recur: "RRULE:FREQ=YEARLY",
  });

  return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
}
