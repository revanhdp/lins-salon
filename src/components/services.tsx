import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

export function Services() {
  return (
    <section id="layanan" className="section-y bg-sand">
      <div className="shell">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Daftar Layanan</p>
            <h2 className="mt-5 font-serif text-[2.625rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]">
              Perawatan yang dirancang <em className="text-taupe">untuk Anda.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-[1.75] text-ink-soft lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            Tarif tertera merupakan harga awal dan dapat disesuaikan dengan panjang maupun kondisi rambut. Ingin konsultasi terlebih dahulu? Kami selalu siap membantu.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-2 lg:gap-20">
          {salon.layanan.map((kategori, categoryIndex) => (
            <Reveal key={kategori.judul} delay={categoryIndex * 0.1}>
              <div className="flex items-baseline justify-between border-b border-ink pb-4">
                <h3 className="font-serif text-3xl italic text-ink">{kategori.judul}</h3>
                <span className="text-[0.6875rem] tracking-[0.2em] text-taupe">
                  0{categoryIndex + 1}
                </span>
              </div>

              <ul>
                {kategori.layanan.map((item) => (
                  <li
                    key={item.nama}
                    className="group grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 border-b border-line py-6 transition-colors duration-300"
                  >
                    <h4 className="font-serif text-[1.625rem] leading-tight text-ink transition-transform duration-500 ease-soft group-hover:translate-x-1.5">
                      {item.nama}
                    </h4>
                    <p className="self-baseline text-right text-sm text-ink">
                      <span className="mr-1.5 text-[0.6875rem] tracking-[0.12em] text-taupe uppercase">
                        mulai
                      </span>
                      {formatPrice(item.hargaMulai)}
                    </p>
                    <p className="text-sm leading-relaxed text-ink-soft transition-transform duration-500 ease-soft group-hover:translate-x-1.5">
                      {item.deskripsi}
                    </p>
                    {item.durasi && (
                      <p className="text-right text-xs text-ink-soft/80">{item.durasi}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 lg:mt-20">
          <a
            href={getWhatsAppUrl("Halo Lins Salon, saya ingin bertanya lebih lanjut seputar layanan perawatan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-ink underline decoration-ink/25 underline-offset-[6px] transition-colors hover:decoration-ink"
          >
            Konsultasi layanan via WhatsApp
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
