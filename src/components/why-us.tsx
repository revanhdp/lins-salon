import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="pb-24 lg:pb-36">
      <div className="shell">
        <div className="grid gap-12 border-t border-line pt-14 lg:grid-cols-12 lg:pt-20">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Nilai Pelayanan Kami</p>
            <h2
              id="why-heading"
              className="mt-5 font-serif text-[2.25rem] leading-[1.06] text-ink sm:text-[2.75rem]"
            >
              Pengalaman yang <em className="text-taupe">menanti Anda.</em>
            </h2>
          </Reveal>

          <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-8 lg:gap-12">
            {salon.keunggulan.map((item, index) => (
              <Reveal as="li" key={item.judul} delay={index * 0.08}>
                <span className="font-serif text-lg italic text-taupe">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[0.9375rem] font-semibold tracking-[0.01em] text-ink">
                  {item.judul}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-ink-soft">{item.deskripsi}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
