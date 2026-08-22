import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function renderRoute(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
}

test("renderiza la identidad de Chilangos RC sin datos personales", async () => {
  const html = await renderRoute("/");

  assert.match(html, /<title>Chilangos RC<\/title>/);
  assert.match(html, /chilangosrc\.com/);
  assert.match(html, /La familia/);
  assert.match(html, /Quienes encendieron/);
  assert.match(html, /Los caminos/);
  assert.match(html, /nos vamos ahora/);
  assert.match(html, /El Fashion Biker/);
  assert.match(html, /Playera oficial/);
  assert.match(html, /Consultar disponibilidad/);
  assert.match(html, /50/);
  assert.match(html, /og\.png/);
  assert.match(html, /instagram\.com\/chilangosrc/);
  assert.match(html, /facebook\.com\/chilangosrcmexico/);
  assert.match(html, /Instagram · @chilangosrc/);
  assert.match(html, /Facebook · Chilangos RC México/);
  assert.match(html, /href="\/cuestionario"/);
  assert.doesNotMatch(html, /Biker\/Teléfono|Afiliación IMSS|Contacto de Emergencia|Seguro\/Póliza/);
});

test("renderiza las 56 preguntas biker con autorización individual y privacidad", async () => {
  const html = await renderRoute("/cuestionario");

  assert.match(html, /<title>Tu historia biker \| Chilangos RC<\/title>/);
  assert.match(html, /Debajo del casco/);
  assert.match(html, /56<!-- --> preguntas para elegir/);
  assert.match(html, /primer recuerdo que tienes relacionado con una motocicleta/);
  assert.match(html, /marcas de motocicletas admiras/);
  assert.match(html, /filosofía de vida biker/);
  assert.match(html, /Autorizo incluir esta respuesta en mi perfil público/);
  assert.match(html, /Solo para conocerme dentro de Chilangos RC/);
  assert.match(html, /Copiar solo perfil público/);
  assert.match(html, /guardan únicamente en este navegador/);
  assert.match(html, /instagram\.com\/chilangosrc/);
  assert.match(html, /facebook\.com\/chilangosrcmexico/);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /<input[^>]+type="(?:email|tel|date|file)"/i);
});

test("la documentación versionada contiene los diez capítulos y 56 preguntas", async () => {
  const questionnaire = await readFile(
    new URL("../docs/cuestionario-integrantes.md", import.meta.url),
    "utf8",
  );

  assert.equal((questionnaire.match(/^## \d{2}\./gm) ?? []).length, 10);
  assert.equal((questionnaire.match(/^\d+\. /gm) ?? []).length - 3, 56);
  assert.match(questionnaire, /La autorización general siempre prevalece/);
});
