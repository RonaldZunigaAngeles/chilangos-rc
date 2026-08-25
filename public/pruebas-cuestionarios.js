/**
 * Pruebas funcionales independientes para los cuestionarios de Chilangos RC.
 *
 * Desde la consola del navegador, con la cuenta propietaria iniciada:
 * const qa = await import('/pruebas-cuestionarios.js');
 * const resultado = await qa.runQuestionnaireQa({ onResult: console.log });
 * await qa.cleanupQuestionnaireQa(resultado.runId);
 *
 * Los registros usan exclusivamente datos ficticios y el prefijo QA_CHILANGOS_.
 */

const TEST_PREFIX = "QA_CHILANGOS_";
const DRAFT_STORAGE_KEY = "chilangos-rc-cuestionario-v1";
const TEST_IMAGE_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==";

function dummyImage(name) {
  const binary = atob(TEST_IMAGE_BASE64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new File([bytes], name, { type: "image/png" });
}

function createBiography(runId) {
  const alias = `${TEST_PREFIX}${runId}_BIKER`;
  const form = new FormData();
  const values = {
    alias,
    tipoIntegrante: "biker",
    nombreCompleto: "Integrante ficticio para pruebas QA",
    edad: "40",
    whatsapp: "5550000000",
    padrino: "Padrino de prueba",
    desdeCuandoClub: "Diciembre de 2022",
    inicios: "Historia ficticia para validar el inicio de la vida biker.",
    biografia: "Biografía generada automáticamente para verificar la captura completa.",
    llegadaClub: "Llegada ficticia al club utilizada exclusivamente en pruebas.",
    significadoClub: "Hermandad y regreso seguro a casa.",
    filosofia: "Juntos vamos, juntos regresamos.",
    motoMarca: "Harley-Davidson",
    motoModelo: "Roadster QA",
    motoAnio: "2016",
    motoColor: "Negra",
    motoMotor: "1200 cc",
    motoNombre: "La prueba",
    motoDesde: "2024",
    historiaMoto: "Motocicleta ficticia utilizada para verificar el garage.",
    motoSuenosMarca: "Harley-Davidson",
    motoSuenosModelo: "Street Glide QA",
    motoSuenosHistoria: "La motocicleta soñada también debe guardarse.",
    peliculaFavorita: "Terminator 2",
    serieFavorita: "Sons of Anarchy",
    personajeBiker: "Terminator",
    motoIconica: "Harley-Davidson Fat Boy",
    cancionRuta: "Born to Be Wild",
    estiloBiker: "Touring clásico",
    escenaFavorita: "Una escena ficticia para verificar la cultura biker.",
    rutaFavorita: "Taxco, Guerrero",
    rutaSonada: "Baja California",
    paradaFavorita: "Café de prueba",
    indispensableRodada: "Casco, seguro y familia Chilanga",
    pasiones: "Fotografía y carretera",
    hobbies: "Fotografía, cine y motocicletas",
    anecdotaBanda: "Anécdota ficticia generada para pruebas funcionales.",
    premioCategoria0: "El Rodador",
    premioAnio0: "2024",
    premioHistoria0: "Reconocimiento ficticio de pruebas.",
    premioCategoria1: "Otra categoría",
    premioNombre1: "QA más aplicado",
    premioAnio1: "2026",
    premioHistoria1: "Segundo reconocimiento ficticio.",
    aporteClub: "Ayudar a verificar que el sitio funcione correctamente.",
    mensajeBanda: "Este registro es ficticio y puede eliminarse.",
    notas: `Ejecución automática ${runId}.`,
    autorizacionPublicacion: "revisar-antes",
  };

  for (const [name, value] of Object.entries(values)) form.set(name, value);

  form.set("foto", dummyImage("retrato-qa.png"));
  form.set("fotoMoto", dummyImage("moto-actual-qa.png"));

  for (let index = 0; index < 10; index += 1) {
    form.set(`motoAnteriorMarca${index}`, index % 2 === 0 ? "Harley-Davidson" : "Honda");
    form.set(`motoAnteriorModelo${index}`, `Modelo QA ${index + 1}`);
    form.set(`motoAnteriorAnio${index}`, String(2010 + index));
    form.set(`motoAnteriorPeriodo${index}`, `${2010 + index} a ${2011 + index}`);
    form.set(`motoAnteriorNombre${index}`, `Moto de prueba ${index + 1}`);
    form.set(`motoAnteriorHistoria${index}`, `Historia ficticia de la motocicleta ${index + 1}.`);
    if (index === 0 || index === 9) {
      form.set(`motoAnteriorFoto${index}`, dummyImage(`moto-anterior-${index + 1}-qa.png`));
    }
  }

  return { alias, form };
}

function createPartnerBiography(runId) {
  const alias = `${TEST_PREFIX}${runId}_PARTNER`;
  const form = new FormData();
  const values = {
    alias,
    tipoIntegrante: "partner",
    nombreCompleto: "Partner ficticia para pruebas QA",
    conQuienRuedas: "Biker de prueba",
    biografia: "Biografía ficticia para validar a quienes no tienen motocicleta propia.",
    experienciaPartner: "La hermandad también se disfruta como partner.",
    peliculaFavorita: "Wild Hogs",
    autorizacionPublicacion: "solo-interno",
  };
  for (const [name, value] of Object.entries(values)) form.set(name, value);
  return { alias, form };
}

function createSafetyRecord(runId, insured = true) {
  return {
    fullName: "Persona ficticia de pruebas QA",
    alias: `${TEST_PREFIX}${runId}_${insured ? "SEGURO" : "SIN_SEGURO"}`,
    phone: "5550000001",
    email: "pruebas@example.com",
    birthDate: "1985-01-01",
    bloodType: "O+",
    medicalNotes: "Dato completamente ficticio para pruebas.",
    emergencyContactName: "Contacto ficticio de emergencia",
    emergencyContactPhone: "5550000002",
    healthInstitution: "Institución ficticia QA",
    insuranceActive: insured ? "si" : "no",
    motorcycleModel: "Harley-Davidson Roadster QA",
    motorcycleYear: "2016",
    engineCc: "1200",
    plates: "QA0000",
    policyDetails: insured ? "Póliza ficticia QA; sin valor real." : "",
    consent: "acepto",
  };
}

function defaultBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  throw new Error("Indica baseUrl o ejecuta las pruebas desde el navegador del sitio.");
}

