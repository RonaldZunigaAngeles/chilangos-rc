"use client";

import { useState, type FormEvent } from "react";

type SubmissionState = "idle" | "sending" | "success" | "error";

export default function CollaborationForm() {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      contactName: values.get("contactName"),
      businessName: values.get("businessName"),
      businessType: values.get("businessType"),
      location: values.get("location"),
      email: values.get("email"),
      phone: values.get("phone"),
      instagram: values.get("instagram"),
      proposal: values.get("proposal"),
      website: values.get("website"),
    };

    if (!payload.email && !payload.phone) {
      setState("error");
      setMessage("Compártenos un correo o WhatsApp para poder contactarte.");
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/colaboraciones", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { received?: boolean; error?: string };

      if (!response.ok || !result.received) {
        throw new Error(result.error ?? "No pudimos recibir tu propuesta. Inténtalo nuevamente.");
      }

      form.reset();
      setState("success");
      setMessage("¡Propuesta recibida! La revisaremos y te contactaremos para platicar los detalles.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "No pudimos recibir tu propuesta. Inténtalo nuevamente.");
    }
  }

  return (
    <section className="collaboration-panel" id="colaboraciones" aria-labelledby="collaboration-heading">
      <div className="collaboration-intro">
        <span>ALIANZAS CON IDENTIDAD BIKER</span>
        <h3 id="collaboration-heading">¿Quieres recibir<br /><em>a la banda?</em></h3>
        <p>Cuéntanos sobre tu negocio, tu espacio o tu proyecto. Si encontramos una buena ruta en común, nos pondremos en contacto para acordar los detalles.</p>
        <div className="collaboration-principles"><span>TALLERES Y MARCAS</span><span>BARES Y RESTAURANTES</span><span>HOTELES Y EXPERIENCIAS</span></div>
      </div>

      <form className="collaboration-form" onSubmit={submit}>
        <div className="collaboration-field"><label htmlFor="collaboration-contact">Tu nombre</label><input id="collaboration-contact" name="contactName" autoComplete="name" maxLength={100} required placeholder="¿Con quién vamos a platicar?" /></div>
        <div className="collaboration-field"><label htmlFor="collaboration-business">Nombre de tu negocio</label><input id="collaboration-business" name="businessName" autoComplete="organization" maxLength={140} required placeholder="Así se llama nuestro espacio" /></div>
        <div className="collaboration-field"><label htmlFor="collaboration-type">Tipo de negocio</label><select id="collaboration-type" name="businessType" defaultValue="" required><option value="" disabled>Selecciona una opción</option><option>Bar o punto biker</option><option>Restaurante o cafetería</option><option>Taller o agencia</option><option>Hotel o destino</option><option>Marca, equipo o accesorios</option><option>Experiencia, fotografía u otro</option></select></div>
        <div className="collaboration-field"><label htmlFor="collaboration-location">Ciudad o ubicación</label><input id="collaboration-location" name="location" autoComplete="address-level2" maxLength={160} required placeholder="¿Dónde podemos encontrarte?" /></div>
        <div className="collaboration-field"><label htmlFor="collaboration-email">Correo electrónico</label><input id="collaboration-email" name="email" type="email" autoComplete="email" maxLength={180} placeholder="hola@tunegocio.com" /></div>
        <div className="collaboration-field"><label htmlFor="collaboration-phone">WhatsApp de contacto</label><input id="collaboration-phone" name="phone" type="tel" autoComplete="tel" maxLength={35} placeholder="Un número para contactarte" /></div>
        <div className="collaboration-field collaboration-field-wide"><label htmlFor="collaboration-instagram">Instagram de tu negocio <span>OPCIONAL</span></label><input id="collaboration-instagram" name="instagram" maxLength={100} placeholder="@tu_negocio" /></div>
        <div className="collaboration-field collaboration-field-wide"><label htmlFor="collaboration-proposal">Cuéntanos tu propuesta</label><textarea id="collaboration-proposal" name="proposal" maxLength={2500} required placeholder="¿Cómo te gustaría recibirnos o qué colaboración tienes en mente?" /></div>
        <div className="collaboration-honeypot" aria-hidden="true"><label htmlFor="collaboration-website">No completes este campo</label><input id="collaboration-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className="collaboration-submit"><button type="submit" disabled={state === "sending"}>{state === "sending" ? "Enviando propuesta…" : "Enviar propuesta a Chilangos RC ↗"}</button><span>Usaremos tus datos únicamente para responder a tu propuesta.</span></div>
        <p className={`collaboration-message ${state}`} aria-live="polite">{message}</p>
      </form>
    </section>
  );
}
