"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { cn, getWhatsAppUrl } from "@/lib/utils";

/**
 * Bar reservasi khusus tampilan mobile. Tetap tersembunyi ketika section yang
 * telah memiliki tombol reservasi (bertanda `data-hide-mobile-cta`) sedang terlihat.
 */
export function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-hide-mobile-cta]");
    if (targets.length === 0) return;

    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size === 0);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-[transform,opacity] duration-500 ease-soft md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        className="flex h-13 items-center justify-center gap-2.5 rounded-full bg-rose text-sm font-semibold text-paper shadow-[0_12px_30px_-10px_rgba(143,61,82,0.5)]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Booking via WhatsApp
      </a>
    </div>
  );
}
