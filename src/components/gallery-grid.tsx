"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import type { FotoGaleri } from "@/data/salon";
import { cn } from "@/lib/utils";

/** Posisi tiap foto di grid desktop varian "preview" (3 kolom, bergeser vertikal). */
const previewOffsets = ["", "lg:mt-14", "lg:mt-6"] as const;

interface GalleryGridProps {
  images: FotoGaleri[];
  /** `preview`: carousel di mobile, 3 kolom bergeser di desktop. `full`: grid penuh. */
  variant?: "preview" | "full";
  /** Jumlah foto pertama yang dimuat segera (untuk foto di atas lipatan layar). */
  eagerCount?: number;
}

export function GalleryGrid({ images, variant = "full", eagerCount = 0 }: GalleryGridProps) {
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
  }, [images.length]);

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

  const isPreview = variant === "preview";

  return (
    <>
      <ul
        className={cn(
          isPreview
            ? "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            : "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6",
        )}
      >
        {images.map((image, index) => (
          <Reveal
            as="li"
            key={image.src}
            delay={(index % 3) * 0.08}
            className={cn(
              isPreview
                ? cn("w-[72%] shrink-0 snap-center sm:w-[44%] lg:w-auto", previewOffsets[index % previewOffsets.length])
                : "lg:[&:nth-child(3n+2)]:mt-12",
            )}
          >
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActive(index);
              }}
              aria-label={`Lihat foto lebih besar: ${image.alt}`}
              className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-sand sm:rounded-[2rem]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading={index < eagerCount ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 72vw"
                className="object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-[1.04]"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-paper/90 px-3.5 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm sm:bottom-4 sm:left-4">
                {image.label ?? image.kategori}
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

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
                {current.label ?? current.kategori}
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
    </>
  );
}
