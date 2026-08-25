import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { rideSafetySubmissions } from "../../../db/schema";
import { requireClubAdministrator } from "../access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fichas de seguridad | Chilangos RC",
  description: "Panel privado de fichas de seguridad de Chilangos RC.",
  robots: { index: false, follow: false, nocache: true },
};

function item(label: string, value?: string | null) {
  return value ? <div className="member-admin-answer"><span>{label}</span><p>{value}</p></div> : null;
}

export default async function SafetyAdministrationPage() {
  await requireClubAdministrator("/administracion/seguridad");
  const submissions = await getDb().select().from(rideSafetySubmissions).orderBy(desc(rideSafetySubmissions.createdAt));

  return (
    <main className="member-admin-page">
      <header className="member-admin-topbar section-shell"><Link className="wordmark" href="/">CHILANGOS <span>RC</span></Link><div className="admin-topbar-links"><Link href="/administracion/pruebas">Pruebas QA</Link><Link href="/administracion/cuestionarios">Historias</Link><Link href="/seguridad-en-ruta">Abrir ficha ↗</Link></div></header>
      <section className="section-shell member-admin-shell">
        <div className="member-admin-heading"><span>ACCESO PRIVADO · DATOS SENSIBLES</span><h1>Seguridad<br /><em>antes de arrancar.</em></h1><p>Consulta estos datos únicamente para coordinar rodadas o responder ante una emergencia. No copies información médica, contactos o pólizas a páginas públicas.</p><strong>{submissions.length} {submissions.length === 1 ? "ficha recibida" : "fichas recibidas"}</strong></div>
        {submissions.length === 0 ? <div className="member-admin-empty"><strong>Todavía no hay fichas.</strong><p>Comparte el formulario privado con cada persona que quiera rodar con Chilangos RC.</p><Link href="/seguridad-en-ruta">Abrir ficha de seguridad ↗</Link></div> : (
          <div className="member-admin-list">{submissions.map((submission) => (
            <details className="member-admin-card" key={submission.id}>
              <summary><div><span>{submission.createdAt}</span><strong>{submission.alias}</strong><small className={submission.insuranceActive === "si" ? "safety-insured" : "safety-uninsured"}>{submission.insuranceActive === "si" ? "SEGURO VIGENTE DECLARADO" : "SIN SEGURO VIGENTE · NO ELEGIBLE PARA RODAR"}</small></div><span>VER FICHA ↓</span></summary>
              <div className="member-admin-content">
                <section className="member-admin-section"><h2>Identidad y contacto</h2><div className="member-admin-grid">{item("Nombre completo", submission.fullName)}{item("Alias", submission.alias)}{item("WhatsApp / teléfono", submission.phone)}{item("Correo", submission.email)}{item("Fecha de nacimiento", submission.birthDate)}{item("Tipo de sangre", submission.bloodType)}</div></section>
                <section className="member-admin-section"><h2>Emergencia y salud</h2><div className="member-admin-grid">{item("Alergias o condiciones", submission.medicalNotes)}{item("Contacto de emergencia", submission.emergencyContactName)}{item("Teléfono de emergencia", submission.emergencyContactPhone)}{item("Institución de salud", submission.healthInstitution)}</div></section>
                <section className="member-admin-section"><h2>Motocicleta y seguro</h2><div className="member-admin-grid">{item("Seguro vigente", submission.insuranceActive === "si" ? "Sí" : "No")}{item("Modelo", submission.motorcycleModel)}{item("Año", submission.motorcycleYear)}{item("Cilindrada", submission.engineCc ? `${submission.engineCc} cc` : null)}{item("Placas", submission.plates)}{item("Detalles básicos de la póliza", submission.policyDetails)}</div></section>
              </div>
            </details>
          ))}</div>
        )}
      </section>
    </main>
  );
}
