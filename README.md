# Lins Salon — Website Resmi

Website **Lins Salon** dibangun dengan Next.js (App Router), TypeScript, Tailwind CSS, dan MongoDB. Harga, foto galeri, testimoni, kontak, dan jam buka diubah lewat panel admin di `/admin`, tanpa menyentuh kode.

## Menjalankan di Komputer Sendiri

```bash
npm install
docker run -d --name lins-mongo -p 127.0.0.1:27017:27017 -v lins-mongo-data:/data/db mongo:7
cp .env.example .env.local      # lalu isi ADMIN_PASSWORD dan SESSION_SECRET
npm run dev                     # http://localhost:3000
```

Buka `http://localhost:3000/admin`, masuk dengan `ADMIN_PASSWORD`, lalu klik **Muat data bawaan** (sekali saja). Data bawaan diambil dari `src/data/salon.ts`.

Tanpa database, website tetap tampil memakai data bawaan itu. Hanya panel admin yang tidak bisa dipakai.

## Cara Kerja

| Bagian | Keterangan |
| --- | --- |
| `src/data/salon.ts` | Identitas tetap (nama, tagline, deskripsi, keunggulan) dan data bawaan / cadangan. |
| MongoDB | Koleksi `settings` (kontak + jam buka), `layanan`, `galeri`, `testimoni`. |
| `src/lib/content.ts` | `getContent()` membaca MongoDB; jika kosong atau tidak terjangkau, memakai data bawaan. |
| `/admin` | Panel admin (login satu password, sesi cookie bertanda tangan). |
| `/media/<id>.jpg` | Menyajikan foto yang diunggah dari folder `UPLOAD_DIR`. |

Halaman publik di-cache dan dibuat ulang paling lama tiap 60 detik. Setiap kali admin menyimpan sesuatu, cache dibersihkan sehingga perubahan langsung tampil.

Foto yang diunggah otomatis diputar sesuai orientasi HP, dikecilkan maksimal 1600 px, dan disimpan sebagai JPEG.

## Deploy ke VPS

Kebutuhan: Node.js 20.9+ (disarankan 22 LTS), MongoDB, dan reverse proxy dengan HTTPS (mis. Caddy). Panel admin memakai cookie `Secure` di produksi, jadi **wajib diakses lewat HTTPS**.

1. **MongoDB** — pasang langsung atau lewat Docker. Jangan buka port 27017 ke internet (bind ke `127.0.0.1`), dan aktifkan autentikasi jika MongoDB dipakai bersama aplikasi lain.
2. **Environment** — isi variabel berikut di server (lihat `.env.example`):
   `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD`, `SESSION_SECRET` (`openssl rand -base64 32`), `UPLOAD_DIR` (mis. `/var/lib/lins-salon/uploads`, folder di luar kode), dan `NEXT_PUBLIC_SITE_URL`.
3. **Build & jalankan**
   ```bash
   npm ci
   npm run build
   npm run start            # port 3000; jalankan lewat systemd atau PM2 agar otomatis hidup ulang
   ```
4. **Reverse proxy** — contoh Caddyfile:
   ```text
   linssalon.com {
     reverse_proxy 127.0.0.1:3000
   }
   ```
5. **Backup** — salin dua hal secara berkala: dump database (`mongodump --db lins_salon --archive=lins.archive.gz --gzip`) dan folder `UPLOAD_DIR`. Foto dan harga hanya ada di dua tempat itu.

Saat memperbarui kode: `git pull && npm ci && npm run build` lalu restart proses. Data di MongoDB dan `UPLOAD_DIR` tidak ikut berubah.

## Mengganti Foto Bawaan

Foto hero, interior, dan gambar pratinjau media sosial masih berupa berkas statis di `public/images/` (ganti dengan foto asli, nama berkas sama):

```text
public/images/
  hero.jpg            Foto utama potret (~rasio 4:5)
  salon.jpg           Foto interior suasana salon
  og.jpg              Gambar pratinjau tautan media sosial (1200×630)
```

Foto galeri dikelola dari panel admin, bukan dari folder ini.
