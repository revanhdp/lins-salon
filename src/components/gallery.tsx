"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { salon } from "@/data/salon";
import { cn } from "@/lib/utils";

const slots = [
  { item: "col-span-1 lg:col-span-5", frame: "aspect-[3/4] lg:aspect-[4/5]", sizes: "(min-width: 1024px) 40vw, 50vw" },
  { item: "col-span-1 lg:col-span-7 lg:self-end", frame: "aspect-[3/4] lg:aspect-[4/3]", sizes: "(min-width: 1024px) 55vw, 50vw" },
  { item: "col-span-2 lg:col-span-7 lg:self-start", frame: "aspect-[4/3]", sizes: "(min-width: 1024px) 55vw, 100vw" },
  { item: "col-span-1 lg:col-span-5", frame: "aspect-[3/4] lg:aspect-[4/5]", sizes: "(min-width: 1024px) 40vw, 50vw" },
  { item: "col-span-1 lg:col-span-4 lg:col-start-2", frame: "aspect-[3/4]", sizes: "(min-width: 1024px) 32vw, 50vw" },
  { item: "col-span-2 lg:col-span-6 lg:col-start-7 lg:self-center", frame: "aspect-[4/3] lg:aspect-[3/2]", sizes: "(min-width: 1024px) 48vw, 100vw" },
] as const;

const images = salon.galeri;

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    setActive((current) =>
      current === null ? current : (current + direction + images.length) % images.length,
    );
  }, []);

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, step]);

  const current = active === null ? null : images[active];

  return (
    <section id="galeri" className="section-y">
      <div className="shell">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Galeri Karya</p>
            <h2 className="mt-5 font-serif text-[2.625rem] leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.5rem]">
              Sekilas hasil <em className="text-taupe">karya kami.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-[1.75] text-ink-soft lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            Sentuhan detail dari salon kami — tata rambut, pewarnaan, creambath, dan perawatan kecantikan.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
          {images.map((image, index) => {
            const slot = slots[index % slots.length];
            return (
              <Reveal
                as="li"
                key={image.src}
                delay={(index % 2) * 0.08}
                className={slot.item}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setActive(index);
                  }}
                  aria-label={`Lihat foto lebih besar: ${image.alt}`}
                  className={cn(
                    "group relative block w-full cursor-zoom-in overflow-hidden bg-sand",
                    slot.frame,
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={slot.sizes}
                    className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.03]"
                  />
                </button>
                <p className="mt-3 hidden justify-between text-[0.6875rem] tracking-[0.2em] text-ink-soft uppercase md:flex">
                  <span>{image.kategori}</span>
                  <span className="text-taupe">{String(index + 1).padStart(2, "0")}</span>
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {current && active !== null && (
          <m.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Penampil gambar"
            className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={close}
          >
            <div className="shell flex h-16 shrink-0 items-center justify-between">
              <p className="text-[0.6875rem] tracking-[0.2em] uppercase text-ivory/70">
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                <span className="mx-3 text-ivory/30">—</span>
                {current.kategori}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Tutup penampil gambar"
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ivory/80 transition-colors hover:text-ivory"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex-1 px-4 pb-6 sm:px-20">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={current.src}
                  className="relative h-full w-full"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    onClick={(event) => event.stopPropagation()}
                  />
                </m.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ivory/70 transition-colors hover:text-ivory sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Foto selanjutnya"
                className="absolute right-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ivory/70 transition-colors hover:text-ivory sm:right-4"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.25} />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
