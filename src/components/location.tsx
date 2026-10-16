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
    <section id="kontak" data-hide-mobile-cta className="section-y pb-16 lg:pb-24">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <p className="chip">Lokasi &amp; jam buka</p>
          <h2 className="display h2-size mt-6">Mampir ke Lins Salon.</h2>

          <address className="mt-10 not-italic">
            <p className="text-sm font-semibold text-rose-deep">Alamat</p>
            <p className="display mt-2 text-2xl leading-snug">
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

            <p className="mt-8 text-sm font-semibold text-rose-deep">Telepon</p>
            <p className="mt-2 text-base">
              {phoneUrl ? (
                <a href={phoneUrl} className="underline decoration-rose/50 decoration-2 underline-offset-4 hover:decoration-rose">
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
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </ButtonLink>
            {phoneUrl && (
              <ButtonLink href={phoneUrl} variant="outline">
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                Telepon
              </ButtonLink>
            )}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-6" delay={0.1}>
          <div className="rounded-[2rem] bg-sand p-8 sm:p-10">
            <h3 className="display text-3xl">Jam operasional</h3>
            <dl className="mt-6">
              {salon.jamOperasional.map((entry) => (
                <div
                  key={entry.label}
                  className="flex items-baseline justify-between gap-6 border-b border-dashed border-line py-5 last:border-b-0"
                >
                  <dt className="text-base font-medium">{entry.label}</dt>
                  <dd className="text-base font-semibold tabular-nums">
                    {entry.buka && entry.tutup ? (
                      <time>
                        {entry.buka} – {entry.tutup} WIB
                      </time>
                    ) : (
                      <span className="font-normal text-ink-soft">Tutup</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-[1.7] text-ink-soft">
              Datang langsung boleh, selama jadwal masih ada. Biar tidak perlu menunggu, sebaiknya booking dulu lewat WhatsApp.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
