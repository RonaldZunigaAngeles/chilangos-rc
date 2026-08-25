import type { Metadata } from "next";
import Link from "next/link";
import { requireClubAdministrator } from "../administracion/access";
import BikerQuestionnaire from "../components/biker-questionnaire";
import { club } from "../data/chilangos";
import { bikerQuestionCount } from "../data/questionnaire";

const title = "Tu historia biker | Chilangos RC";
const description = "Cuéntanos cómo comenzó tu historia sobre dos ruedas, qué significa la hermandad y qué sueños todavía quieres rodar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cuestionario" },
  openGraph: { title, description, url: "/cuestionario", images: [{ url: "/og.png", width: 1731, height: 909, alt: "Chilangos RC — Hermandad en cada kilómetro" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const dynamic = "force-dynamic";

export default async function QuestionnairePage() {
  await requireClubAdministrator("/cuestionario");

  return (
    <main className="questionnaire-page">
      <header className="questionnaire-topbar section-shell">
        <Link className="wordmark" href="/" aria-label="Volver al inicio de Chilangos RC">CHILANGOS <span>RC</span></Link>
        <Link className="questionnaire-home" href="/">← Volver al club</Link>
      </header>

      <section className="questionnaire-intro section-shell">
        <p className="eyebrow">Chilangos RC · Historias que se ruedan</p>
        <h1>Debajo del casco<br /><em>hay una historia.</em></h1>
        <p>Cada integrante llegó a la carretera por un camino distinto. Este espacio es para contar el tuyo: sin poses, sin respuestas correctas y sin compartir lo que no quieras.</p>
        <div className="questionnaire-intro-meta">
          <span>10 capítulos</span>
          <span>{bikerQuestionCount} preguntas para elegir</span>
          <span>Tu ritmo · Tu privacidad</span>
        </div>
      </section>

      <BikerQuestionnaire />

      <footer className="questionnaire-footer section-shell">
        <span>CHILANGOS RC · CIUDAD DE MÉXICO</span>
        <div className="questionnaire-social-links" aria-label="Redes sociales de Chilangos RC"><a href={club.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={club.facebook} target="_blank" rel="noreferrer">Facebook ↗</a></div>
        <span>La verdadera familia no se elige. Se rueda.</span>
      </footer>
    </main>
  );
}
