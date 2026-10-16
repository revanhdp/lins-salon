import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { salon } from "@/data/salon";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
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
  themeColor: "#fdf6f3",
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
      className={`${fraunces.variable} ${jakarta.variable}`}
    >
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
