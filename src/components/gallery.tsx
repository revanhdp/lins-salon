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
        <Reveal className="max-w-2xl">
          <p className="chip">Galeri</p>
          <h2 className="display h2-size mt-6">Sedikit intip hasil kerja kami.</h2>
          <p className="mt-6 max-w-lg text-base leading-[1.75] text-ink-soft">
            Tata rambut, pewarnaan, creambath, sampai perawatan kecantikan. Klik foto untuk melihat lebih besar.
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-10">
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
                    "group relative block w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-sand sm:rounded-[2rem]",
                    slot.frame,
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={slot.sizes}
                    className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3.5 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm sm:bottom-4 sm:left-4">
                    {image.kategori}
                  </span>
                </button>
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
            className="fixed inset-0 z-[60] flex flex-col bg-plum/95 text-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={close}
          >
            <div className="shell flex h-16 shrink-0 items-center justify-between">
              <p className="text-sm font-medium text-paper/80">
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                <span className="mx-3 text-paper/30">·</span>
                {current.kategori}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Tutup penampil gambar"
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
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
                    className="rounded-2xl object-contain"
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
                className="absolute left-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:left-4"
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
                className="absolute right-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:right-4"
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
