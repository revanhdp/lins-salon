import { type JamOperasional, type Kontak, salon } from "@/data/salon";

/** Menggabungkan class name, mengabaikan nilai falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Tautan WhatsApp click-to-chat dengan pesan default. */
export function getWhatsAppUrl(kontak: Kontak, pesan: string = kontak.pesanWhatsApp): string {
  const text = encodeURIComponent(pesan);
  const number = kontak.nomorWhatsApp.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Tautan `tel:`, atau null jika nomor telepon belum diisi. */
export function getPhoneUrl(kontak: Kontak): string | null {
  const digits = kontak.telepon.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function getMapsUrl(kontak: Kontak): string {
  if (kontak.googleMapsUrl) return kontak.googleMapsUrl;
  const query = [salon.nama, kontak.alamat.jalan, kontak.alamat.kota].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || salon.nama)}`;
}

export function getInstagramUrl(kontak: Kontak): string | null {
  return kontak.instagram ? `https://www.instagram.com/${kontak.instagram}/` : null;
}

/** Baris alamat untuk tampilan visual. Mengembalikan array kosong jika belum diatur. */
export function getAddressLines(kontak: Kontak): string[] {
  const { jalan, kota, provinsi, kodePos } = kontak.alamat;
  const wilayah = [kota, provinsi, kodePos].filter(Boolean).join(", ");
  return [jalan, wilayah].filter(Boolean);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export interface OpenStatus {
  open: boolean;
  label: string;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Status buka/tutup salon (zona waktu WIB). Memakai entri jam pertama yang
 * berisi jam buka dan tutup, dan dianggap berlaku setiap hari.
 */
export function getOpenStatus(now: Date, jamOperasional: JamOperasional[]): OpenStatus | null {
  const entry = jamOperasional.find((e) => e.buka && e.tutup);
  if (!entry?.buka || !entry.tutup) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const minutesNow = part("hour") * 60 + part("minute");

  if (minutesNow >= toMinutes(entry.tutup)) {
    return { open: false, label: `Tutup · buka besok ${entry.buka} WIB` };
  }
  if (minutesNow >= toMinutes(entry.buka)) {
    return { open: true, label: `Buka sekarang · tutup ${entry.tutup} WIB` };
  }
  return { open: false, label: `Tutup · buka hari ini ${entry.buka} WIB` };
}
