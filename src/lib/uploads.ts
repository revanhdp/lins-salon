import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const NAME_PATTERN = /^[0-9a-f-]{36}\.jpg$/;

function uploadDir(): string {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
}

export interface SavedImage {
  src: string;
  width: number;
  height: number;
}

/**
 * Menyimpan foto: memutar sesuai EXIF HP, mengecilkan ke maksimal 1600px,
 * dan menyimpan ulang sebagai JPEG. File yang bukan gambar ditolak.
 */
export async function saveImage(file: File): Promise<SavedImage> {
  if (file.size === 0) throw new Error("File kosong");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Ukuran foto maksimal 15 MB");

  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new Error(`"${file.name}" bukan file gambar yang valid`);
  }

  const name = `${randomUUID()}.jpg`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), output.data);
  return { src: `/media/${name}`, width: output.info.width, height: output.info.height };
}

/** Membaca file unggahan. Mengembalikan null untuk nama yang tidak valid atau tidak ada. */
export async function readUpload(name: string): Promise<Buffer | null> {
  if (!NAME_PATTERN.test(name)) return null;
  try {
    return await readFile(path.join(uploadDir(), name));
  } catch {
    return null;
  }
}

/** Menghapus file unggahan (abaikan jika bukan di /media atau sudah tidak ada). */
export async function deleteUpload(src: string): Promise<void> {
  if (!src.startsWith("/media/")) return;
  const name = src.slice("/media/".length);
  if (!NAME_PATTERN.test(name)) return;
  try {
    await unlink(path.join(uploadDir(), name));
  } catch {
    // sudah terhapus
  }
}
