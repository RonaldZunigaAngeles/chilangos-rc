import { env } from "cloudflare:workers";
import { like } from "drizzle-orm";
import { getDb } from "../../../../db";
import { collaborationRequests, questionnaireSubmissions, rideSafetySubmissions } from "../../../../db/schema";
import { isClubAdministrator } from "../../../administracion/access";

type StoredAnswers = {
  previousMotorcycles?: Array<{ photoKey?: string | null }>;
};

export async function POST(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!isClubAdministrator(email)) {
    return Response.json({ error: "Solo la cuenta propietaria puede limpiar datos de prueba." }, { status: email ? 403 : 401 });
  }

  let runId = "";
  try {
    const payload = await request.json() as { runId?: unknown };
    runId = typeof payload.runId === "string" ? payload.runId.trim().toLocaleUpperCase("en-US") : "";
  } catch {
    return Response.json({ error: "No pudimos leer el identificador de la prueba." }, { status: 400 });
  }

  if (!/^[A-Z0-9]{4,24}$/.test(runId)) {
    return Response.json({ error: "El identificador de prueba no es válido." }, { status: 400 });
  }

  const pattern = `QA_CHILANGOS_${runId}_%`;
  const db = getDb();
  const biographies = await db.select().from(questionnaireSubmissions).where(like(questionnaireSubmissions.alias, pattern));
  const imageKeys = new Set<string>();

  for (const biography of biographies) {
    if (biography.profilePhotoKey) imageKeys.add(biography.profilePhotoKey);
    if (biography.motorcyclePhotoKey) imageKeys.add(biography.motorcyclePhotoKey);
    try {
      const answers = JSON.parse(biography.answersJson) as StoredAnswers;
      for (const motorcycle of answers.previousMotorcycles ?? []) {
        if (motorcycle.photoKey) imageKeys.add(motorcycle.photoKey);
      }
    } catch {
      // Si una respuesta de prueba está incompleta, todavía se pueden limpiar sus registros.
    }
  }

  if (env.BUCKET && imageKeys.size > 0) {
    await Promise.all(Array.from(imageKeys, (key) => env.BUCKET.delete(key)));
  }

  const removedBiographies = await db.delete(questionnaireSubmissions)
    .where(like(questionnaireSubmissions.alias, pattern))
    .returning({ id: questionnaireSubmissions.id });
  const removedSafetyRecords = await db.delete(rideSafetySubmissions)
    .where(like(rideSafetySubmissions.alias, pattern))
    .returning({ id: rideSafetySubmissions.id });
  const removedCollaborations = await db.delete(collaborationRequests)
    .where(like(collaborationRequests.businessName, pattern))
    .returning({ id: collaborationRequests.id });

  return Response.json({
    cleaned: true,
    runId,
    biographies: removedBiographies.length,
    safetyRecords: removedSafetyRecords.length,
    collaborations: removedCollaborations.length,
    images: imageKeys.size,
  });
}
