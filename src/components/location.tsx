import { ArrowUpRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";
import { getAddressLines, getMapsUrl, getPhoneUrl, getWhatsAppUrl } from "@/lib/utils";

export function Location() {
  const addressLines = getAddressLines();
  const phoneUrl = getPhoneUrl();

  return (
    <section id="kontak" data-hide-mobile-cta className="section-y">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow">Lokasi &amp; Jam Buka</p>
          <h2 className="mt-5 font-serif text-[2.625rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]">
            Kunjungi <em className="text-taupe">Lins Salon</em>
          </h2>

          <address className="mt-10 not-italic">
            <p className="text-[0.6875rem] tracking-[0.2em] text-ink-soft uppercase">Alamat</p>
            <p className="mt-3 font-serif text-2xl leading-snug text-ink">
              {addressLines.length > 0 ? (
                addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))
              ) : (
                <span className="text-ink-soft">[Alamat salon belum diatur]</span>
              )}
            </p>

            <p className="mt-8 text-[0.6875rem] tracking-[0.2em] text-ink-soft uppercase">Telepon</p>
            <p className="mt-3 text-[0.9375rem] text-ink">
              {phoneUrl ? (
                <a href={phoneUrl} className="underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                  {salon.kontak.telepon}
                </a>
              ) : (
                <span className="text-ink-soft">[Nomor telepon belum diatur]</span>
              )}
            </p>
          </address>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={getWhatsAppUrl()} external>
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </ButtonLink>
            <ButtonLink href={getMapsUrl()} variant="outline" external>
              Buka Google Maps
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </ButtonLink>
            {phoneUrl && (
              <ButtonLink href={phoneUrl} variant="outline">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                Hubungi
              </ButtonLink>
            )}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-24" delay={0.1}>
          <h3 className="text-[0.6875rem] tracking-[0.2em] text-ink-soft uppercase">Jam Operasional</h3>
          <dl className="mt-5 border-t border-ink">
            {salon.jamOperasional.map((entry) => (
              <div
                key={entry.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-6"
              >
                <dt className="font-serif text-2xl text-ink">{entry.label}</dt>
                <dd className="text-[0.9375rem] tabular-nums text-ink">
                  {entry.buka && entry.tutup ? (
                    <time>
                      {entry.buka} — {entry.tutup} WIB
                    </time>
                  ) : (
                    <span className="text-ink-soft">Tutup</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-[1.75] text-ink-soft">
            Kedatangan langsung (walk-in) selalu kami sambut saat jadwal tersedia. Untuk kenyamanan Anda tanpa waktu tunggu, kami sarankan melakukan reservasi terlebih dahulu melalui WhatsApp.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
