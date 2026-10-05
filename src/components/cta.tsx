import { ButtonLink } from "@/components/button-link";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { getWhatsAppUrl } from "@/lib/utils";

export function Cta() {
  return (
    <section
      id="reservasi"
      data-hide-mobile-cta
      aria-labelledby="cta-heading"
      className="bg-ink text-ivory"
    >
      <div className="shell py-24 lg:py-36">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-taupe-light">Jadwalkan Kunjungan</p>
            <h2
              id="cta-heading"
              className="mt-6 font-serif text-[2.75rem] leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-[4.5rem]"
            >
              Siap meluangkan waktu <em className="text-taupe-light">untuk diri sendiri?</em>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <p className="max-w-xs text-[0.9375rem] leading-[1.75] text-ivory/70">
              Jadwalkan janji temu Anda berikutnya bersama tim ahli Lins Salon.
            </p>
            <ButtonLink href={getWhatsAppUrl()} variant="light" external className="mt-7">
              <WhatsAppIcon className="h-4 w-4" />
              Reservasi via WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
