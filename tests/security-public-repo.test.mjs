import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "dist", "coverage", "out", ".wrangler"]);
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".html", ".css", ".yml", ".yaml", ".toml", ".txt"]);
const SENSITIVE_FILENAMES = [/^\.env($|\.)/i, /credentials?/i, /secrets?/i, /id_rsa/i, /id_ed25519/i];
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|secret|access[_-]?token|auth[_-]?token|password)\s*[:=]\s*["'][^"'\n]{8,}["']/i,
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
];

async function walk(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".env.example") continue;
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const rel = path.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, rel));
    else files.push(rel);
  }
  return files;
}

test("el repositorio no contiene archivos sensibles versionables", async () => {
  const files = await walk(ROOT);
  const suspicious = files.filter((file) => SENSITIVE_FILENAMES.some((pattern) => pattern.test(path.basename(file))));
  assert.deepEqual(suspicious, [], `Archivos sensibles detectados: ${suspicious.join(", ")}`);
});

test("el código público no contiene secretos evidentes", async () => {
  const files = await walk(ROOT);
  const findings = [];
  for (const file of files) {
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()) && path.basename(file) !== ".gitignore") continue;
    const content = await readFile(path.join(ROOT, file), "utf8");
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) findings.push(`${file}: ${pattern}`);
    }
  }
  assert.deepEqual(findings, [], `Posibles secretos detectados:\n${findings.join("\n")}`);
});

test("la identidad administrativa no está publicada en texto plano", async () => {
  const access = await readFile(path.join(ROOT, "app/administracion/access.ts"), "utf8");
  assert.equal(/@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(access), false, "El archivo de autorización contiene un correo en texto plano.");
});

test("el archivo público de hosting no publica un identificador interno", async () => {
  const hosting = JSON.parse(await readFile(path.join(ROOT, ".openai/hosting.json"), "utf8"));
  assert.equal(hosting.project_id, null, "hosting.json publica un project_id interno.");
});
