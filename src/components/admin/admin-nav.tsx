"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/layanan", label: "Layanan & harga" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/pengaturan", label: "Kontak & jam buka" },
] as const;

/** Menu admin: bisa digeser ke samping di layar sempit, halaman aktif ditandai. */
export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menu admin"
      className={cn(
        "-mx-5 flex gap-1 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-ink text-paper" : "text-ink-soft hover:bg-blush/60 hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
