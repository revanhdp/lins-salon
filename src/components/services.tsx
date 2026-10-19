import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/lib/content";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

export async function Services() {
  const { kontak, layanan } = await getContent();

  return (
    <section
      id="layanan"
      className="relative -mt-12 rounded-t-[2.5rem] bg-sand pb-24 pt-20 lg:-mt-16 lg:rounded-t-[4rem] lg:pb-36 lg:pt-32"
    >
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="chip">Daftar harga</p>
          <h2 className="display h2-size mt-6">Pilih perawatan, lihat harganya.</h2>
          <p className="mt-6 max-w-lg text-base leading-[1.75] text-ink-soft">
            Tarif di bawah adalah harga awal. Angka akhir menyesuaikan panjang dan kondisi rambutmu. Masih bingung pilih yang mana? Tanya dulu lewat WhatsApp.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          {layanan.map((kategori, categoryIndex) => (
            <Reveal key={kategori.judul} delay={categoryIndex * 0.1}>
              <div className="h-full rounded-[2rem] bg-paper p-7 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="display text-3xl sm:text-4xl">{kategori.judul}</h3>
                  <span className="chip bg-sage text-moss">{kategori.layanan.length} layanan</span>
                </div>

                <ul className="mt-4">
                  {kategori.layanan.map((item) => (
                    <li
                      key={item.nama}
                      className="group border-b border-dashed border-line py-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="display text-[1.375rem] transition-colors duration-300 group-hover:text-rose sm:text-2xl">
                          {item.nama}
                        </h4>
                        <span
                          aria-hidden="true"
                          className="mb-1.5 hidden min-w-4 flex-1 border-b-2 border-dotted border-ink/20 sm:block"
                        />
                        <p className="whitespace-nowrap text-[0.9375rem] font-semibold tabular-nums">
                          <span className="mr-1.5 text-xs font-normal text-ink-soft">mulai</span>
                          {formatPrice(item.hargaMulai)}
                        </p>
                      </div>
                      <p className="mt-2 max-w-[28rem] text-sm leading-relaxed text-ink-soft">
                        {item.deskripsi}
                      </p>
                      {item.durasi && (
                        <p className="mt-3 inline-flex rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink-soft">
                          {item.durasi}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 lg:mt-16">
          <ButtonLink
            href={getWhatsAppUrl(kontak, "Halo Lins Salon, saya ingin bertanya lebih lanjut seputar layanan perawatan.")}
            external
            variant="outline"
          >
            Tanya layanan via WhatsApp
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
