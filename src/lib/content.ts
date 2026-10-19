import "server-only";
import { cache } from "react";
import { type KategoriLayanan, type SiteContent, salon } from "@/data/salon";
import { collections } from "@/lib/mongodb";

/** Isi bawaan dari `src/data/salon.ts`. */
export function defaultContent(): SiteContent {
  return {
    kontak: salon.kontak,
    jamOperasional: salon.jamOperasional,
    layanan: salon.layanan,
    galeri: salon.galeri,
    testimoni: salon.testimoni,
  };
}

/**
 * Konten situs dari MongoDB. Jika database belum diisi (belum di-seed) atau
 * tidak terjangkau, situs memakai data bawaan supaya tetap tampil.
 * Memakai `cache` agar satu render hanya satu kali membaca database.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    const c = await collections();
    const settings = await c.settings.findOne({ _id: "site" });
    if (!settings) return defaultContent();

    const [layananDocs, galeriDocs, testimoniDocs] = await Promise.all([
      c.layanan.find().sort({ urutan: 1, _id: 1 }).toArray(),
      c.galeri.find().sort({ urutan: 1, _id: 1 }).toArray(),
      c.testimoni.find().sort({ urutan: 1, _id: 1 }).toArray(),
    ]);

    const groups = new Map<string, KategoriLayanan>();
    for (const doc of layananDocs) {
      const group = groups.get(doc.kategori) ?? { judul: doc.kategori, layanan: [] };
      group.layanan.push({
        nama: doc.nama,
        deskripsi: doc.deskripsi,
        hargaMulai: doc.hargaMulai,
        ...(doc.durasi ? { durasi: doc.durasi } : {}),
      });
      groups.set(doc.kategori, group);
    }

    return {
      kontak: {
        ...salon.kontak,
        ...settings.kontak,
        alamat: { ...salon.kontak.alamat, ...settings.kontak.alamat },
      },
      jamOperasional: settings.jamOperasional,
      layanan: [...groups.values()],
      galeri: galeriDocs.map(({ src, alt, kategori, label, width, height }) => ({
        src,
        alt,
        kategori,
        width,
        height,
        ...(label ? { label } : {}),
      })),
      testimoni: testimoniDocs.map(({ kutipan, nama, layanan }) => ({
        kutipan,
        nama,
        ...(layanan ? { layanan } : {}),
      })),
    };
  } catch (error) {
    console.error(
      "[content] MongoDB tidak terjangkau, memakai data bawaan:",
      error instanceof Error ? error.message : error,
    );
    return defaultContent();
  }
});

/** Mengisi database dengan data bawaan. Tidak melakukan apa pun jika sudah pernah diisi. */
export async function seedDefaults(): Promise<boolean> {
  const c = await collections();
  if (await c.settings.findOne({ _id: "site" })) return false;

  const defaults = defaultContent();
  await c.settings.insertOne({
    _id: "site",
    kontak: defaults.kontak,
    jamOperasional: defaults.jamOperasional,
  });

  const layanan = defaults.layanan.flatMap((kategori) =>
    kategori.layanan.map((item) => ({ kategori: kategori.judul, ...item })),
  );
  if (layanan.length) {
    await c.layanan.insertMany(layanan.map((item, urutan) => ({ ...item, urutan })));
  }
  if (defaults.galeri.length) {
    await c.galeri.insertMany(defaults.galeri.map((foto, urutan) => ({ ...foto, urutan })));
  }
  if (defaults.testimoni.length) {
    await c.testimoni.insertMany(defaults.testimoni.map((item, urutan) => ({ ...item, urutan })));
  }
  return true;
}
