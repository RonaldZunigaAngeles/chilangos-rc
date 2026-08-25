import { notFound } from "next/navigation";
import { requireChatGPTUser } from "../chatgpt-auth";

const CLUB_OWNER_EMAIL = "ronaldzunig@gmail.com";

export function isClubAdministrator(email: string | null | undefined) {
  return email?.trim().toLocaleLowerCase("en-US") === CLUB_OWNER_EMAIL;
}

export async function requireClubAdministrator(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  if (!isClubAdministrator(user.email)) notFound();
  return user;
}
