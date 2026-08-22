import type { Metadata } from "next";
import "./globals.css";

const title = "Chilangos RC";
const description =
  "Un riding club nacido en la Ciudad de México. Rodadas, amistad, destinos y hermandad en cada kilómetro desde 2022.";

export const metadata: Metadata = {
  metadataBase: new URL("https://chilangosrc.com"),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Chilangos RC — Hermandad en cada kilómetro" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
