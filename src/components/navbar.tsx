"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navigation, salon } from "@/data/salon";
import { cn, getWhatsAppUrl } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled || open
          ? "border-b border-line/70 bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Lewati ke konten utama
      </a>

      <nav
        aria-label="Navigasi Utama"
        className={cn(
          "shell flex items-center justify-between transition-[height] duration-500 ease-soft",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <a
          href="#beranda"
          onClick={close}
          className="display flex items-center gap-2 text-2xl text-ink"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rose" />
          Lins Salon
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="relative py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-rose after:transition-transform after:duration-500 hover:after:scale-x-100"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "hidden items-center rounded-full bg-rose px-6 text-sm font-semibold text-paper transition-[background-color,height] duration-500 hover:bg-rose-deep md:inline-flex",
            scrolled ? "h-10" : "h-11",
          )}
        >
          Booking Sekarang
        </a>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-ink md:hidden"
        >
          {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Menu mobile */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "overflow-y-auto border-t border-line/70 bg-paper md:hidden",
          scrolled ? "h-[calc(100dvh-4rem)]" : "h-[calc(100dvh-5rem)]",
        )}
      >
        <div className="shell flex h-full flex-col justify-between pb-10 pt-8">
          <ul className="space-y-1">
            {navigation.map((item, index) => (
              <li
                key={item.href}
                className="animate-rise"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <a
                  href={item.href}
                  onClick={close}
                  className="display flex items-center justify-between border-b border-dashed border-line py-5 text-[2rem] leading-none text-ink"
                >
                  {item.label}
                  <ArrowUpRight className="h-5 w-5 text-rose" strokeWidth={1.75} />
                </a>
              </li>
            ))}
          </ul>

          <div className="space-y-5 pt-10">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex h-13 items-center justify-center rounded-full bg-rose text-sm font-semibold text-paper"
            >
              Booking Sekarang
            </a>
            <p className="text-center text-xs text-ink-soft">
              {salon.jamOperasional
                .filter((h) => h.buka)
                .map((h) => `${h.label} · ${h.buka} — ${h.tutup} WIB`)
                .join(" ")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
