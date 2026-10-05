# Lins Salon — Website Resmi

Landing page modern dan elegan untuk **Lins Salon**. Dibangun menggunakan Next.js (App Router), TypeScript, Tailwind CSS, Motion, dan Lucide Icons. Berjalan statis, ringan, dan tanpa dependensi backend.

## Menjalankan Proyek

```bash
npm install
npm run dev      # Buka http://localhost:3000
npm run build    # Build produksi
```

## Memperbarui Informasi Bisnis

Semua informasi operasional dan konten salon berada di **`src/data/salon.ts`**. Cari kata kunci `PLACEHOLDER` untuk mengisi data asli salon:

| Data | Keterangan |
| --- | --- |
| `kontak.nomorWhatsApp` | Format internasional tanpa tanda `+` (contoh: `62812xxxxxxxx`). Terhubung ke semua tombol reservasi. |
| `kontak.telepon` | Nomor telepon yang ditampilkan ke pengunjung; tombol "Hubungi" akan otomatis aktif bila diisi. |
| `kontak.alamat` | Alamat lengkap salon untuk section lokasi dan data terstruktur mesin pencari (SEO). |
| `kontak.googleMapsUrl` | Tautan bagikan Google Maps resmi salon (Google Maps → Bagikan → Salin tautan). |
| `kontak.instagram` | Username Instagram tanpa tanda `@`. Tautan footer akan otomatis aktif bila diisi. |
| `layanan` | Daftar kategori perawatan, nama, deskripsi, harga awal (IDR), dan estimasi durasi. |
| `testimoni` | Ulasan pengalaman pelanggan asli (pastikan dengan izin pelanggan). |
| `jamOperasional` | Jadwal buka dan tutup salon yang ditampilkan di website dan SEO. |

## Mengganti Foto Salon

Ganti berkas gambar di dalam folder `public/images/` dengan foto asli dari Lins Salon (gunakan nama berkas yang sama):

```text
public/images/
  hero.jpg            Foto utama potret (~rasio 4:5)
  salon.jpg           Foto interior suasana salon
  og.jpg              Gambar pratinjau tautan media sosial (1200×630)
  gallery/work-01…06  Foto hasil perawatan & suasana galeri (perbarui juga alt text di src/data/salon.ts)
```

Susunan galeri mengombinasikan format potret dan lanskap secara dinamis.

## Deployment

Atur `NEXT_PUBLIC_SITE_URL` (misalnya: `https://linssalon.com`) pada environment hosting Anda agar tautan kanonikal, Open Graph, sitemap, dan robots.txt merujuk ke domain resmi.
