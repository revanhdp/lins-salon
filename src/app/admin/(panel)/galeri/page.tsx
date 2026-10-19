import Image from "next/image";
import { deleteFoto, moveFoto, updateFoto } from "@/app/admin/actions";
import {
  card,
  DeleteButton,
  Field,
  Flash,
  ghostButton,
  inputClass,
  MoveButtons,
  PageHeader,
  primaryButton,
} from "@/app/admin/_ui";
import { requireAdmin } from "@/lib/auth";
import { collections } from "@/lib/mongodb";

export const metadata = { title: "Galeri" };

const KATEGORI = ["Rambut", "Pewarnaan", "Perawatan", "Kecantikan", "Suasana"] as const;

export default async function GaleriAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await requireAdmin();
  const { ok, err } = await searchParams;

  const { galeri } = await collections();
  const fotos = await galeri.find().sort({ urutan: 1, _id: 1 }).toArray();

  return (
    <>
      <PageHeader title="Galeri">
        Tiga foto pertama tampil di beranda, semuanya tampil di halaman Galeri. Foto dari HP otomatis diputar, dikecilkan, dan dioptimalkan.
      </PageHeader>
      <Flash ok={ok} err={err} />

      <section className={`${card} mb-10`}>
        <h2 className="display text-2xl">Tambah foto</h2>
        <form
          action="/api/admin/galeri"
          method="post"
          encType="multipart/form-data"
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Field label="Foto" hint="Boleh pilih beberapa sekaligus (maksimal 10, masing-masing sampai 15 MB)">
              <input
                type="file"
                name="file"
                accept="image/*"
                multiple
                required
                className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-blush file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-rose-deep`}
              />
            </Field>
          </div>
          <Field label="Judul pendek (opsional)" hint="Tampil di atas foto, contoh: Burgundy bob">
            <input name="label" maxLength={60} className={inputClass} />
          </Field>
          <Field label="Kategori">
            <select name="kategori" className={inputClass}>
              {KATEGORI.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryButton}>
              Unggah
            </button>
          </div>
        </form>
      </section>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fotos.map((foto, index) => {
          const id = String(foto._id);
          return (
            <li key={id} className={card}>
              <div className="flex gap-4">
                <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:w-28">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    loading={index < 4 ? "eager" : "lazy"}
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{foto.label ?? "(tanpa judul)"}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    #{index + 1} · {foto.kategori}
                    {index < 3 && " · tampil di beranda"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <MoveButtons action={moveFoto} id={id} first={index === 0} last={index === fotos.length - 1} />
                    <DeleteButton action={deleteFoto} id={id} message="Hapus foto ini dari galeri?" />
                  </div>
                </div>
              </div>

              <details className="mt-4">
                <summary className={`${ghostButton} list-none`}>Ubah judul & deskripsi</summary>
                <form action={updateFoto} className="mt-4 space-y-4">
                  <input type="hidden" name="id" value={id} />
                  <Field label="Judul pendek">
                    <input name="label" maxLength={60} defaultValue={foto.label} className={inputClass} />
                  </Field>
                  <Field label="Kategori">
                    <select name="kategori" defaultValue={foto.kategori} className={inputClass}>
                      {KATEGORI.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Deskripsi foto" hint="Dibaca oleh pembaca layar dan mesin pencari">
                    <input name="alt" required maxLength={200} defaultValue={foto.alt} className={inputClass} />
                  </Field>
                  <button type="submit" className={primaryButton}>
                    Simpan
                  </button>
                </form>
              </details>
            </li>
          );
        })}
        {fotos.length === 0 && <li className="text-sm text-ink-soft">Belum ada foto.</li>}
      </ul>
    </>
  );
}
