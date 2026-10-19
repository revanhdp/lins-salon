import type { ReactNode } from "react";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-line bg-white/80 px-3.5 py-3 text-base text-ink sm:py-2.5 sm:text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-rose";
export const primaryButton =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-rose px-5 text-sm sm:h-10 font-semibold text-paper transition-colors hover:bg-rose-deep";
export const ghostButton =
  "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-ink/15 px-4 text-xs sm:h-9 sm:min-w-9 font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";
export const dangerButton =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-rose/30 px-4 text-xs sm:h-9 font-semibold text-rose-deep transition-colors hover:bg-rose hover:text-paper";
export const card = "rounded-2xl border border-line bg-white/60 p-5 sm:p-6";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="display text-3xl sm:text-4xl">{title}</h1>
      {children && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{children}</p>}
    </header>
  );
}

/** Pesan hasil aksi terakhir (dibaca dari ?ok= atau ?err= di URL). */
export function Flash({ ok, err }: { ok?: string; err?: string }) {
  if (!ok && !err) return null;
  return (
    <p
      role={err ? "alert" : "status"}
      className={cn(
        "mb-6 rounded-xl px-4 py-3 text-sm font-medium",
        err ? "bg-rose/10 text-rose-deep" : "bg-sage text-moss",
      )}
    >
      {err ?? ok}
    </p>
  );
}

type FormAction = (formData: FormData) => void | Promise<void>;

/** Tombol naik/turun untuk mengubah urutan. */
export function MoveButtons({ action, id, first, last }: { action: FormAction; id: string; first: boolean; last: boolean }) {
  return (
    <>
      {(["up", "down"] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <button
            type="submit"
            disabled={dir === "up" ? first : last}
            aria-label={dir === "up" ? "Naikkan" : "Turunkan"}
            className={ghostButton}
          >
            {dir === "up" ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </>
  );
}

export function DeleteButton({ action, id, message }: { action: FormAction; id: string; message: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <ConfirmButton message={message} className={dangerButton}>
        Hapus
      </ConfirmButton>
    </form>
  );
}
