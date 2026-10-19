"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAuthConfigured,
  passwordMatches,
  requireAdmin,
} from "@/lib/auth";
import { seedDefaults } from "@/lib/content";
import { FormError, jam, normalizeWhatsApp, required, rupiah, text } from "@/lib/form";
import { collections, moveDoc, nextUrutan, type OrderedCollection, toObjectId } from "@/lib/mongodb";
import { deleteUpload } from "@/lib/uploads";

const KATEGORI_FOTO = ["Rambut", "Pewarnaan", "Perawatan", "Kecantikan", "Suasana"] as const;
type KategoriFoto = (typeof KATEGORI_FOTO)[number];

const enc = encodeURIComponent;

/**
 * Menjalankan satu perubahan data dengan pola yang sama: cek login, jalankan,
 * segarkan cache situs, lalu kembali ke halaman admin dengan pesan.
 */
async function run(back: string, success: string, work: () => Promise<void>): Promise<never> {
  await requireAdmin();
  try {
    await work();
  } catch (error) {
    if (error instanceof FormError) redirect(`${back}?err=${enc(error.message)}`);
    console.error("[admin]", error);
    redirect(`${back}?err=${enc("Terjadi kesalahan. Coba lagi.")}`);
  }
  revalidatePath("/", "layout");
  redirect(`${back}?ok=${enc(success)}`);
}

// ---------- Login ----------

const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

export async function login(formData: FormData) {
  if (!isAuthConfigured()) redirect(`/admin/login?err=${enc("ADMIN_PASSWORD dan SESSION_SECRET belum diatur di server")}`);

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "lokal";
  if (rateLimited(ip)) redirect(`/admin/login?err=${enc("Terlalu banyak percobaan. Coba lagi 15 menit lagi.")}`);

  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    redirect(`/admin/login?err=${enc("Password salah")}`);
  }

  attempts.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Data awal ----------

export async function seed() {
  await run("/admin", "Data bawaan berhasil dimuat", async () => {
    await seedDefaults();
  });
}

// ---------- Urutan (dipakai layanan, galeri, testimoni) ----------

async function move(name: OrderedCollection, back: string, formData: FormData) {
  await run(back, "Urutan diperbarui", async () => {
    await moveDoc(name, text(formData, "id", 40), formData.get("dir") === "up" ? -1 : 1);
  });
}

export async function moveLayanan(formData: FormData) {
  await move("layanan", "/admin/layanan", formData);
}
export async function moveFoto(formData: FormData) {
  await move("galeri", "/admin/galeri", formData);
}
export async function moveTestimoni(formData: FormData) {
  await move("testimoni", "/admin/testimoni", formData);
}

// ---------- Layanan ----------

export async function saveLayanan(formData: FormData) {
  const id = text(formData, "id", 40);
  await run("/admin/layanan", id ? "Layanan diperbarui" : "Layanan ditambahkan", async () => {
    const kategori = text(formData, "kategoriBaru", 60) || required(formData, "kategori", "Kategori", 60);
    const durasi = text(formData, "durasi", 30);
    const data = {
      kategori,
      nama: required(formData, "nama", "Nama layanan", 80),
      deskripsi: text(formData, "deskripsi", 400),
      hargaMulai: rupiah(formData, "hargaMulai", "Harga"),
    };
    const { layanan } = await collections();
    if (id) {
      await layanan.updateOne(
        { _id: toObjectId(id) },
        durasi ? { $set: { ...data, durasi } } : { $set: data, $unset: { durasi: "" } },
      );
    } else {
      await layanan.insertOne({ ...data, ...(durasi ? { durasi } : {}), urutan: await nextUrutan("layanan") });
    }
  });
}

export async function deleteLayanan(formData: FormData) {
  await run("/admin/layanan", "Layanan dihapus", async () => {
    await (await collections()).layanan.deleteOne({ _id: toObjectId(text(formData, "id", 40)) });
  });
}

// ---------- Galeri (unggah ada di /api/admin/galeri) ----------

