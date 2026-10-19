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
import { type SiteContent, salon } from "@/data/salon";
import { getContent } from "@/lib/content";
import { getAddressLines, getMapsUrl, getWhatsAppUrl } from "@/lib/utils";

/** Halaman dibuat ulang paling lama tiap 60 detik; perubahan di admin langsung menyegarkan cache. */
export const revalidate = 60;

/** Data terstruktur schema.org BeautySalon — hanya memuat informasi yang telah diisi. */
function getStructuredData({ kontak }: SiteContent) {
  const hasAddress = getAddressLines(kontak).length > 0;

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
      hasMap: getMapsUrl(kontak),
    }),
    ...(kontak.instagram && {
      sameAs: [`https://www.instagram.com/${kontak.instagram}/`],
    }),
  };
}

export default async function Home() {
  const content = await getContent();
  const whatsappUrl = getWhatsAppUrl(content.kontak);

  return (
    <>
      <Navbar whatsappUrl={whatsappUrl} jamOperasional={content.jamOperasional} />
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
      <MobileBookingBar whatsappUrl={whatsappUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData(content)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
