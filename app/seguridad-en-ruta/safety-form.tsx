"use client";

import { useState, type FormEvent } from "react";

type SubmissionState = "idle" | "sending" | "success" | "error";

export default function SafetyForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = Object.fromEntries(values.entries());

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/seguridad-en-ruta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { received?: boolean; error?: string };

      if (!response.ok || !result.received) throw new Error(result.error ?? "No pudimos guardar tu ficha.");

      form.reset();
      setState("success");
      setMessage("Ficha recibida. La información quedó en el panel privado de seguridad de Chilangos RC.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pudimos guardar tu ficha. Inténtalo de nuevo.");
    }
  }

  return (
    <form className="safety-form" onSubmit={submit}>
      <section className="safety-form-section">
        <div className="safety-form-heading"><span>IDENTIDAD Y CONTACTO</span><h2>¿Quién rueda con nosotros?</h2></div>
        <div className="safety-form-grid">
          <label><span>Nombre completo <em>REQUERIDO</em></span><input name="fullName" autoComplete="name" maxLength={140} required /></label>
          <label><span>Nickname / alias <em>REQUERIDO</em></span><input name="alias" maxLength={80} required /></label>
          <label><span>WhatsApp / teléfono <em>REQUERIDO</em></span><input name="phone" type="tel" autoComplete="tel" maxLength={35} required /></label>
          <label><span>Correo electrónico</span><input name="email" type="email" autoComplete="email" maxLength={180} /></label>
          <label><span>Fecha de nacimiento <em>REQUERIDO</em></span><input name="birthDate" type="date" autoComplete="bday" required /></label>
          <label><span>Tipo de sangre</span><select name="bloodType" defaultValue=""><option value="">Prefiero dejarlo vacío</option>{["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "No lo sé"].map((type) => <option key={type}>{type}</option>)}</select></label>
        </div>
      </section>

      <section className="safety-form-section">
        <div className="safety-form-heading"><span>RESPUESTA EN EMERGENCIA</span><h2>Datos que pueden ayudar en carretera.</h2></div>
        <div className="safety-form-grid">
          <label className="safety-form-wide"><span>Alergias o condiciones médicas relevantes</span><textarea name="medicalNotes" maxLength={1200} rows={4} placeholder="Incluye solo información que debamos conocer durante una emergencia. Puedes escribir N/A." /></label>
          <label><span>Contacto de emergencia <em>REQUERIDO</em></span><input name="emergencyContactName" maxLength={140} required /></label>
          <label><span>Teléfono de emergencia <em>REQUERIDO</em></span><input name="emergencyContactPhone" type="tel" maxLength={35} required /></label>
          <label className="safety-form-wide"><span>Institución de salud / seguridad social</span><input name="healthInstitution" maxLength={180} placeholder="IMSS, ISSSTE, privada, otra o N/A" /></label>
        </div>
      </section>

      <section className="safety-form-section">
        <div className="safety-form-heading"><span>MOTO Y COBERTURA</span><h2>Seguro vigente para salir con la banda.</h2><p>Contar con seguro de motocicleta vigente es requisito para participar en rodadas de Chilangos RC.</p></div>
        <div className="safety-form-grid">
          <label><span>¿Tu seguro está vigente? <em>REQUERIDO</em></span><select name="insuranceActive" defaultValue="" required><option value="" disabled>Selecciona</option><option value="si">Sí, está vigente</option><option value="no">No está vigente</option></select></label>
          <label><span>Modelo de la motocicleta <em>REQUERIDO</em></span><input name="motorcycleModel" maxLength={160} required /></label>
          <label><span>Año</span><input name="motorcycleYear" inputMode="numeric" maxLength={4} /></label>
          <label><span>Cilindrada (cc)</span><input name="engineCc" inputMode="numeric" maxLength={8} /></label>
          <label><span>Placas</span><input name="plates" maxLength={20} /></label>
          <label className="safety-form-wide"><span>Detalles básicos de la póliza</span><textarea name="policyDetails" maxLength={800} rows={3} placeholder="Aseguradora, vigencia y últimos 4 caracteres. No compartas el número completo ni subas documentos." /></label>
        </div>
      </section>

      <div className="safety-honeypot" aria-hidden="true"><label>No completes este campo<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="safety-consent"><input type="checkbox" name="consent" value="acepto" required /><span>Confirmo que los datos son correctos y autorizo su uso privado exclusivamente para coordinación, seguridad y respuesta ante emergencias durante actividades de Chilangos RC.</span></label>
      <div className="safety-submit"><button type="submit" disabled={state === "sending"}>{state === "sending" ? "Guardando ficha…" : "Enviar ficha privada ↗"}</button><p>No se publica automáticamente ningún dato de este formulario.</p></div>
      <p className={`safety-message ${state}`} aria-live="polite">{message}</p>
    </form>
  );
}
