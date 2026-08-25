import type { Metadata } from "next";
import Link from "next/link";
import SafetyForm from "./safety-form";

export const metadata: Metadata = {
  title: "Ficha privada de seguridad | Chilangos RC",
  description: "Registro privado de seguridad para participar en rodadas de Chilangos RC.",
  robots: { index: false, follow: false, nocache: true },
};

export default function SafetyPage() {
  return (
    <main className="safety-page">
      <header className="safety-topbar section-shell"><Link className="wordmark" href="/">CHILANGOS <span>RC</span></Link><Link href="/#garage">Volver al código de ruta</Link></header>
      <section className="section-shell safety-shell">
        <div className="safety-intro"><span>USO PRIVADO · SEGURIDAD EN RUTA</span><h1>Juntos vamos.<br /><em>Juntos regresamos.</em></h1><p>Esta ficha permite que la coordinación tenga datos básicos de contacto, emergencia, motocicleta y seguro cuando ruedas con Chilangos RC. Completa únicamente información vigente.</p></div>
        <div className="safety-privacy"><strong>Tus datos no forman parte de tu biografía pública.</strong><p>Solo la administración autorizada del club puede consultar estas respuestas. Se usan para organizar la rodada y responder ante una emergencia; no se venden, no se comparten con fines comerciales y no se publican.</p></div>
        <div className="safety-requirements"><div><strong>Seguro vigente</strong><span>Requisito para rodar con el club.</span></div><div><strong>Ficha completa</strong><span>Requisito de seguridad para cada participante.</span></div><div><strong>Datos actuales</strong><span>Actualízalos cuando cambien.</span></div></div>
        <SafetyForm />
      </section>
    </main>
  );
}
