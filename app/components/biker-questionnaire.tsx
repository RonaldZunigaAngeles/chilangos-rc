"use client";

import { useEffect, useState } from "react";
import { bikerQuestionCount, bikerSections } from "../data/questionnaire";

const storageKey = "chilangos-rc-cuestionario-v1";

type Draft = {
  answers: Record<string, string>;
  publicAnswers: Record<string, boolean>;
};

const emptyDraft: Draft = { answers: {}, publicAnswers: {} };

function safeFileName(alias: string) {
  return alias.trim().toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "integrante";
}

function createMarkdown(draft: Draft, publicOnly = false) {
  const alias = draft.answers.alias?.trim() || "Integrante";
  const title = publicOnly ? `# Perfil biker · ${alias}` : `# Historia biker · ${alias}`;
  const lines = [title, "", "Chilangos RC · La familia se rueda.", ""];

  if (!publicOnly) {
    lines.push(`**Autorización de publicación:** ${draft.answers["permiso-publicacion"] || "Sin indicar."}`, "");
  }

  for (const section of bikerSections) {
    const answered = section.questions.filter((question) => {
      if (question.id === "permiso-publicacion") return false;
      return Boolean(draft.answers[question.id]?.trim())
        && (!publicOnly || Boolean(draft.publicAnswers[question.id]));
    });

    if (answered.length === 0) continue;

    lines.push(`## ${section.title}`, "");

    for (const question of answered) {
      const visibility = draft.publicAnswers[question.id] ? "Publicable" : "Solo para el club";
      lines.push(`### ${question.label}`, "", draft.answers[question.id].trim());
      if (!publicOnly) lines.push("", `**Privacidad:** ${visibility}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

export default function BikerQuestionnaire() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [restored, setRestored] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<Draft>;
          setDraft({ answers: parsed.answers ?? {}, publicAnswers: parsed.publicAnswers ?? {} });
        }
      } catch {
        setMessage("No se pudo recuperar el borrador de este navegador.");
      }
      setRestored(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      window.setTimeout(() => {
        setMessage("Tu navegador no pudo guardar automáticamente el borrador.");
      }, 0);
    }
  }, [draft, restored]);

  const answeredCount = Object.values(draft.answers).filter((value) => value.trim()).length;
  const publicCount = Object.entries(draft.publicAnswers)
    .filter(([key, authorized]) => authorized && draft.answers[key]?.trim()).length;
  const percentage = Math.round((answeredCount / bikerQuestionCount) * 100);

  function updateAnswer(id: string, value: string) {
    setDraft((current) => ({ ...current, answers: { ...current.answers, [id]: value } }));
    setMessage("");
  }

  function updateVisibility(id: string, value: boolean) {
    setDraft((current) => ({ ...current, publicAnswers: { ...current.publicAnswers, [id]: value } }));
    setMessage("");
  }

  function validate(publicOnly = false) {
    if (!draft.answers.alias?.trim()) {
      setMessage("Primero escribe cómo te conoce la banda.");
      document.getElementById("alias")?.focus();
      return false;
    }

    if (!draft.answers["permiso-publicacion"]?.trim()) {
      setMessage("Antes de compartir, selecciona tu autorización de publicación en el último bloque.");
      document.getElementById("permiso-publicacion")?.focus();
      return false;
    }

    if (publicOnly && draft.answers["permiso-publicacion"].startsWith("Solo para")) {
      setMessage("Elegiste no publicar ninguna respuesta; se respeta tu decisión.");
      return false;
    }

    if (publicOnly && publicCount === 0) {
      setMessage("Marca al menos una respuesta como publicable para crear tu perfil.");
      return false;
    }

    return true;
  }

  async function copyAnswers(publicOnly = false) {
    if (!validate(publicOnly)) return;
    try {
      await navigator.clipboard.writeText(createMarkdown(draft, publicOnly));
      setMessage(publicOnly ? "Perfil público copiado. Compártelo para revisión." : "Tu historia fue copiada. Compártela directamente con quien administra el club.");
    } catch {
      setMessage("No fue posible copiar automáticamente. Descarga tu historia para compartirla.");
    }
  }

  function downloadAnswers() {
    if (!validate()) return;
    const content = createMarkdown(draft);
    const file = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historia-biker-${safeFileName(draft.answers.alias)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Tu historia fue descargada. El archivo incluye qué respuestas autorizaste publicar.");
  }

  function clearDraft() {
    if (!window.confirm("¿Quieres eliminar todas las respuestas guardadas en este navegador?")) return;
    window.localStorage.removeItem(storageKey);
    setDraft(emptyDraft);
    setMessage("Se eliminó el borrador guardado en este navegador.");
  }

  return (
    <div className="questionnaire-shell section-shell">
      <aside className="questionnaire-sidebar" aria-label="Bloques del cuestionario">
        <div className="questionnaire-progress">
          <span>Tu historia avanza</span>
          <strong>{answeredCount}<small> / {bikerQuestionCount}</small></strong>
          <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label="Preguntas respondidas">
            <div style={{ width: `${percentage}%` }} />
          </div>
          <p>{publicCount} {publicCount === 1 ? "respuesta autorizada" : "respuestas autorizadas"} para tu perfil.</p>
        </div>
        <nav className="questionnaire-navigation">
          {bikerSections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
        </nav>
        <button className="draft-clear" type="button" onClick={clearDraft}>Borrar mi borrador</button>
      </aside>

      <div className="questionnaire-content">
        <div className="questionnaire-privacy">
          <span>Tu historia, tus reglas</span>
          <p>No pedimos teléfonos, domicilios, placas, documentos, fechas de nacimiento ni datos de terceros. Tus respuestas se guardan únicamente en este navegador y nunca se envían solas.</p>
          <p>Si usas un dispositivo compartido, descarga tu historia y después borra el borrador.</p>
        </div>

        {bikerSections.map((section) => (
          <section className="questionnaire-section" id={section.id} key={section.id}>
            <div className="questionnaire-section-heading">
              <p className="eyebrow">Tu historia biker</p>
              <h2>{section.title}</h2>
              <p>{section.introduction}</p>
            </div>

            <div className="question-list">
              {section.questions.map((question) => (
                <div className="question-card" key={question.id}>
                  <label htmlFor={question.id}>
                    {question.label}
                    {question.required && <span className="required-label">Necesaria</span>}
                  </label>
                  <p className="question-prompt">{question.prompt}</p>

                  {question.type === "short" ? (
                    <input id={question.id} name={question.id} value={draft.answers[question.id] ?? ""} onChange={(event) => updateAnswer(question.id, event.target.value)} autoComplete="off" />
                  ) : question.type === "select" ? (
                    <select id={question.id} name={question.id} value={draft.answers[question.id] ?? ""} onChange={(event) => updateAnswer(question.id, event.target.value)}>
                      <option value="">Selecciona cómo quieres compartir tu historia</option>
                      {question.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                    </select>
                  ) : (
                    <textarea id={question.id} name={question.id} value={draft.answers[question.id] ?? ""} onChange={(event) => updateAnswer(question.id, event.target.value)} rows={4} />
                  )}

                  {question.id !== "permiso-publicacion" && (
                    <label className="public-toggle" htmlFor={`public-${question.id}`}>
                      <input id={`public-${question.id}`} type="checkbox" checked={draft.publicAnswers[question.id] ?? false} onChange={(event) => updateVisibility(question.id, event.target.checked)} />
                      Autorizo incluir esta respuesta en mi perfil público.
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="questionnaire-finish">
          <p className="eyebrow">Tu historia ya tiene camino</p>
          <h2>Compártela cuando <em>tú decidas.</em></h2>
          <p>Elige cómo entregar tus respuestas. No se publican, almacenan en servidores ni envían automáticamente.</p>
          <div className="questionnaire-actions">
            <button className="questionnaire-action primary" type="button" onClick={() => void copyAnswers()}>Copiar mi historia ↗</button>
            <button className="questionnaire-action" type="button" onClick={downloadAnswers}>Descargar respuestas ↓</button>
            <button className="questionnaire-action" type="button" onClick={() => void copyAnswers(true)}>Copiar solo perfil público ↗</button>
          </div>
          <p className="questionnaire-message" role="status" aria-live="polite">{message}</p>
        </section>
      </div>
    </div>
  );
}
