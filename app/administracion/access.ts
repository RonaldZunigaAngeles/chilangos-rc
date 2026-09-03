import { createHash } from "node:crypto";
import { notFound } from "next/navigation";
import { requireChatGPTUser } from "../chatgpt-auth";

// Huella SHA-256 de la cuenta propietaria. Evita publicar el correo personal
// en texto plano sin cambiar el mecanismo de autorización del sitio.
const CLUB_OWNER_EMAIL_SHA256 = "014765e103da763cd9a86a99da11b5a8eaca98bfae7e29f49a4c72622a201660";

function emailFingerprint(email: string) {
  return createHash("sha256")
    .update(email.trim().toLocaleLowerCase("en-US"), "utf8")
    .digest("hex");
}

export function isClubAdministrator(email: string | null | undefined) {
  return Boolean(email && emailFingerprint(email) === CLUB_OWNER_EMAIL_SHA256);
}

export async function requireClubAdministrator(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  if (!isClubAdministrator(user.email)) notFound();
  return user;
}
