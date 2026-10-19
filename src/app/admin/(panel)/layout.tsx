import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { ghostButton } from "@/app/admin/_ui";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <>
      <header className="border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <Link href="/admin" className="display flex h-11 items-center gap-2 text-xl">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rose" />
            Admin
          </Link>
          <AdminNav className="order-last w-full lg:order-none lg:w-auto lg:flex-1" />
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={ghostButton}>
              Lihat website
            </a>
            <form action={logout}>
              <button type="submit" className={ghostButton}>
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="shell py-8 lg:py-14">{children}</main>
    </>
  );
}
