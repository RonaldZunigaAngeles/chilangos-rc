import type { Metadata } from "next";
import { club } from "./data/chilangos";
import "./globals.css";

const title = "Chilangos RC";
const description =
  "La casa digital de Chilangos RC está por arrancar. Si eres parte de la familia, cuéntanos tu historia y construyámosla juntos.";

export const metadata: Metadata = {
  metadataBase: new URL(club.domain),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/chilangos-logo-original.jpg", shortcut: "/chilangos-logo-original.jpg" },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Chilangos RC — Hermandad en cada kilómetro" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: club.name,
  alternateName: "Chilangos Riding Club",
  url: club.domain,
  logo: `${club.domain}/chilangos-logo-original.jpg`,
  foundingDate: club.founded,
  sameAs: [club.instagram, club.facebook],
  address: {
    "@type": "PostalAddress",
    addressLocality: club.location,
    addressCountry: "MX",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
