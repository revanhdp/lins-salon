import Image from "next/image";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppIcon } from "@/components/icons";
import { OpenStatusChip } from "@/components/open-status";
import { salon } from "@/data/salon";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

export function Hero() {
  const weekdayHours = salon.jamOperasional.find((h) => h.buka);
  const featured = salon.layanan[0].layanan[0];
  const totalLayanan = salon.layanan.reduce((sum, k) => sum + k.layanan.length, 0);

  return (
    <section
      id="beranda"
      data-hide-mobile-cta
      className="relative overflow-hidden pt-28 lg:pt-32"
    >
      <div className="shell grid items-center gap-14 pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <div className="lg:col-span-7">
          <OpenStatusChip className="animate-rise" />

          <h1
            className="display animate-rise mt-6 text-[3.5rem] leading-[0.98] sm:text-7xl lg:text-[6rem] xl:text-[6.75rem]"
            style={{ animationDelay: "80ms" }}
          >
            Rambut rapi, hati ikut{" "}
            <span className="relative inline-block text-rose">
              tenang.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-[0.18em] w-full overflow-visible"
              >
                <path
                  d="M3 13 C 40 3, 70 3, 105 11 S 175 19, 210 9 S 270 3, 297 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  className="animate-draw"
                />
              </svg>
            </span>
          </h1>

          <p
            className="animate-rise mt-8 max-w-md text-base leading-[1.7] text-ink-soft lg:text-[1.0625rem]"
            style={{ animationDelay: "160ms" }}
          >
            Salon lokal untuk potong, warna, creambath, sampai perawatan kuku. Datang dengan penat, pulang dengan segar, tanpa buru-buru.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-3"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href={getWhatsAppUrl()} external>
              <WhatsAppIcon className="h-4 w-4" />
              Booking via WhatsApp
            </ButtonLink>
            <ButtonLink href="#layanan" variant="text">
              Lihat daftar harga
            </ButtonLink>
          </div>

          <ul
            className="animate-rise mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-soft"
            style={{ animationDelay: "320ms" }}
          >
            {weekdayHours && (
              <li>
                <span className="font-semibold text-ink">{weekdayHours.label}</span>{" "}
                {weekdayHours.buka}–{weekdayHours.tutup} WIB
              </li>
            )}
            <li>
              <span className="font-semibold text-ink">{totalLayanan} layanan</span> rambut &amp; kecantikan
            </li>
          </ul>
        </div>

        <figure className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -right-5 -top-5 h-44 w-44 rounded-full bg-blush sm:-right-8 sm:h-56 sm:w-56"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-sand">
            <Image
              src="/images/hero.jpg"
              alt="Pelanggan bersantai dalam suasana hangat dan tenang di Lins Salon"
              fill
              preload
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="animate-settle object-cover object-[50%_35%]"
            />
          </div>

          <figcaption
            className="animate-rise absolute -bottom-6 left-0 rounded-2xl bg-paper p-4 pr-6 shadow-[0_18px_40px_-18px_rgba(74,40,56,0.35)] sm:-left-6"
            style={{ animationDelay: "480ms" }}
          >
            <p className="text-xs text-ink-soft">Tarif awal</p>
            <p className="display mt-1 text-xl">{featured.nama}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              <span className="font-semibold text-rose">{formatPrice(featured.hargaMulai)}</span>
              {featured.durasi && ` · ${featured.durasi}`}
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
