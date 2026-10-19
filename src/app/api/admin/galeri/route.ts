import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { collections, nextUrutan } from "@/lib/mongodb";
import { saveImage } from "@/lib/uploads";

const MAX_FILES = 10;
const KATEGORI = ["Rambut", "Pewarnaan", "Perawatan", "Kecantikan", "Suasana"] as const;
type Kategori = (typeof KATEGORI)[number];

function back(message: { ok?: string; err?: string }): Response {
  const query = new URLSearchParams(message as Record<string, string>).toString();
  return new Response(null, { status: 303, headers: { Location: `/admin/galeri?${query}` } });
}

/**
 * Unggah foto galeri. Memakai route handler (bukan Server Action) karena Server
 * Action dibatasi 1 MB per permintaan, sedangkan foto dari HP bisa beberapa MB.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  // Tolak permintaan dari situs lain (lapisan tambahan di atas cookie SameSite=Lax).
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return new Response("Forbidden", { status: 403 });
  }

  const form = await request.formData();
  const files = form.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return back({ err: "Pilih minimal satu foto" });
  if (files.length > MAX_FILES) return back({ err: `Maksimal ${MAX_FILES} foto sekali unggah` });

  const label = String(form.get("label") ?? "").trim().slice(0, 60);
  const rawKategori = String(form.get("kategori") ?? "");
  const kategori: Kategori = (KATEGORI as readonly string[]).includes(rawKategori)
    ? (rawKategori as Kategori)
    : "Rambut";

  const { galeri } = await collections();
  let urutan = await nextUrutan("galeri");
  let saved = 0;
  const errors: string[] = [];

  for (const file of files) {
    try {
      const image = await saveImage(file);
      await galeri.insertOne({
        ...image,
        alt: label ? `Hasil kerja Lins Salon: ${label}` : "Hasil kerja Lins Salon",
        kategori,
        ...(label ? { label } : {}),
        urutan: urutan++,
      });
      saved++;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Gagal menyimpan foto");
    }
  }

  if (saved > 0) revalidatePath("/", "layout");
  if (errors.length > 0) {
    return back({ err: `${saved} foto tersimpan. ${errors.join(" ")}` });
  }
  return back({ ok: `${saved} foto ditambahkan` });
}
