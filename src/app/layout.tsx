import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { salon } from "@/data/salon";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const title = `${salon.nama} — ${salon.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(salon.siteUrl),
  title: {
    default: title,
    template: `%s · ${salon.nama}`,
  },
  description: salon.deskripsi,
  applicationName: salon.nama,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: salon.nama,
    title,
    description: salon.deskripsi,
    locale: "id_ID",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: `Suasana interior ${salon.nama}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: salon.deskripsi,
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${manrope.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
