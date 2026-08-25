"use client";

import { useState } from "react";

type QaResult = {
  name: string;
  status: "passed" | "failed";
  detail: string;
  durationMs: number;
};

type QaSummary = {
  runId: string;
  prefix: string;
  passed: number;
  failed: number;
  results: QaResult[];
};

type CleanupSummary = {
  biographies: number;
  safetyRecords: number;
  collaborations: number;
  images: number;
};

type QaModule = {
  runQuestionnaireQa(options: { onResult(result: QaResult): void }): Promise<QaSummary>;
  cleanupQuestionnaireQa(runId: string): Promise<CleanupSummary>;
};

async function loadQaModule(): Promise<QaModule> {
  const scriptPath = "/pruebas-cuestionarios.js";
  return import(/* @vite-ignore */ scriptPath) as Promise<QaModule>;
}

export default function QuestionnaireQaRunner() {
  const [status, setStatus] = useState<"idle" | "running" | "complete" | "cleaning">("idle");
  const [results, setResults] = useState<QaResult[]>([]);
  const [summary, setSummary] = useState<QaSummary | null>(null);
  const [notice, setNotice] = useState("");

  async function run() {
    setStatus("running");
    setResults([]);
    setSummary(null);
    setNotice("");

    try {
      const qaTools = await loadQaModule();
      const report = await qaTools.runQuestionnaireQa({
        onResult(result) {
          setResults((current) => [...current, result]);
        },
      });
      setSummary(report);
      setStatus("complete");
      setNotice(report.failed > 0 ? "Hay validaciones que requieren revisión." : "Todas las validaciones terminaron correctamente.");
    } catch (error) {
      setStatus("idle");
      setNotice(error instanceof Error ? error.message : "No fue posible ejecutar las pruebas.");
    }
  }

  async function clean() {
    if (!summary) return;
    setStatus("cleaning");
    try {
      const qaTools = await loadQaModule();
      const removed = await qaTools.cleanupQuestionnaireQa(summary.runId);
      setNotice(`Pruebas eliminadas: ${removed.biographies} biografías, ${removed.safetyRecords} fichas, ${removed.collaborations} colaboración y ${removed.images} fotografías.`);
      setSummary(null);
      setStatus("idle");
    } catch (error) {
      setStatus("complete");
      setNotice(error instanceof Error ? error.message : "No fue posible limpiar los datos de prueba.");
    }
  }

  return (
    <div className="qa-runner">
      <div className="qa-scope"><div><strong>Biografía biker</strong><span>Diez motos, fotografías y Chilangos Awards.</span></div><div><strong>Biografía partner</strong><span>Sin motocicleta propia ni campos obligatorios innecesarios.</span></div><div><strong>Ficha de seguridad</strong><span>Seguro vigente, emergencias y restricciones.</span></div><div><strong>Captura completa</strong><span>Validaciones, colaboración y panel privado.</span></div></div>
      <div className="qa-actions"><button type="button" onClick={run} disabled={status === "running" || status === "cleaning"}>{status === "running" ? "Ejecutando pruebas…" : "Ejecutar prueba completa"}</button>{summary && <button type="button" className="qa-clean-action" onClick={clean} disabled={status === "cleaning"}>{status === "cleaning" ? "Eliminando datos…" : "Eliminar datos de esta prueba"}</button>}<a href="/pruebas-cuestionarios.js" download>Descargar código independiente ↗</a></div>
      {notice && <p className={`qa-notice${summary?.failed ? " qa-notice-error" : ""}`} role="status">{notice}</p>}
      {summary && <div className="qa-summary"><div><strong>{summary.passed}</strong><span>validaciones correctas</span></div><div><strong>{summary.failed}</strong><span>validaciones por revisar</span></div><div><strong>{summary.runId}</strong><span>identificador de la ejecución</span></div></div>}
      {results.length > 0 && <div className="qa-results" aria-live="polite">{results.map((result) => <article className={`qa-result ${result.status}`} key={result.name}><span aria-label={result.status === "passed" ? "Correcto" : "Falló"}>{result.status === "passed" ? "✓" : "×"}</span><div><strong>{result.name}</strong><p>{result.detail}</p></div><small>{result.durationMs} ms</small></article>)}</div>}
      <p className="qa-privacy">Todos los registros se identifican con <strong>QA_CHILANGOS_</strong>. Ningún dato corresponde a una persona real y nada se publica automáticamente.</p>
    </div>
  );
}
