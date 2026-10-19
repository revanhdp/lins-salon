import { deleteLayanan, moveLayanan, saveLayanan } from "@/app/admin/actions";
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
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Layanan & harga" };

interface LayananRow {
  _id: string;
  kategori: string;
  nama: string;
  deskripsi: string;
  hargaMulai: number;
  durasi?: string;
}

function LayananFields({ item, kategoriList }: { item?: LayananRow; kategoriList: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Nama layanan">
        <input name="nama" required maxLength={80} defaultValue={item?.nama} className={inputClass} />
      </Field>
      <Field label="Harga mulai dari (Rp)" hint="Cukup angka, contoh: 75000">
        <input
          name="hargaMulai"
          required
          inputMode="numeric"
          defaultValue={item?.hargaMulai}
          className={inputClass}
        />
      </Field>
      <Field label="Kategori">
        <select name="kategori" defaultValue={item?.kategori ?? kategoriList[0]} className={inputClass}>
          {kategoriList.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </Field>
      <Field label="Atau kategori baru" hint="Isi hanya jika kategorinya belum ada di daftar">
        <input name="kategoriBaru" maxLength={60} className={inputClass} />
      </Field>
      <Field label="Durasi (opsional)" hint="Contoh: 45 mnt, 2–3 jam">
        <input name="durasi" maxLength={30} defaultValue={item?.durasi} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Deskripsi singkat">
          <textarea
            name="deskripsi"
            rows={2}
            maxLength={400}
            defaultValue={item?.deskripsi}
            className={inputClass}
          />
        </Field>
      </div>
    </div>
  );
}

export default async function LayananAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await requireAdmin();
  const { ok, err } = await searchParams;

  const { layanan } = await collections();
  const docs = await layanan.find().sort({ urutan: 1, _id: 1 }).toArray();
  const rows: LayananRow[] = docs.map((d) => ({
    _id: String(d._id),
    kategori: d.kategori,
    nama: d.nama,
    deskripsi: d.deskripsi,
    hargaMulai: d.hargaMulai,
    durasi: d.durasi,
  }));
  const kategoriList = [...new Set(rows.map((r) => r.kategori))];
  if (kategoriList.length === 0) kategoriList.push("Rambut");

  return (
    <>
      <PageHeader title="Layanan & harga">
        Urutan di sini sama dengan urutan di website. Layanan dengan kategori yang sama dikelompokkan otomatis.
      </PageHeader>
      <Flash ok={ok} err={err} />

      <section className={`${card} mb-10`}>
        <h2 className="display text-2xl">Tambah layanan</h2>
        <form action={saveLayanan} className="mt-5 space-y-5">
          <LayananFields kategoriList={kategoriList} />
          <button type="submit" className={primaryButton}>
            Tambahkan
          </button>
        </form>
      </section>

      <ul className="space-y-3">
        {rows.map((item, index) => (
          <li key={item._id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.nama}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {item.kategori} · mulai {formatPrice(item.hargaMulai)}
                  {item.durasi && ` · ${item.durasi}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MoveButtons action={moveLayanan} id={item._id} first={index === 0} last={index === rows.length - 1} />
                <DeleteButton action={deleteLayanan} id={item._id} message={`Hapus layanan "${item.nama}"?`} />
              </div>
            </div>

            <details className="mt-4">
              <summary className={`${ghostButton} list-none`}>Ubah</summary>
              <form action={saveLayanan} className="mt-4 space-y-5">
                <input type="hidden" name="id" value={item._id} />
                <LayananFields item={item} kategoriList={kategoriList} />
                <button type="submit" className={primaryButton}>
                  Simpan perubahan
                </button>
              </form>
            </details>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-ink-soft">Belum ada layanan.</li>}
      </ul>
    </>
  );
}
