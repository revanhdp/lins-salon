import { saveSettings } from "@/app/admin/actions";
import { card, Field, Flash, inputClass, PageHeader, primaryButton } from "@/app/admin/_ui";
import { salon } from "@/data/salon";
import { requireAdmin } from "@/lib/auth";
import { collections } from "@/lib/mongodb";

export const metadata = { title: "Kontak & jam buka" };

export default async function PengaturanPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string }>;
}) {
  await requireAdmin();
  const { ok, err } = await searchParams;

  const { settings } = await collections();
  const current = await settings.findOne({ _id: "site" });

  if (!current) {
    return (
      <>
        <PageHeader title="Kontak & jam buka" />
        <p className="text-sm text-ink-soft">
          Data belum dimuat. Buka halaman Ringkasan lalu klik “Muat data bawaan”.
        </p>
      </>
    );
  }

  const kontak = { ...salon.kontak, ...current.kontak, alamat: { ...salon.kontak.alamat, ...current.kontak.alamat } };

  return (
    <>
      <PageHeader title="Kontak & jam buka">
        Tombol WhatsApp, alamat, dan jam buka di website mengikuti isian di sini.
      </PageHeader>
      <Flash ok={ok} err={err} />

      <form action={saveSettings} className="space-y-8">
        <section className={card}>
          <h2 className="display text-2xl">Kontak</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nomor WhatsApp" hint="Contoh: 0812xxxxxxxx atau 62812xxxxxxxx. Dipakai untuk semua tombol booking.">
              <input
                name="nomorWhatsApp"
                inputMode="tel"
                maxLength={20}
                defaultValue={kontak.nomorWhatsApp}
                className={inputClass}
              />
            </Field>
            <Field label="Nomor telepon (tampil di website)" hint="Kosongkan jika sama dengan WhatsApp atau tidak ingin ditampilkan">
              <input name="telepon" maxLength={30} defaultValue={kontak.telepon} className={inputClass} />
            </Field>
            <Field label="Username Instagram" hint="Tanpa @. Kosongkan jika tidak ada.">
              <input name="instagram" maxLength={40} defaultValue={kontak.instagram} className={inputClass} />
            </Field>
            <Field label="Tautan Google Maps" hint="Tempel tautan “Bagikan” dari Google Maps (diawali https://)">
              <input name="googleMapsUrl" maxLength={500} defaultValue={kontak.googleMapsUrl} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Pesan WhatsApp otomatis" hint="Isi pesan yang sudah terketik saat pelanggan menekan tombol booking">
                <textarea
                  name="pesanWhatsApp"
                  required
                  rows={2}
                  maxLength={300}
                  defaultValue={kontak.pesanWhatsApp}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className="display text-2xl">Alamat</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Jalan / lokasi">
                <input name="jalan" maxLength={200} defaultValue={kontak.alamat.jalan} className={inputClass} />
              </Field>
            </div>
            <Field label="Kota / kabupaten">
              <input name="kota" maxLength={80} defaultValue={kontak.alamat.kota} className={inputClass} />
            </Field>
            <Field label="Provinsi">
              <input name="provinsi" maxLength={80} defaultValue={kontak.alamat.provinsi} className={inputClass} />
            </Field>
            <Field label="Kode pos">
              <input name="kodePos" inputMode="numeric" maxLength={10} defaultValue={kontak.alamat.kodePos} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className={card}>
          <h2 className="display text-2xl">Jam buka</h2>
          <p className="mt-1 text-sm text-ink-soft">Kosongkan jam buka dan jam tutup jika salon libur di hari tersebut.</p>
          <div className="mt-5 space-y-5">
            {current.jamOperasional.map((entry, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Hari">
                  <input
                    name={`jam_${index}_label`}
                    required
                    maxLength={40}
                    defaultValue={entry.label}
                    className={inputClass}
                  />
                </Field>
                <Field label="Jam buka" hint="Format 24 jam, contoh 09:00">
                  <input name={`jam_${index}_buka`} maxLength={5} defaultValue={entry.buka} className={inputClass} />
                </Field>
                <Field label="Jam tutup" hint="Contoh 19:00">
                  <input name={`jam_${index}_tutup`} maxLength={5} defaultValue={entry.tutup} className={inputClass} />
                </Field>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className={primaryButton}>
          Simpan pengaturan
        </button>
      </form>
    </>
  );
}
