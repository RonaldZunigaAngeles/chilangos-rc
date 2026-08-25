import type { Metadata } from "next";
import Link from "next/link";
import { requireClubAdministrator } from "../administracion/access";
import { isRegistrationHostname } from "../site-access";
import QuestionnaireForm from "./questionnaire-form";

export const metadata: Metadata = {
  title: "Cuestionario interno | Chilangos RC",
  description: "Formulario interno para recopilar la historia de cada integrante de Chilangos RC.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function CuestionarioIntegrantesPage() {
  if (!(await isRegistrationHostname())) {
    await requireClubAdministrator("/cuestionario-integrantes");
  }

  return (
    <main className="member-intake-page">
      <header className="member-intake-topbar section-shell">
        <Link className="wordmark" href="/" aria-label="Volver al inicio de Chilangos RC">CHILANGOS <span>RC</span></Link>
        <Link className="member-intake-home" href="/">← Volver al club</Link>
      </header>
      <div className="section-shell member-intake-shell">
        <div className="member-intake-header">
          <span>ENTRE CHILANGOS · TU HISTORIA QUEDA EN FAMILIA</span>
          <h1>¡Hola, Chilango!<br /><em>Queremos conocer tu historia.</em></h1>
          <p>Antes de los kilómetros, las motos y los parches, estamos las personas que hacemos de esta banda una familia. Cuéntanos quién eres, qué te mueve y cuáles son esos recuerdos que te trajeron hasta aquí. Manejes tu propia moto o compartas la rodada como partner, tu historia también merece un lugar en Chilangos RC.</p>
        </div>
        <QuestionnaireForm />
      </div>
    </main>
  );
}
