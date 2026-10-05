import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppIcon } from "@/components/icons";
import { salon } from "@/data/salon";
import { getWhatsAppUrl } from "@/lib/utils";

export function Hero() {
  const weekdayHours = salon.jamOperasional.find((h) => h.buka);

  return (
    <section
      id="beranda"
      data-hide-mobile-cta
      className="relative overflow-hidden pt-24 lg:pt-20"
    >
      <div className="shell grid items-end gap-10 pb-16 lg:min-h-[min(calc(100svh-5rem),54rem)] lg:grid-cols-12 lg:gap-12 lg:pb-12">
        {/* Konten Teks */}
        <div className="pt-6 lg:col-span-6 lg:self-center lg:pt-0 xl:col-span-5">
          <p className="eyebrow animate-rise">Kecantikan • Perawatan • Percaya Diri</p>

          <h1
            className="animate-rise mt-6 font-serif text-[3.25rem] leading-[0.98] tracking-[-0.015em] text-ink sm:text-7xl lg:text-[5.25rem] xl:text-[5.75rem]"
            style={{ animationDelay: "80ms" }}
          >
            Kecantikan yang terasa <em className="font-normal text-taupe">seperti diri Anda.</em>
          </h1>

          <p
            className="animate-rise mt-7 max-w-[26rem] text-[0.9375rem] leading-[1.75] text-ink-soft lg:mt-9"
            style={{ animationDelay: "160ms" }}
          >
            Lins Salon adalah salon kecantikan lokal di mana setiap kunjungan selalu diawali dengan percakapan hangat. Potong rambut, pewarnaan, perawatan relaksasi, hingga kuku — dikerjakan penuh ketelitian dalam suasana yang tenang.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 lg:mt-11"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href={getWhatsAppUrl()} external>
              <WhatsAppIcon className="h-4 w-4" />
              Reservasi via WhatsApp
            </ButtonLink>
            <ButtonLink href="#layanan" variant="text">
              Lihat Layanan
            </ButtonLink>
          </div>

          {weekdayHours && (
            <p
              className="animate-rise mt-12 hidden border-t border-line pt-5 text-xs tracking-[0.04em] text-ink-soft lg:block"
              style={{ animationDelay: "320ms" }}
            >
              Buka {weekdayHours.label}, {weekdayHours.buka} — {weekdayHours.tutup} WIB
            </p>
          )}
        </div>

        {/* Foto Editorial */}
        <figure className="relative -mx-5 sm:mx-0 lg:col-span-6 lg:col-start-7 lg:self-stretch lg:pt-8 xl:col-span-6 xl:col-start-7">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand sm:aspect-[5/6] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
            <Image
              src="/images/hero.jpg"
              alt="Pelanggan bersantai dalam suasana hangat dan tenang di Lins Salon"
              fill
              preload
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="animate-settle object-cover object-[50%_35%]"
            />
          </div>
          <figcaption className="mt-3 flex justify-between px-5 text-[0.6875rem] tracking-[0.2em] text-ink-soft uppercase sm:px-0">
            <span>{salon.nama}</span>
            <span>{salon.tagline}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
