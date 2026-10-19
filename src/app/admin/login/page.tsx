import { redirect } from "next/navigation";
import { login } from "@/app/admin/actions";
import { Field, Flash, inputClass, primaryButton } from "@/app/admin/_ui";
import { isAdmin } from "@/lib/auth";

export const metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { err } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-16">
      <p className="display flex items-center gap-2 text-2xl">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rose" />
        Lins Salon
      </p>
      <h1 className="mt-6 text-xl font-semibold">Masuk ke panel admin</h1>
      <p className="mt-1 text-sm text-ink-soft">Kelola harga, foto galeri, dan informasi salon.</p>

      <form action={login} className="mt-8 space-y-4">
        <Flash err={err} />
        <Field label="Password">
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            autoFocus
            className={inputClass}
          />
        </Field>
        <button type="submit" className={`${primaryButton} w-full`}>
          Masuk
        </button>
      </form>
    </main>
  );
}
