import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";

export function Testimonials() {
  if (salon.testimoni.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="section-y bg-sand">
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Ulasan &amp; Cerita</p>
          <h2
            id="testimonials-heading"
            className="mt-5 font-serif text-[2.625rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]"
          >
            Cerita dari para <em className="text-taupe">pelanggan</em>
          </h2>
        </Reveal>

        <ul className="mt-14 grid lg:mt-20 lg:grid-cols-3">
          {salon.testimoni.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.nama}-${index}`}
              delay={index * 0.08}
              className="border-t border-line py-10 lg:border-t-0 lg:border-l lg:px-10 lg:py-2 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <figure className="flex h-full flex-col">
                <span aria-hidden="true" className="font-serif text-5xl leading-none text-taupe-light">
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 font-serif text-[1.5rem] leading-[1.35] text-ink">
                  <p>{item.kutipan}</p>
                </blockquote>
                <figcaption className="mt-8 text-sm text-ink">
                  {item.nama}
                  {item.layanan && (
                    <span className="text-ink-soft"> · {item.layanan}</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
