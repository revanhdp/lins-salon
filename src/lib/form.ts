import "server-only";

/** Ambil teks dari form: dipangkas dan dibatasi panjangnya. */
export function text(formData: FormData, key: string, max = 300): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Teks wajib diisi. Melempar error berpesan Indonesia jika kosong. */
export function required(formData: FormData, key: string, label: string, max = 300): string {
  const value = text(formData, key, max);
  if (!value) throw new FormError(`${label} wajib diisi`);
  return value;
}

/** Angka rupiah: hanya digit yang dibaca (mis. "Rp 75.000" menjadi 75000). */
export function rupiah(formData: FormData, key: string, label: string): number {
  const digits = text(formData, key, 20).replace(/\D/g, "");
  const value = Number.parseInt(digits, 10);
  if (!Number.isFinite(value) || value < 0 || value > 100_000_000) {
    throw new FormError(`${label} tidak valid`);
  }
  return value;
}

/** Jam format HH:MM, atau string kosong jika kosong. */
export function jam(formData: FormData, key: string, label: string): string {
  const value = text(formData, key, 5);
  if (!value) return "";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new FormError(`${label} harus berformat JJ:MM`);
  return value;
}

/** Nomor WhatsApp internasional tanpa tanda baca. "0812..." menjadi "62812...". */
export function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

/** Error yang pesannya aman ditampilkan kepada admin. */
export class FormError extends Error {}
