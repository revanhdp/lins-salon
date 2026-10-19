import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/button-link";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { GalleryGrid } from "@/components/gallery-grid";
import { MobileBookingBar } from "@/components/mobile-booking-bar";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";
import { getContent } from "@/lib/content";
import { getWhatsAppUrl } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { galeri } = await getContent();
  const description = `Galeri hasil kerja ${salon.nama}: ${galeri.length} foto perawatan rambut dan kecantikan.`;
  return {
    title: "Galeri",
    description,
    alternates: { canonical: "/galeri" },
    openGraph: { url: "/galeri", title: `Galeri · ${salon.nama}`, description },
  };
}

export default async function GaleriPage() {
  const { kontak, jamOperasional, galeri } = await getContent();
  const whatsappUrl = getWhatsAppUrl(kontak);

  return (
    <>
      <Navbar whatsappUrl={whatsappUrl} jamOperasional={jamOperasional} />
      <main id="main">
        <section aria-labelledby="galeri-heading" className="pb-24 pt-32 lg:pb-36 lg:pt-40">
          <div className="shell">
            <Reveal className="max-w-2xl">
              <div className="mb-3">
                <ButtonLink href="/" variant="text">
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                    strokeWidth={1.75}
                  />
                  Kembali ke beranda
                </ButtonLink>
              </div>
              <p className="chip">Galeri</p>
              <h1 id="galeri-heading" className="display h2-size mt-6">
                Semua hasil kerja kami.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-[1.75] text-ink-soft">
                {galeri.length} foto hasil kerja Lins Salon. Klik foto untuk melihat lebih besar, lalu geser dengan tombol panah.
              </p>
            </Reveal>

            <div className="mt-14 lg:mt-20">
              {galeri.length > 0 ? (
                <GalleryGrid images={galeri} variant="full" eagerCount={3} />
              ) : (
                <p className="text-ink-soft">Belum ada foto di galeri.</p>
              )}
            </div>
          </div>
        </section>
        <Cta />
      </main>
      <Footer />
      <MobileBookingBar whatsappUrl={whatsappUrl} />
    </>
  );
}
