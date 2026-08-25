"use client";

import { useState, type FormEvent } from "react";
import { chilangoAwardCategories } from "../data/club-awards";

type Status = "idle" | "sending" | "success" | "error";
type MemberType = "biker" | "partner" | "biker-partner";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 32 * 1024 * 1024;
const MAX_PREVIOUS_MOTORCYCLES = 10;
const MAX_AWARDS = 5;

export default function QuestionnaireForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [memberType, setMemberType] = useState<MemberType>("biker");
  const [previousMotorcycleCount, setPreviousMotorcycleCount] = useState(1);
  const [awardCount, setAwardCount] = useState(0);
  const hasOwnMotorcycle = memberType !== "partner";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const images = Array.from(formData.values()).filter((value): value is File => value instanceof File && value.size > 0);

    if (images.some((file) => file.size > MAX_IMAGE_BYTES)) {
      setStatus("error");
      setMessage("Cada fotografía debe pesar máximo 8 MB.");
      return;
    }

    if (images.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_IMAGE_BYTES) {
      setStatus("error");
      setMessage("En conjunto, tus fotografías deben pesar máximo 32 MB.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/cuestionario-integrantes", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json() as { received?: boolean; error?: string };

      if (!response.ok || !result.received) {
        throw new Error(result.error ?? "No pudimos recibir tu historia.");
      }

      form.reset();
      setMemberType("biker");
      setPreviousMotorcycleCount(1);
      setAwardCount(0);
      setStatus("success");
      setMessage("¡Gracias, Chilango! Tu historia ya quedó en familia y será revisada antes de publicar cualquier dato.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos recibir tu historia. Inténtalo nuevamente.");
    }
  }

  return (
    <form className="member-intake-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="empresa" className="collaboration-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>TU LUGAR EN LA FAMILIA</span><h2>Primero, cuéntanos quién eres.</h2><p>Hay quienes llevan el manubrio y quienes comparten cada aventura desde el asiento de atrás. Aquí todas las historias cuentan.</p></div>
        <div className="member-intake-grid">
          <label className="member-intake-field"><span>Apodo o alias dentro del club <em>*</em></span><input type="text" name="alias" required maxLength={80} placeholder="Como te conoce la banda" /></label>
          <label className="member-intake-field"><span>¿Cómo formas parte de Chilangos?</span><select name="tipoIntegrante" value={memberType} onChange={(event) => setMemberType(event.target.value as MemberType)}><option value="biker">Biker: manejo mi propia moto</option><option value="partner">Partner: acompaño y comparto la rodada</option><option value="biker-partner">Biker y partner: vivo las dos experiencias</option></select></label>
          <label className="member-intake-field"><span>Nombre completo</span><input type="text" name="nombreCompleto" autoComplete="name" maxLength={160} placeholder="Solo para uso interno; no se publica" /></label>
          <label className="member-intake-field"><span>Edad</span><input type="number" name="edad" min={18} max={100} placeholder="Opcional" /></label>
          <label className="member-intake-field"><span>WhatsApp de contacto</span><input type="tel" name="whatsapp" autoComplete="tel" maxLength={35} placeholder="Solo para uso interno" /></label>
          <label className="member-intake-field"><span>¿Quién te apadrinó?</span><input type="text" name="padrino" maxLength={100} placeholder="Nombre de tu padrino o madrina; si no aplica, déjalo vacío" /></label>
          <label className="member-intake-field"><span>¿Desde cuándo eres parte del club?</span><input type="text" name="desdeCuandoClub" maxLength={100} placeholder="Ej. diciembre de 2022" /></label>
          <label className="member-intake-field"><span>Foto de perfil</span><input type="file" name="foto" accept="image/jpeg,image/png,image/webp" /></label>
          {(memberType === "partner" || memberType === "biker-partner") && <label className="member-intake-field member-intake-wide"><span>¿Con quién compartes normalmente la rodada?</span><input type="text" name="conQuienRuedas" maxLength={100} placeholder="Apodo del biker con quien compartes el camino" /></label>}
        </div>
      </section>

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>LO QUE HAY DEBAJO DEL CASCO</span><h2>Tu historia merece contarse.</h2><p>No importa si manejas una moto o compartes el camino como partner: queremos conocer a la persona que forma parte de esta familia.</p></div>
        <label className="member-intake-field member-intake-wide"><span>¿Cómo comenzó tu historia con el motociclismo o la vida biker?</span><textarea name="inicios" rows={4} maxLength={3000} placeholder="Cuéntanos qué persona, momento o experiencia te acercó a este mundo" /></label>
        <label className="member-intake-field member-intake-wide"><span>Si alguien quisiera conocerte, ¿qué le contarías sobre ti?</span><textarea name="biografia" rows={6} maxLength={5000} placeholder="Habla de tu historia, tu personalidad y todo aquello que te hace ser quien eres" /></label>
        <label className="member-intake-field member-intake-wide"><span>¿Cómo llegaste a Chilangos RC?</span><textarea name="llegadaClub" rows={3} maxLength={2500} placeholder="¿Quién te invitó, cómo fue tu primera convivencia o qué te hizo quedarte?" /></label>
        <label className="member-intake-field member-intake-wide"><span>¿Qué significa para ti pertenecer a esta familia?</span><textarea name="significadoClub" rows={3} maxLength={2500} placeholder="Lo que representan la banda, la hermandad y los momentos compartidos" /></label>
        <label className="member-intake-field member-intake-wide"><span>Una frase o filosofía que te representa</span><input type="text" name="filosofia" maxLength={500} placeholder="Ej. La carretera nos presentó; la hermandad nos dejó juntos" /></label>
        {memberType === "partner" && <label className="member-intake-field member-intake-wide"><span>¿Qué es lo que más disfrutas de vivir la rodada como partner?</span><textarea name="experienciaPartner" rows={3} maxLength={2500} placeholder="Las conversaciones, los paisajes, la complicidad o aquello que vuelve especial cada salida" /></label>}
      </section>

      {hasOwnMotorcycle && (
        <>
          <section className="member-intake-section">
            <div className="member-intake-section-heading"><span>LA COMPAÑERA DE CARRETERA</span><h2>La moto que ruedas hoy.</h2><p>No pedimos placas, números de serie ni documentos: solo los detalles que cuentan su historia.</p></div>
            <div className="member-intake-grid">
              <label className="member-intake-field"><span>Marca</span><input type="text" name="motoMarca" maxLength={100} placeholder="Ej. Harley-Davidson" /></label>
              <label className="member-intake-field"><span>Modelo</span><input type="text" name="motoModelo" maxLength={120} placeholder="Ej. Road Glide, Street Glide o Roadster" /></label>
              <label className="member-intake-field"><span>Año o generación</span><input type="text" name="motoAnio" maxLength={30} placeholder="Ej. 2016" /></label>
              <label className="member-intake-field"><span>Color</span><input type="text" name="motoColor" maxLength={60} placeholder="Ej. negro, rojo o una edición especial" /></label>
              <label className="member-intake-field"><span>Cilindrada o motor</span><input type="text" name="motoMotor" maxLength={100} placeholder="Ej. 1200 cc o Milwaukee-Eight 114" /></label>
              <label className="member-intake-field"><span>¿Tu moto tiene nombre?</span><input type="text" name="motoNombre" maxLength={100} placeholder="El apodo que le pusiste" /></label>
              <label className="member-intake-field"><span>¿Desde cuándo la tienes?</span><input type="text" name="motoDesde" maxLength={80} placeholder="Ej. 2023" /></label>
              <label className="member-intake-field"><span>Foto de tu moto actual</span><input type="file" name="fotoMoto" accept="image/jpeg,image/png,image/webp" /></label>
            </div>
            <label className="member-intake-field member-intake-wide"><span>¿Por qué elegiste esta moto y qué historia tiene contigo?</span><textarea name="historiaMoto" rows={4} maxLength={2500} placeholder="Cómo llegó a tu vida, qué tiene de especial o una anécdota que siempre recuerdas" /></label>
          </section>

          <section className="member-intake-section">
            <div className="member-intake-section-heading"><span>EL GARAGE DE TU HISTORIA</span><h2>Las motos que te trajeron hasta aquí.</h2><p>Puedes registrar hasta diez motocicletas anteriores. Cada una puede incluir su propia foto, detalles y recuerdo.</p></div>
            <div className="member-intake-motorcycles">
              {Array.from({ length: previousMotorcycleCount }, (_, index) => (
                <article className="member-intake-motorcycle-card" key={index}>
                  <div className="member-intake-motorcycle-heading"><span>MOTO ANTERIOR {String(index + 1).padStart(2, "0")}</span>{index === previousMotorcycleCount - 1 && previousMotorcycleCount > 1 && <button type="button" onClick={() => setPreviousMotorcycleCount((count) => count - 1)}>Quitar esta moto</button>}</div>
                  <div className="member-intake-grid">
                    <label className="member-intake-field"><span>Marca</span><input type="text" name={`motoAnteriorMarca${index}`} maxLength={100} placeholder="Ej. Honda, Yamaha o Harley-Davidson" /></label>
                    <label className="member-intake-field"><span>Modelo</span><input type="text" name={`motoAnteriorModelo${index}`} maxLength={120} placeholder="Ej. Shadow, Sportster o Fat Boy" /></label>
                    <label className="member-intake-field"><span>Año o generación</span><input type="text" name={`motoAnteriorAnio${index}`} maxLength={30} placeholder="Ej. 2012" /></label>
                    <label className="member-intake-field"><span>¿Cuándo la tuviste?</span><input type="text" name={`motoAnteriorPeriodo${index}`} maxLength={100} placeholder="Ej. de 2018 a 2021" /></label>
                    <label className="member-intake-field"><span>Nombre o apodo de esa moto</span><input type="text" name={`motoAnteriorNombre${index}`} maxLength={100} placeholder="Opcional" /></label>
                    <label className="member-intake-field"><span>Foto de esa moto</span><input type="file" name={`motoAnteriorFoto${index}`} accept="image/jpeg,image/png,image/webp" /></label>
                    <label className="member-intake-field member-intake-wide"><span>¿Qué recuerdas de ella?</span><textarea name={`motoAnteriorHistoria${index}`} rows={3} maxLength={1800} placeholder="Una rodada, una caída, la forma en que llegó o por qué te costó despedirte" /></label>
                  </div>
                </article>
              ))}
            </div>
            {previousMotorcycleCount < MAX_PREVIOUS_MOTORCYCLES && <button className="member-intake-add" type="button" onClick={() => setPreviousMotorcycleCount((count) => Math.min(MAX_PREVIOUS_MOTORCYCLES, count + 1))}>+ Agregar otra motocicleta anterior <span>{previousMotorcycleCount} / {MAX_PREVIOUS_MOTORCYCLES}</span></button>}
          </section>
        </>
      )}

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>LOS SUEÑOS TAMBIÉN SE RUEDAN</span><h2>{hasOwnMotorcycle ? "La moto que no cambiarías por nada." : "Los sueños que también te acompañan."}</h2><p>{hasOwnMotorcycle ? "Esa moto que se te quedó grabada y que, si llegara al garage, ya no saldría." : "Si no tienes una moto soñada, puedes omitir estas preguntas. También queremos conocer los viajes que te gustaría compartir."}</p></div>
        <div className="member-intake-grid">
          <label className="member-intake-field"><span>Marca de la moto de tus sueños</span><input type="text" name="motoSuenosMarca" maxLength={100} placeholder="Ej. Harley-Davidson, Indian o Triumph" /></label>
          <label className="member-intake-field"><span>Modelo de la moto que no cambiarías</span><input type="text" name="motoSuenosModelo" maxLength={120} placeholder="Ej. Street Glide negra" /></label>
        </div>
        <label className="member-intake-field member-intake-wide"><span>¿Por qué esa moto se ganó un lugar en tus sueños?</span><textarea name="motoSuenosHistoria" rows={3} maxLength={1800} placeholder="El diseño, el sonido, un recuerdo o esa sensación de que algún día tiene que ser tuya" /></label>
      </section>

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>CULTURA BIKER · PANTALLA Y CARRETERA</span><h2>Las historias que encendieron el motor.</h2><p>Muchas pasiones empezaron viendo una película, una serie, una moto icónica o un personaje que nos dejó pensando: algún día quiero vivir algo así.</p></div>
        <div className="member-intake-grid">
          <label className="member-intake-field"><span>Película biker o película con motos favorita</span><input type="text" name="peliculaFavorita" maxLength={250} placeholder="Ej. Terminator 2, Easy Rider o Wild Hogs" /></label>
          <label className="member-intake-field"><span>Serie favorita relacionada con motos</span><input type="text" name="serieFavorita" maxLength={250} placeholder="Ej. Sons of Anarchy o Mayans M.C." /></label>
          <label className="member-intake-field"><span>Personaje que marcó tu idea de ser biker</span><input type="text" name="personajeBiker" maxLength={200} placeholder="Ej. Terminator, Jax Teller o alguien real" /></label>
          <label className="member-intake-field"><span>La moto de película que nunca olvidaste</span><input type="text" name="motoIconica" maxLength={250} placeholder="Ej. la Harley-Davidson de Terminator" /></label>
          <label className="member-intake-field"><span>La canción que debería sonar al arrancar</span><input type="text" name="cancionRuta" maxLength={250} placeholder="Esa rola que te pone en modo carretera" /></label>
          <label className="member-intake-field"><span>¿Qué estilo biker te representa?</span><input type="text" name="estiloBiker" maxLength={250} placeholder="Clásico, rebelde, touring, custom o completamente tuyo" /></label>
        </div>
        <label className="member-intake-field member-intake-wide"><span>¿Recuerdas una escena que despertó tu gusto por las motos?</span><textarea name="escenaFavorita" rows={3} maxLength={1800} placeholder="Describe esa escena, moto o momento que te hizo imaginarte en la carretera" /></label>
      </section>

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>RUTAS, GUSTOS Y BUENOS PRETEXTOS</span><h2>Todo lo que hace tuya la rodada.</h2><p>Las mejores historias no siempre hablan de velocidad: hablan de paisajes, conversaciones, comida, música y momentos compartidos.</p></div>
        <div className="member-intake-grid">
          <label className="member-intake-field"><span>Tu ruta o salida favorita ya vivida</span><input type="text" name="rutaFavorita" maxLength={250} placeholder="Ej. Cervecería Hércules, Querétaro" /></label>
          <label className="member-intake-field"><span>La ruta o viaje que todavía sueñas</span><input type="text" name="rutaSonada" maxLength={250} placeholder="Ej. Baja California por la costa" /></label>
          <label className="member-intake-field"><span>La mejor parada después de una rodada</span><input type="text" name="paradaFavorita" maxLength={250} placeholder="Un restaurante, un paisaje o una buena mesa con la banda" /></label>
          <label className="member-intake-field"><span>¿Qué nunca puede faltar en una salida?</span><input type="text" name="indispensableRodada" maxLength={250} placeholder="Música, cafecito, amigos, buena comida o tu cámara" /></label>
          <label className="member-intake-field"><span>Tus pasiones, además de la vida biker</span><input type="text" name="pasiones" maxLength={500} placeholder="Fotografía, familia, cocina, viajes…" /></label>
          <label className="member-intake-field"><span>Tus hobbies</span><input type="text" name="hobbies" maxLength={500} placeholder="Sepáralos con comas" /></label>
        </div>
        <label className="member-intake-field member-intake-wide"><span>Cuéntanos una anécdota inolvidable con la banda</span><textarea name="anecdotaBanda" rows={4} maxLength={2500} placeholder="Algo que todavía te haga reír, emocionarte o pensar: por eso somos familia" /></label>
      </section>

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>CHILANGOS AWARDS · EL EGO TAMBIÉN RUEDA</span><h2>¿La banda ya te dio un premio?</h2><p>Si ganaste un Chilango Award, registraremos la categoría y el año para poder incluirlo después en tu biografía.</p></div>
        <label className="member-intake-field"><span>¿Has ganado algún Chilango Award?</span><select name="recibioAward" value={awardCount > 0 ? "si" : "no"} onChange={(event) => setAwardCount(event.target.value === "si" ? 1 : 0)}><option value="no">Todavía no / No aplica</option><option value="si">Sí, la banda ya reconoció mi talento</option></select></label>
        {awardCount > 0 && <div className="member-intake-awards">{Array.from({ length: awardCount }, (_, index) => <article className="member-intake-award-card" key={index}><div className="member-intake-motorcycle-heading"><span>CHILANGO AWARD {String(index + 1).padStart(2, "0")}</span>{index === awardCount - 1 && awardCount > 1 && <button type="button" onClick={() => setAwardCount((count) => count - 1)}>Quitar premio</button>}</div><div className="member-intake-grid"><label className="member-intake-field"><span>Categoría del premio</span><select name={`premioCategoria${index}`} defaultValue=""><option value="">Selecciona una categoría</option>{chilangoAwardCategories.map((award) => <option value={award.title} key={award.title}>{award.title}</option>)}<option value="Otra categoría">Otra categoría</option></select></label><label className="member-intake-field"><span>Año en que lo ganaste</span><input type="number" name={`premioAnio${index}`} min={2022} max={2099} placeholder="Ej. 2024" /></label><label className="member-intake-field member-intake-wide"><span>Si fue otra categoría, ¿cómo se llamaba?</span><input type="text" name={`premioNombre${index}`} maxLength={150} placeholder="Déjalo vacío si elegiste una categoría de la lista" /></label><label className="member-intake-field member-intake-wide"><span>¿Qué hizo memorable ese premio?</span><textarea name={`premioHistoria${index}`} rows={2} maxLength={1000} placeholder="Opcional: la anécdota, el motivo o la carrilla de la banda" /></label></div></article>)}</div>}
        {awardCount > 0 && awardCount < MAX_AWARDS && <button className="member-intake-add" type="button" onClick={() => setAwardCount((count) => Math.min(MAX_AWARDS, count + 1))}>+ Agregar otro Chilango Award <span>{awardCount} / {MAX_AWARDS}</span></button>}
      </section>

      <section className="member-intake-section">
        <div className="member-intake-section-heading"><span>LO QUE QUIERES DEJAR EN EL CAMINO</span><h2>Para cerrar, háblale a tu familia Chilanga.</h2></div>
        <label className="member-intake-field member-intake-wide"><span>¿Qué crees que aportas a Chilangos RC?</span><textarea name="aporteClub" rows={3} maxLength={1800} placeholder="Buena vibra, organización, apoyo, risas, fotografía, mecánica o algo que solo tú aportas" /></label>
        <label className="member-intake-field member-intake-wide"><span>¿Qué te gustaría decirle a la banda?</span><textarea name="mensajeBanda" rows={3} maxLength={1800} placeholder="Lo que sientes por esta familia o lo que te gustaría que nunca perdiera" /></label>
        <label className="member-intake-field member-intake-wide"><span>¿Algo más que quieras contarnos?</span><textarea name="notas" rows={3} maxLength={2500} placeholder="Todo aquello que se haya quedado en el tintero" /></label>
        <label className="member-intake-field member-intake-wide"><span>¿Cómo autorizas que usemos tu historia? <em>*</em></span><select name="autorizacionPublicacion" defaultValue="" required><option value="">Selecciona la opción con la que te sientas más cómodo</option><option value="revisar-antes">Pueden preparar mi biografía, pero quiero revisarla antes de publicarla.</option><option value="publicar-no-sensible">Autorizo publicar únicamente información y fotografías no sensibles.</option><option value="solo-interno">Por ahora, mi historia es solamente para uso interno del club.</option></select></label>
      </section>

      <div className="member-intake-submit">
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Guardando tu historia…" : "Enviar mi historia a la familia"}</button>
        <span>Tus respuestas y fotografías llegan al panel privado de administración de Chilangos RC. Tu nombre completo, teléfono y cualquier dato sensible permanecen internos; nada se publica automáticamente.</span>
        <p className={`member-intake-message ${status}`} role="status" aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
