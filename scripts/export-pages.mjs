import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const { default: worker } = await import("../dist/server/index.js");
const pages = [
  { path: "/", file: "index.html", title: /<title>Chilangos RC<\/title>/ },
  {
    path: "/cuestionario",
    file: "cuestionario/index.html",
    title: /<title>Tu historia biker \| Chilangos RC<\/title>/,
  },
];
const exportedPaths = new Set(pages.map((page) => page.path));

for (const page of pages) {
  const response = await worker.fetch(
    new Request(`https://chilangosrc.com${page.path}`, {
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

  assert.equal(response.status, 200, `No se pudo generar la ruta ${page.path}.`);
  const html = await response.text();
  assert.match(html, page.title);
  assert.match(html, /chilangosrc\.com/);

  if (page.path === "/") {
    for (const match of html.matchAll(/href="(\/integrantes\/[^"?#]+)"/g)) {
      const profilePath = match[1];
      if (exportedPaths.has(profilePath)) continue;
      exportedPaths.add(profilePath);
      pages.push({
        path: profilePath,
        file: `${profilePath.slice(1)}/index.html`,
        title: /<title>[^<]+ \| Chilangos RC<\/title>/,
      });
    }
  }

  const output = new URL(`../dist/client/${page.file}`, import.meta.url);
  await mkdir(new URL("./", output), { recursive: true });
  await writeFile(output, html);
  console.log(`Cloudflare Pages listo: dist/client/${page.file}`);
}
