import { birthdayMonths, clubBirthdays, googleBirthdayLink, mexicoToday, nextBirthdayYear } from "../data/club-birthdays";

export default function BirthdayCalendar() {
  const today = mexicoToday();
  const ordered = [...clubBirthdays].sort((first, second) => {
    const firstDate = `${nextBirthdayYear(first, today)}-${String(first.month).padStart(2, "0")}-${String(first.day).padStart(2, "0")}`;
    const secondDate = `${nextBirthdayYear(second, today)}-${String(second.month).padStart(2, "0")}-${String(second.day).padStart(2, "0")}`;
    return firstDate.localeCompare(secondDate);
  });
  const next = ordered[0];

  return (
    <div className="birthday-calendar">
      <div className="birthday-upcoming">
        <div className="birthday-upcoming-date"><strong>{String(next.day).padStart(2, "0")}</strong><span>{birthdayMonths[next.month - 1]}</span></div>
        <div className="birthday-upcoming-copy"><span>LA PRÓXIMA CELEBRACIÓN DE LA BANDA</span><h3>Le toca a <a href={`/integrantes/${next.slug}`}>{next.alias}</a>.</h3><p>Quince historias, un montón de kilómetros y suficientes pretextos para celebrar juntos.</p></div>
        <a className="birthday-upcoming-save" href={googleBirthdayLink(next, today)} target="_blank" rel="noreferrer">Agregar a Google Calendar ↗</a>
      </div>

      <div className="birthday-month-grid" aria-label="Calendario anual de cumpleaños de Chilangos RC">
        {birthdayMonths.map((monthName, index) => {
          const month = index + 1;
          const birthdays = clubBirthdays.filter((birthday) => birthday.month === month);

          return (
            <article className={`birthday-month-card${month === today.month ? " birthday-current-month" : ""}${birthdays.length === 0 ? " birthday-empty-month" : ""}`} key={monthName}>
              <div className="birthday-month-heading"><h3>{monthName}</h3>{month === today.month && <span>ESTE MES</span>}</div>
              {birthdays.length > 0 ? (
                <div className="birthday-events">
                  {birthdays.map((birthday) => (
                    <div className="birthday-event" key={birthday.slug}>
                      <a className="birthday-event-person" href={`/integrantes/${birthday.slug}`}><span>{String(birthday.day).padStart(2, "0")}</span><strong>{birthday.alias}</strong></a>
                      <a className="birthday-event-save" href={googleBirthdayLink(birthday, today)} target="_blank" rel="noreferrer" aria-label={`Agregar el cumpleaños de ${birthday.alias} a Google Calendar`}>AGENDAR ↗</a>
                    </div>
                  ))}
                </div>
              ) : <p className="birthday-month-empty">La banda guarda espacio para la siguiente historia.</p>}
            </article>
          );
        })}
      </div>

      <p className="birthday-privacy-note">Celebramos a la familia sin publicar edades ni años de nacimiento. Cada evento puede agregarse como recordatorio anual en Google Calendar.</p>
    </div>
  );
}
