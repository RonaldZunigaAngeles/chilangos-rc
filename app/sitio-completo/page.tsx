import type { Metadata } from "next";
import { requireClubAdministrator } from "../administracion/access";
import ClubHome from "../components/club-home";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function CompleteClubSitePage() {
  await requireClubAdministrator("/sitio-completo");
  return <ClubHome />;
}
