import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { GalleryGrid } from "@/components/gallery-grid";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/lib/content";

/** Jumlah foto yang ditampilkan di beranda. Sisanya ada di halaman /galeri. */
const JUMLAH_DI_BERANDA = 3;

export async function Gallery() {
  const { galeri } = await getContent();
  const total = galeri.length;
  if (total === 0) return null;

  return (
    <section id="galeri" className="section-y">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="chip">Galeri</p>
          <h2 className="display h2-size mt-6">Sedikit hasil kerja kami.</h2>
          <p className="mt-6 max-w-lg text-base leading-[1.75] text-ink-soft">
            Beberapa hasil kerja Lins Salon. Klik foto untuk melihat lebih besar.
          </p>
        </Reveal>

        <div className="mt-14 lg:mt-20">
          <GalleryGrid images={galeri.slice(0, JUMLAH_DI_BERANDA)} variant="preview" />
        </div>

        {total > JUMLAH_DI_BERANDA && (
          <Reveal className="mt-10 lg:mt-14">
            <ButtonLink href="/galeri" variant="outline">
              Lihat semua galeri ({total} foto)
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </ButtonLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
