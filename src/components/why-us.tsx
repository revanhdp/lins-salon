import { Clock, MessagesSquare, Sprout, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";

const icons: LucideIcon[] = [Clock, Sprout, MessagesSquare];

export function WhyUs() {
  return (
    <section aria-labelledby="why-heading" className="section-y">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <p className="chip">Kenapa Lins Salon</p>
          <h2 id="why-heading" className="display h2-size mt-6">
            Salon kecil yang bikin betah.
          </h2>
        </Reveal>

        <ol className="lg:col-span-6 lg:col-start-7">
          {salon.keunggulan.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal
                as="li"
                key={item.judul}
                delay={index * 0.08}
                className="flex gap-5 border-b border-dashed border-line py-8 first:pt-0 last:border-b-0 sm:gap-7"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sage text-moss">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="display text-2xl">{item.judul}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-[1.7] text-ink-soft">{item.deskripsi}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
