import { salon } from "@/data/salon";

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
