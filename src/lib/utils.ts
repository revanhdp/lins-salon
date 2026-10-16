import { type HariDalamSeminggu, salon } from "@/data/salon";

/** Menggabungkan class name, mengabaikan nilai falsy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const { kontak } = salon;

/** Tautan WhatsApp click-to-chat dengan pesan default. */
export function getWhatsAppUrl(pesan: string = kontak.pesanWhatsApp): string {
  const text = encodeURIComponent(pesan);
  const number = kontak.nomorWhatsApp.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Tautan `tel:`, atau null jika nomor telepon belum diisi. */
export function getPhoneUrl(): string | null {
  const digits = kontak.telepon.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function getMapsUrl(): string {
  if (kontak.googleMapsUrl) return kontak.googleMapsUrl;
  const query = [salon.nama, kontak.alamat.jalan, kontak.alamat.kota]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || salon.nama)}`;
}

export function getInstagramUrl(): string | null {
  return kontak.instagram ? `https://www.instagram.com/${kontak.instagram}/` : null;
}

/** Baris alamat untuk tampilan visual. Mengembalikan array kosong jika belum diatur. */
export function getAddressLines(): string[] {
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

const hariDariInggris: Record<string, HariDalamSeminggu> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

const urutanHari: HariDalamSeminggu[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export interface OpenStatus {
  open: boolean;
  label: string;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Status buka/tutup salon berdasarkan jam operasional (zona waktu WIB). */
export function getOpenStatus(now: Date): OpenStatus | null {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const today = hariDariInggris[part("weekday")];
  if (!today) return null;
  const minutesNow = Number(part("hour")) * 60 + Number(part("minute"));
  const dayIndex = urutanHari.indexOf(today);

  for (let offset = 0; offset < 7; offset++) {
    const hari = urutanHari[(dayIndex + offset) % 7];
    const entry = salon.jamOperasional.find((e) => e.buka && e.tutup && e.hari.includes(hari));
    if (!entry?.buka || !entry.tutup) continue;

    if (offset === 0) {
      if (minutesNow >= toMinutes(entry.tutup)) continue;
      if (minutesNow >= toMinutes(entry.buka)) {
        return { open: true, label: `Buka sekarang · tutup ${entry.tutup} WIB` };
      }
      return { open: false, label: `Tutup · buka hari ini ${entry.buka} WIB` };
    }
    const kapan = offset === 1 ? "besok" : hari;
    return { open: false, label: `Tutup · buka ${kapan} ${entry.buka} WIB` };
  }
  return null;
}
