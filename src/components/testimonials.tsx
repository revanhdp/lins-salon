import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { getContent } from "@/lib/content";

const offsets = ["", "lg:mt-14", "lg:mt-6"];
const tints = ["bg-paper", "bg-blush/60", "bg-sage/70"];

export async function Testimonials() {
  const { testimoni } = await getContent();
  if (testimoni.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative -mt-12 rounded-t-[2.5rem] bg-sand pb-28 pt-20 lg:-mt-16 lg:rounded-t-[4rem] lg:pb-40 lg:pt-32"
    >
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="chip">Kata pelanggan</p>
          <h2 id="testimonials-heading" className="display h2-size mt-6">
            Pulang dengan senyum, katanya.
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-3 lg:items-start lg:gap-6">
          {testimoni.map((item, index) => (
            <Reveal
              as="li"
              key={`${item.nama}-${index}`}
              delay={index * 0.08}
              className={cn(offsets[index % offsets.length])}
            >
              <figure
                className={cn(
                  "flex h-full flex-col rounded-[2rem] p-8 sm:p-9",
                  tints[index % tints.length],
                )}
              >
                {item.layanan && (
                  <p className="inline-flex self-start rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-soft">
                    {item.layanan}
                  </p>
                )}
                <blockquote className="display mt-6 flex-1 text-[1.5rem] leading-[1.3] tracking-[-0.015em]">
                  <p>{item.kutipan}</p>
                </blockquote>
                <figcaption className="mt-8 text-sm font-medium text-ink-soft">{item.nama}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
