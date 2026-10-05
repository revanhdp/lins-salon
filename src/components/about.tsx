import Image from "next/image";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="tentang" className="section-y">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/salon.jpg"
              alt="Kursi salon nyaman dengan cermin bulat berlatar cahaya lembut di Lins Salon"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[48%_50%]"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          <p className="eyebrow">Tentang Lins Salon</p>
          <h2 className="mt-5 font-serif text-[2.625rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]">
            Waktu istimewa <em className="text-taupe">untuk diri sendiri.</em>
          </h2>
          <div className="mt-8 space-y-5 text-[0.9375rem] leading-[1.8] text-ink-soft">
            <p>
              Kami meyakini bahwa perawatan yang baik bermula dari mendengarkan. Sebelum proses apa pun dimulai, kami meluangkan waktu untuk memahami jenis rambut, kondisi kulit, serta rutinitas harian Anda — sehingga hasilnya tampak alami dan mudah dirawat di rumah.
            </p>
            <p>
              Lins Salon hadir sebagai tempat yang hening untuk rehat sejenak, dimanjakan dengan teliti, dan pulang dengan rasa percaya diri yang segar.
            </p>
          </div>
          <p className="mt-10 font-serif text-xl italic text-ink">
            — Tim Lins Salon
          </p>
        </Reveal>
      </div>
    </section>
  );
}
