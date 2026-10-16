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
      className="pb-20 pt-10 lg:pb-28"
    >
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-rose px-7 py-16 text-paper sm:rounded-[3rem] sm:px-14 lg:px-20 lg:py-24">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[28px] border-paper/10 lg:-right-16 lg:-top-32 lg:h-[30rem] lg:w-[30rem] lg:border-[44px]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-24 hidden h-56 w-56 rounded-full bg-rose-deep/40 lg:block"
            />

            <div className="relative max-w-2xl">
              <h2 id="cta-heading" className="display text-[2.75rem] sm:text-6xl lg:text-[4.5rem]">
                Waktunya sisihkan satu jam untukmu.
              </h2>
              <p className="mt-6 max-w-md text-base leading-[1.7] text-paper/85">
                Kirim pesan lewat WhatsApp, pilih jadwal yang cocok, dan kami siapkan sisanya.
              </p>
              <ButtonLink href={getWhatsAppUrl()} variant="light" external className="mt-9">
                <WhatsAppIcon className="h-4 w-4" />
                Booking via WhatsApp
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
