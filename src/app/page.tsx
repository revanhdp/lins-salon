import { About } from "@/components/about";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Location } from "@/components/location";
import { MobileBookingBar } from "@/components/mobile-booking-bar";
import { Navbar } from "@/components/navbar";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { WhyUs } from "@/components/why-us";
import { HariDalamSeminggu, salon } from "@/data/salon";
import { getAddressLines, getMapsUrl } from "@/lib/utils";

const hariKeSchemaMap: Record<HariDalamSeminggu, string> = {
  Senin: "Monday",
  Selasa: "Tuesday",
  Rabu: "Wednesday",
  Kamis: "Thursday",
  Jumat: "Friday",
  Sabtu: "Saturday",
  Minggu: "Sunday",
};

/** Data terstruktur schema.org BeautySalon — hanya memuat informasi yang telah diisi. */
function getStructuredData() {
  const { kontak } = salon;
  const hasAddress = getAddressLines().length > 0;

  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: salon.nama,
    description: salon.deskripsi,
    url: salon.siteUrl,
    image: `${salon.siteUrl}/images/og.jpg`,
    ...(kontak.telepon && { telephone: kontak.telepon }),
    ...(hasAddress && {
      address: {
        "@type": "PostalAddress",
        streetAddress: kontak.alamat.jalan,
        addressLocality: kontak.alamat.kota,
        addressRegion: kontak.alamat.provinsi,
        postalCode: kontak.alamat.kodePos,
        addressCountry: kontak.alamat.negara,
      },
      hasMap: getMapsUrl(),
    }),
    ...(kontak.instagram && {
      sameAs: [`https://www.instagram.com/${kontak.instagram}/`],
    }),
    openingHoursSpecification: salon.jamOperasional
      .filter((entry) => entry.buka && entry.tutup)
      .map((entry) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: entry.hari.map((h) => hariKeSchemaMap[h]),
        opens: entry.buka,
        closes: entry.tutup,
      })),
  };
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <WhyUs />
        <Testimonials />
        <Location />
        <Cta />
      </main>
      <Footer />
      <MobileBookingBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData()).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
