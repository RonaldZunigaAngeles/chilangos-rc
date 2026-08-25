import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { questionnaireSubmissions } from "../../../db/schema";
import { requireClubAdministrator } from "../access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historias recibidas | Chilangos RC",
  description: "Administración privada de las historias compartidas por integrantes de Chilangos RC.",
  robots: { index: false, follow: false, nocache: true },
};

type MotorcycleAnswer = {
  brand?: string;
  model?: string;
  year?: string;
  period?: string;
  color?: string;
  engine?: string;
  name?: string;
  since?: string;
  story?: string;
  photoKey?: string | null;
};

type AwardAnswer = {
  title?: string;
  year?: string;
  story?: string;
};

type StoredAnswers = {
  memberType?: string;
  joinedClub?: string;
  ridesWith?: string;
  inicios?: string;
  biografia?: string;
  llegadaClub?: string;
  significadoClub?: string;
  filosofia?: string;
  experienciaPartner?: string;
  currentMotorcycle?: MotorcycleAnswer;
  previousMotorcycles?: MotorcycleAnswer[];
  dreamMotorcycle?: MotorcycleAnswer;
  bikerCulture?: {
    favoriteMovie?: string;
    favoriteSeries?: string;
    character?: string;
    iconicMotorcycle?: string;
    roadSong?: string;
    style?: string;
    favoriteScene?: string;
  };
  rutaFavorita?: string;
  rutaSonada?: string;
  paradaFavorita?: string;
  indispensableRodada?: string;
  pasiones?: string;
  hobbies?: string;
  anecdotaBanda?: string;
  awards?: AwardAnswer[];
  aporteClub?: string;
  mensajeBanda?: string;
  notas?: string;
  publicationConsent?: string;
};

function parseAnswers(serialized: string): StoredAnswers {
  try {
    return JSON.parse(serialized) as StoredAnswers;
  } catch {
    return {};
  }
}

function answer(label: string, value?: string | null) {
  return value ? <div className="member-admin-answer"><span>{label}</span><p>{value}</p></div> : null;
}

function photoUrl(submissionId: string, key: string) {
  return `/api/administracion/foto?registro=${encodeURIComponent(submissionId)}&archivo=${encodeURIComponent(key)}`;
}

function memberTypeLabel(value?: string) {
  if (value === "partner") return "Partner";
  if (value === "biker-partner") return "Biker y partner";
  return "Biker";
}

function consentLabel(value?: string) {
  if (value === "publicar-no-sensible") return "Autoriza publicar datos no sensibles";
  if (value === "solo-interno") return "Solo uso interno; no publicar";
  return "Quiere revisar su biografía antes de publicar";
}

