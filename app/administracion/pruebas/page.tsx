import type { Metadata } from "next";
import Link from "next/link";
import { requireClubAdministrator } from "../access";
import QuestionnaireQaRunner from "./qa-runner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pruebas funcionales | Chilangos RC",
  description: "Panel privado de pruebas con datos ficticios para validar los cuestionarios de Chilangos RC.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function QuestionnaireQaPage() {
  await requireClubAdministrator("/administracion/pruebas");

  return (
    <main className="qa-page">
      <header className="member-admin-topbar section-shell"><Link className="wordmark" href="/">CHILANGOS <span>RC</span></Link><div className="admin-topbar-links"><Link href="/administracion/cuestionarios">Historias</Link><Link href="/administracion/seguridad">Seguridad</Link></div></header>
      <section className="section-shell qa-shell">
        <div className="qa-heading"><span>ACCESO PRIVADO · PRUEBAS FUNCIONALES</span><h1>Antes de salir,<br /><em>revisamos todo.</em></h1><p>Genera registros ficticios, comprueba cada formulario y verifica que las respuestas, fotografías y alertas lleguen a su destino. Después puedes borrar únicamente los datos creados por esa ejecución.</p></div>
        <QuestionnaireQaRunner />
      </section>
    </main>
  );
}
