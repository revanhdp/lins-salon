"use client";

import { useEffect, useState } from "react";
import type { JamOperasional } from "@/data/salon";
import { cn, getOpenStatus, type OpenStatus } from "@/lib/utils";

/** Penanda buka/tutup. Dihitung di browser agar sesuai waktu saat halaman dilihat. */
export function OpenStatusChip({
  jamOperasional,
  className,
}: {
  jamOperasional: JamOperasional[];
  className?: string;
}) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date(), jamOperasional));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [jamOperasional]);

  return (
    <p
      className={cn(
        "chip min-h-8 transition-opacity duration-500",
        status ? "opacity-100" : "opacity-0",
        status?.open ? "bg-sage text-moss" : "",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 rounded-full bg-current",
          status?.open && "animate-pulse-dot",
        )}
      />
      {status?.label ?? " "}
    </p>
  );
}
