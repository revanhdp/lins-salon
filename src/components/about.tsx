import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/lib/content";

export async function About() {
  const { galeri } = await getContent();
  const gambarInset = galeri[0];

  return (
    <section id="tentang" className="section-y pb-32 lg:pb-44">
      <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/salon.jpg"
              alt="Kursi salon nyaman dengan cermin bundar berlatar cahaya lembut di Lins Salon"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[48%_50%]"
            />
          </div>
          {gambarInset && (
            <div className="absolute -bottom-10 -right-2 h-36 w-36 overflow-hidden rounded-full border-[6px] border-paper bg-sand shadow-[0_18px_40px_-18px_rgba(74,40,56,0.35)] sm:-right-8 sm:h-48 sm:w-48">
              <Image
                src={gambarInset.src}
                alt={gambarInset.alt}
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          )}
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          <p className="chip">Tentang Lins Salon</p>
          <h2 className="display h2-size mt-6">Dengarkan dulu, baru dikerjakan.</h2>
          <div className="mt-8 space-y-5 text-base leading-[1.75] text-ink-soft">
            <p>
              Bagi kami, perawatan yang baik mulai dari mendengar. Sebelum apa pun dikerjakan, kami ngobrol soal jenis rambutmu, kondisi kulit, dan rutinitas sehari-hari, supaya hasilnya enak dilihat dan gampang dirawat sendiri di rumah.
            </p>
            <p>
              Lins Salon kami siapkan sebagai tempat yang tenang untuk rehat sebentar, dimanjakan dengan teliti, lalu pulang dengan perasaan segar.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
