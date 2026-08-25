import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { questionnaireSubmissions } from "../../../../db/schema";
import { isClubAdministrator } from "../../../administracion/access";

type StoredAnswer = {
  previousMotorcycles?: Array<{ photoKey?: string | null }>;
};

export async function GET(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!isClubAdministrator(email)) {
    return Response.json({ error: "Acceso no autorizado." }, { status: email ? 403 : 401 });
  }

  const url = new URL(request.url);
  const submissionId = url.searchParams.get("registro");
  const requestedKey = url.searchParams.get("archivo");
  if (!submissionId || !requestedKey || !env.BUCKET) {
    return Response.json({ error: "Fotografía no encontrada." }, { status: 404 });
  }

  const [submission] = await getDb()
    .select()
    .from(questionnaireSubmissions)
    .where(eq(questionnaireSubmissions.id, submissionId))
    .limit(1);

  if (!submission) return Response.json({ error: "Fotografía no encontrada." }, { status: 404 });

  let answers: StoredAnswer = {};
  try {
    answers = JSON.parse(submission.answersJson) as StoredAnswer;
  } catch {
    answers = {};
  }

  const authorizedKeys = new Set([
    submission.profilePhotoKey,
    submission.motorcyclePhotoKey,
    ...(answers.previousMotorcycles ?? []).map((motorcycle) => motorcycle.photoKey),
  ].filter(Boolean));

  if (!authorizedKeys.has(requestedKey)) {
    return Response.json({ error: "Fotografía no encontrada." }, { status: 404 });
  }

  const file = await env.BUCKET.get(requestedKey);
  if (!file) return Response.json({ error: "Fotografía no encontrada." }, { status: 404 });

  const headers = new Headers({ "cache-control": "private, no-store" });
  headers.set("content-type", file.httpMetadata?.contentType ?? "application/octet-stream");
  return new Response(file.body, { headers });
}
