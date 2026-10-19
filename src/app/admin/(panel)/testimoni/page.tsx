import { deleteTestimoni, moveTestimoni, saveTestimoni } from "@/app/admin/actions";
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

export const metadata = { title: "Testimoni" };

interface Row {
  _id: string;
  kutipan: string;
  nama: string;
  layanan?: string;
}

function TestimoniFields({ item }: { item?: Row }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Kutipan">
          <textarea name="kutipan" required rows={3} maxLength={600} defaultValue={item?.kutipan} className={inputClass} />
        </Field>
      </div>
      <Field label="Nama pelanggan" hint="Boleh inisial, contoh: Rina S.">
        <input name="nama" required maxLength={80} defaultValue={item?.nama} className={inputClass} />
      </Field>
      <Field label="Layanan (opsional)">
        <input name="layanan" maxLength={80} defaultValue={item?.layanan} className={inputClass} />
      </Field>
    </div>
  );
}

export default async function TestimoniAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await requireAdmin();
  const { ok, err } = await searchParams;

  const { testimoni } = await collections();
  const docs = await testimoni.find().sort({ urutan: 1, _id: 1 }).toArray();
  const rows: Row[] = docs.map((d) => ({
    _id: String(d._id),
    kutipan: d.kutipan,
    nama: d.nama,
    layanan: d.layanan,
  }));

  return (
    <>
      <PageHeader title="Testimoni">
        Tambahkan ulasan asli dari pelanggan, dengan izin mereka. Jika daftar ini kosong, bagian testimoni disembunyikan dari website.
      </PageHeader>
      <Flash ok={ok} err={err} />

      <section className={`${card} mb-10`}>
        <h2 className="display text-2xl">Tambah testimoni</h2>
        <form action={saveTestimoni} className="mt-5 space-y-5">
          <TestimoniFields />
          <button type="submit" className={primaryButton}>
            Tambahkan
          </button>
        </form>
      </section>

      <ul className="space-y-3">
        {rows.map((item, index) => (
          <li key={item._id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-2xl">
                <p className="text-sm leading-relaxed">“{item.kutipan}”</p>
                <p className="mt-2 text-sm font-medium text-ink-soft">
                  {item.nama}
                  {item.layanan && ` · ${item.layanan}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MoveButtons action={moveTestimoni} id={item._id} first={index === 0} last={index === rows.length - 1} />
                <DeleteButton action={deleteTestimoni} id={item._id} message="Hapus testimoni ini?" />
              </div>
            </div>
            <details className="mt-4">
              <summary className={`${ghostButton} list-none`}>Ubah</summary>
              <form action={saveTestimoni} className="mt-4 space-y-5">
                <input type="hidden" name="id" value={item._id} />
                <TestimoniFields item={item} />
                <button type="submit" className={primaryButton}>
                  Simpan perubahan
                </button>
              </form>
            </details>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-ink-soft">Belum ada testimoni.</li>}
      </ul>
    </>
  );
}