async function responseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

export async function runQuestionnaireQa(options = {}) {
  const baseUrl = options.baseUrl ?? defaultBaseUrl();
  const request = options.fetch ?? fetch;
  const runId = (options.runId ?? Date.now().toString(36)).toUpperCase();
  const results = [];
  const biker = createBiography(runId);
  const partner = createPartnerBiography(runId);
  const insured = createSafetyRecord(runId, true);
  const uninsured = createSafetyRecord(runId, false);
  let biographyAdminHtml = "";

  async function step(name, task) {
    const start = performance.now();
    try {
      const detail = await task();
      const result = { name, status: "passed", detail: detail ?? "Correcto", durationMs: Math.round(performance.now() - start) };
      results.push(result);
      options.onResult?.(result);
    } catch (error) {
      const result = { name, status: "failed", detail: error instanceof Error ? error.message : String(error), durationMs: Math.round(performance.now() - start) };
      results.push(result);
      options.onResult?.(result);
    }
  }

  function call(path, init = {}) {
    return request(new URL(path, baseUrl), { credentials: "same-origin", cache: "no-store", ...init });
  }

  async function assertJson(path, payload, expectedStatus) {
    const response = await call(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(response.status === expectedStatus, `Se esperaba HTTP ${expectedStatus}; llegó HTTP ${response.status}.`);
    return (await responseJson(response)) ?? {};
  }

  await step("La landing muestra la calavera, la bandera y el acceso al cuestionario", async () => {
    const response = await call("/");
    const html = await response.text();
    expect(response.ok && html.includes("launch-skull") && html.includes("launch-center-flag"), "La portada no muestra la identidad esperada.");
    expect(html.includes("/cuestionario-integrantes"), "No aparece el acceso al formulario.");
    return "Portada y enlace de registro disponibles.";
  });

  await step("El cuestionario de biografía carga sus campos principales", async () => {
    const response = await call("/cuestionario-integrantes");
    const html = await response.text();
    expect(response.ok && html.includes('name="alias"') && html.includes('name="fotoMoto"'), "Faltan campos principales del cuestionario.");
    return "Alias, biografía y fotografías disponibles.";
  });

  await step("El cuestionario de 56 preguntas está disponible", async () => {
    const response = await call("/cuestionario");
    const html = await response.text();
    expect(response.ok && html.includes("preguntas para elegir") && html.includes("Debajo del casco"), "No se pudo abrir el cuestionario biker.");
    return "Cuestionario biker disponible.";
  });

  await step("La ficha privada de seguridad está disponible", async () => {
    const response = await call("/seguridad-en-ruta");
    const html = await response.text();
    expect(response.ok && html.includes('name="emergencyContactName"'), "No se pudo abrir la ficha de seguridad.");
    return "Formulario de emergencia y seguro disponible.";
  });

  await step("La biografía rechaza registros sin alias", async () => {
    const form = new FormData();
    form.set("autorizacionPublicacion", "solo-interno");
    const response = await call("/api/cuestionario-integrantes", { method: "POST", body: form });
    expect(response.status === 400, `El alias vacío debía rechazarse; llegó HTTP ${response.status}.`);
    return "Validación de alias correcta.";
  });

  await step("La biografía exige autorización de publicación", async () => {
    const form = new FormData();
    form.set("alias", `${TEST_PREFIX}${runId}_SIN_AUTORIZACION`);
    const response = await call("/api/cuestionario-integrantes", { method: "POST", body: form });
    expect(response.status === 400, `La autorización faltante debía rechazarse; llegó HTTP ${response.status}.`);
    return "Consentimiento obligatorio validado.";
  });

  await step("La biografía rechaza archivos que no sean fotografías", async () => {
    const form = new FormData();
    form.set("alias", `${TEST_PREFIX}${runId}_ARCHIVO_INVALIDO`);
    form.set("autorizacionPublicacion", "solo-interno");
    form.set("foto", new File(["archivo de prueba"], "prueba.txt", { type: "text/plain" }));
    const response = await call("/api/cuestionario-integrantes", { method: "POST", body: form });
    expect(response.status === 400, `El archivo inválido debía rechazarse; llegó HTTP ${response.status}.`);
    return "Restricción de imágenes correcta.";
  });

  await step("Guarda un biker con diez motos, cuatro fotos y dos premios", async () => {
    const response = await call("/api/cuestionario-integrantes", { method: "POST", body: biker.form });
    const body = await responseJson(response);
    expect(response.status === 201 && body?.received === true, body?.error ?? `Falló el envío del biker: HTTP ${response.status}.`);
    return `Biografía guardada: ${biker.alias}.`;
  });

  await step("Guarda una partner sin motocicleta propia", async () => {
    const response = await call("/api/cuestionario-integrantes", { method: "POST", body: partner.form });
    const body = await responseJson(response);
    expect(response.status === 201 && body?.received === true, body?.error ?? `Falló el envío de la partner: HTTP ${response.status}.`);
    return `Biografía guardada: ${partner.alias}.`;
  });

  await step("La ficha de seguridad rechaza registros incompletos", async () => {
    await assertJson("/api/seguridad-en-ruta", { alias: `${TEST_PREFIX}${runId}_INCOMPLETO` }, 400);
    return "Campos obligatorios validados.";
  });

  await step("La ficha de seguridad rechaza correos inválidos", async () => {
    await assertJson("/api/seguridad-en-ruta", { ...insured, email: "correo-invalido" }, 400);
    return "Formato del correo validado.";
  });

  await step("Guarda una ficha de seguridad con seguro vigente", async () => {
    const body = await assertJson("/api/seguridad-en-ruta", insured, 201);
    expect(body.received === true, "La ficha no confirmó su recepción.");
    return `Ficha guardada: ${insured.alias}.`;
  });

  await step("Identifica a una persona sin seguro como no elegible", async () => {
    const body = await assertJson("/api/seguridad-en-ruta", uninsured, 201);
    expect(body.received === true, "No se registró el caso sin seguro.");
    return `Registro sin seguro identificado: ${uninsured.alias}.`;
  });

  await step("El formulario de colaboraciones rechaza propuestas incompletas", async () => {
    await assertJson("/api/colaboraciones", { contactName: "Prueba QA" }, 400);
    return "Validación de propuestas incompletas correcta.";
  });

  await step("Guarda una propuesta ficticia de colaboración", async () => {
    const body = await assertJson("/api/colaboraciones", {
      contactName: "Contacto ficticio QA",
      businessName: `${TEST_PREFIX}${runId}_NEGOCIO`,
      businessType: "Taller o agencia",
      location: "Ciudad de México",
      email: "pruebas@example.com",
      phone: "5550000003",
      instagram: "@cuenta_ficticia_qa",
      proposal: "Propuesta ficticia generada exclusivamente para validar el formulario.",
    }, 201);
    expect(body.received === true, "La colaboración no confirmó su recepción.");
    return "Solicitud almacenada correctamente.";
  });

  await step("Las biografías aparecen en el panel privado", async () => {
    const response = await call("/administracion/cuestionarios");
    biographyAdminHtml = await response.text();
    expect(response.ok && biographyAdminHtml.includes(biker.alias) && biographyAdminHtml.includes(partner.alias), "Las dos biografías no aparecen en administración.");
    expect(biographyAdminHtml.includes("Modelo QA 10"), "La décima motocicleta anterior no se guardó.");
    expect(biographyAdminHtml.includes("QA más aplicado"), "El Chilango Award personalizado no se guardó.");
    return "Biker, partner, diez motos y premios visibles en administración.";
  });

  await step("Las fotografías quedan accesibles únicamente en el panel privado", async () => {
    const rawLink = biographyAdminHtml.match(/href="(\/api\/administracion\/foto\?[^\"]+)"/)?.[1];
    expect(rawLink, "No se encontraron fotografías privadas en el panel.");
    const response = await call(rawLink.replace(/&amp;/g, "&"));
    expect(response.ok && (response.headers.get("content-type") ?? "").startsWith("image/"), "No fue posible recuperar la fotografía de prueba.");
    return "Carga y consulta privada de imágenes correctas.";
  });

  await step("Las fichas aparecen en administración y alertan cuando no hay seguro", async () => {
    const response = await call("/administracion/seguridad");
    const html = await response.text();
    expect(response.ok && html.includes(insured.alias) && html.includes(uninsured.alias), "Las fichas no aparecen en el panel privado.");
    expect(html.includes("SIN SEGURO VIGENTE") && html.includes("NO ELEGIBLE PARA RODAR"), "No se muestra la advertencia por falta de seguro.");
    return "Seguro vigente y restricción de rodada comprobados.";
  });

  if (typeof window !== "undefined" && window.localStorage) {
    await step("El cuestionario biker guarda y restaura borradores locales", async () => {
      const previousDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      try {
        const dummyDraft = { answers: { alias: `${TEST_PREFIX}${runId}_BORRADOR`, "permiso-publicacion": "Revisar antes" }, publicAnswers: { alias: true } };
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dummyDraft));
        const recovered = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) ?? "{}");
        expect(recovered.answers?.alias === dummyDraft.answers.alias, "El navegador no recuperó el borrador.");
      } finally {
        if (previousDraft === null) window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        else window.localStorage.setItem(DRAFT_STORAGE_KEY, previousDraft);
      }
      return "Borrador validado sin modificar historias existentes.";
    });
  }

  return {
    runId,
    prefix: `${TEST_PREFIX}${runId}`,
    passed: results.filter((result) => result.status === "passed").length,
    failed: results.filter((result) => result.status === "failed").length,
    results,
  };
}

export async function cleanupQuestionnaireQa(runId, options = {}) {
  const baseUrl = options.baseUrl ?? defaultBaseUrl();
  const request = options.fetch ?? fetch;
  const response = await request(new URL("/api/administracion/pruebas", baseUrl), {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ runId }),
  });
  const body = await responseJson(response);
  if (!response.ok) throw new Error(body?.error ?? `No se pudieron limpiar las pruebas: HTTP ${response.status}.`);
  return body;
}