export async function updateFoto(formData: FormData) {
  await run("/admin/galeri", "Foto diperbarui", async () => {
    const label = text(formData, "label", 60);
    const rawKategori = text(formData, "kategori", 20);
    const kategori: KategoriFoto = (KATEGORI_FOTO as readonly string[]).includes(rawKategori)
      ? (rawKategori as KategoriFoto)
      : "Rambut";
    const alt = required(formData, "alt", "Deskripsi foto", 200);
    const { galeri } = await collections();
    await galeri.updateOne(
      { _id: toObjectId(text(formData, "id", 40)) },
      label ? { $set: { label, kategori, alt } } : { $set: { kategori, alt }, $unset: { label: "" } },
    );
  });
}

export async function deleteFoto(formData: FormData) {
  await run("/admin/galeri", "Foto dihapus", async () => {
    const { galeri } = await collections();
    const doc = await galeri.findOneAndDelete({ _id: toObjectId(text(formData, "id", 40)) });
    if (doc) await deleteUpload(doc.src);
  });
}

// ---------- Testimoni ----------

export async function saveTestimoni(formData: FormData) {
  const id = text(formData, "id", 40);
  await run("/admin/testimoni", id ? "Testimoni diperbarui" : "Testimoni ditambahkan", async () => {
    const layanan = text(formData, "layanan", 80);
    const data = {
      kutipan: required(formData, "kutipan", "Kutipan", 600),
      nama: required(formData, "nama", "Nama", 80),
    };
    const { testimoni } = await collections();
    if (id) {
      await testimoni.updateOne(
        { _id: toObjectId(id) },
        layanan ? { $set: { ...data, layanan } } : { $set: data, $unset: { layanan: "" } },
      );
    } else {
      await testimoni.insertOne({ ...data, ...(layanan ? { layanan } : {}), urutan: await nextUrutan("testimoni") });
    }
  });
}

export async function deleteTestimoni(formData: FormData) {
  await run("/admin/testimoni", "Testimoni dihapus", async () => {
    await (await collections()).testimoni.deleteOne({ _id: toObjectId(text(formData, "id", 40)) });
  });
}

// ---------- Pengaturan: kontak dan jam buka ----------

export async function saveSettings(formData: FormData) {
  await run("/admin/pengaturan", "Pengaturan disimpan", async () => {
    const { settings } = await collections();
    const current = await settings.findOne({ _id: "site" });
    if (!current) throw new FormError("Muat data bawaan dulu dari halaman Ringkasan");

    const maps = text(formData, "googleMapsUrl", 500);
    if (maps && !/^https:\/\//.test(maps)) throw new FormError("Tautan Google Maps harus diawali https://");

    const kontak = {
      ...current.kontak,
      nomorWhatsApp: normalizeWhatsApp(text(formData, "nomorWhatsApp", 20)),
      pesanWhatsApp: required(formData, "pesanWhatsApp", "Pesan WhatsApp", 300),
      telepon: text(formData, "telepon", 30),
      instagram: text(formData, "instagram", 40).replace(/^@/, ""),
      googleMapsUrl: maps,
      alamat: {
        ...current.kontak.alamat,
        jalan: text(formData, "jalan", 200),
        kota: text(formData, "kota", 80),
        provinsi: text(formData, "provinsi", 80),
        kodePos: text(formData, "kodePos", 10),
      },
    };

    const jamOperasional = current.jamOperasional.map((_entry, index) => {
      const buka = jam(formData, `jam_${index}_buka`, "Jam buka");
      const tutup = jam(formData, `jam_${index}_tutup`, "Jam tutup");
      if (Boolean(buka) !== Boolean(tutup)) throw new FormError("Isi jam buka dan jam tutup keduanya, atau kosongkan keduanya");
      return {
        label: required(formData, `jam_${index}_label`, "Label hari", 40),
        ...(buka && tutup ? { buka, tutup } : {}),
      };
    });

    await settings.updateOne({ _id: "site" }, { $set: { kontak, jamOperasional } });
  });
}