export default async function QuestionnaireAdministrationPage() {
  await requireClubAdministrator("/administracion/cuestionarios");

  const submissions = await getDb()
    .select()
    .from(questionnaireSubmissions)
    .orderBy(desc(questionnaireSubmissions.createdAt));

  return (
    <main className="member-admin-page">
      <header className="member-admin-topbar section-shell"><Link className="wordmark" href="/">CHILANGOS <span>RC</span></Link><div className="admin-topbar-links"><Link href="/administracion/pruebas">Pruebas QA</Link><Link href="/administracion/seguridad">Fichas de seguridad</Link><Link href="/cuestionario-integrantes">Abrir cuestionario ↗</Link></div></header>

      <section className="section-shell member-admin-shell">
        <div className="member-admin-heading"><span>ACCESO PRIVADO · SOLO ADMINISTRACIÓN</span><h1>Las historias<br /><em>que llegan a la familia.</em></h1><p>Aquí puedes revisar las respuestas, fotografías, motocicletas y premios enviados por cada integrante. Nada se publica automáticamente.</p><strong>{submissions.length} {submissions.length === 1 ? "historia recibida" : "historias recibidas"}</strong></div>

        {submissions.length === 0 ? (
          <div className="member-admin-empty"><strong>El primer capítulo todavía no llega.</strong><p>Comparte el cuestionario con la banda. Cuando alguien lo complete, su historia aparecerá aquí.</p><Link href="/cuestionario-integrantes">Ver cuestionario ↗</Link></div>
        ) : (
          <div className="member-admin-list">{submissions.map((submission) => {
            const answers = parseAnswers(submission.answersJson);
            const currentMotorcycle = answers.currentMotorcycle;
            const culture = answers.bikerCulture ?? {};

            return (
              <details className="member-admin-card" key={submission.id}>
                <summary><div><span>{memberTypeLabel(answers.memberType)} · {submission.createdAt}</span><strong>{submission.alias}</strong><small>{consentLabel(answers.publicationConsent)}</small></div><span>VER HISTORIA ↓</span></summary>

                <div className="member-admin-content">
                  <section className="member-admin-section"><h2>Identidad y contacto</h2><div className="member-admin-grid">{answer("Apodo", submission.alias)}{answer("Nombre completo · interno", submission.fullName)}{answer("Edad", submission.age)}{answer("WhatsApp · interno", submission.phone)}{answer("Padrino o madrina", submission.sponsor)}{answer("Parte del club desde", answers.joinedClub)}{answer("Comparte la rodada con", answers.ridesWith)}</div>{submission.profilePhotoKey && <a className="member-admin-photo" href={photoUrl(submission.id, submission.profilePhotoKey)} target="_blank" rel="noreferrer">Ver fotografía de perfil ↗</a>}</section>

                  <section className="member-admin-section"><h2>Su historia y la familia</h2><div className="member-admin-grid">{answer("Cómo empezó", answers.inicios)}{answer("Biografía", answers.biografia)}{answer("Cómo llegó a Chilangos", answers.llegadaClub)}{answer("Qué significa el club", answers.significadoClub)}{answer("Filosofía personal", answers.filosofia)}{answer("Experiencia como partner", answers.experienciaPartner)}</div></section>

                  {(currentMotorcycle?.brand || currentMotorcycle?.model) && <section className="member-admin-section"><h2>Motocicleta actual</h2><div className="member-admin-grid">{answer("Marca", currentMotorcycle.brand)}{answer("Modelo", currentMotorcycle.model)}{answer("Año", currentMotorcycle.year)}{answer("Color", currentMotorcycle.color)}{answer("Motor", currentMotorcycle.engine)}{answer("Nombre de la moto", currentMotorcycle.name)}{answer("La tiene desde", currentMotorcycle.since)}{answer("Su historia", currentMotorcycle.story)}</div>{submission.motorcyclePhotoKey && <a className="member-admin-photo" href={photoUrl(submission.id, submission.motorcyclePhotoKey)} target="_blank" rel="noreferrer">Ver fotografía de la motocicleta ↗</a>}</section>}

                  {(answers.previousMotorcycles?.length ?? 0) > 0 && <section className="member-admin-section"><h2>Garage e historial de motocicletas</h2><div className="member-admin-motorcycles">{answers.previousMotorcycles?.map((motorcycle, index) => <article className="member-admin-motorcycle" key={`${motorcycle.brand}-${motorcycle.model}-${index}`}><strong>{motorcycle.brand} {motorcycle.model}</strong><span>{[motorcycle.year, motorcycle.period, motorcycle.name].filter(Boolean).join(" · ")}</span>{motorcycle.story && <p>{motorcycle.story}</p>}{motorcycle.photoKey && <a href={photoUrl(submission.id, motorcycle.photoKey)} target="_blank" rel="noreferrer">Ver fotografía ↗</a>}</article>)}</div></section>}

                  {(answers.dreamMotorcycle?.brand || answers.dreamMotorcycle?.model) && <section className="member-admin-section"><h2>La moto de sus sueños</h2><div className="member-admin-grid">{answer("Marca", answers.dreamMotorcycle?.brand)}{answer("Modelo", answers.dreamMotorcycle?.model)}{answer("Por qué es especial", answers.dreamMotorcycle?.story)}</div></section>}

                  <section className="member-admin-section"><h2>Cultura biker, rutas y gustos</h2><div className="member-admin-grid">{answer("Película favorita", culture.favoriteMovie)}{answer("Serie favorita", culture.favoriteSeries)}{answer("Personaje biker", culture.character)}{answer("Moto icónica", culture.iconicMotorcycle)}{answer("Canción de carretera", culture.roadSong)}{answer("Estilo biker", culture.style)}{answer("Escena inolvidable", culture.favoriteScene)}{answer("Ruta favorita", answers.rutaFavorita)}{answer("Ruta soñada", answers.rutaSonada)}{answer("Parada favorita", answers.paradaFavorita)}{answer("Indispensable en una salida", answers.indispensableRodada)}{answer("Pasiones", answers.pasiones)}{answer("Hobbies", answers.hobbies)}{answer("Anécdota con la banda", answers.anecdotaBanda)}</div></section>

                  {(answers.awards?.length ?? 0) > 0 && <section className="member-admin-section"><h2>Chilangos Awards</h2><div className="member-admin-awards">{answers.awards?.map((award, index) => <article key={`${award.title}-${award.year}-${index}`}><strong>{award.title || "Categoría pendiente"}</strong>{award.year && <span>{award.year}</span>}{award.story && <p>{award.story}</p>}</article>)}</div></section>}

                  <section className="member-admin-section"><h2>El cierre de su historia</h2><div className="member-admin-grid">{answer("Lo que aporta al club", answers.aporteClub)}{answer("Mensaje para la banda", answers.mensajeBanda)}{answer("Notas adicionales", answers.notas)}{answer("Autorización de publicación", consentLabel(answers.publicationConsent))}</div></section>
                </div>
              </details>
            );
          })}</div>
        )}
      </section>
    </main>
  );
}
