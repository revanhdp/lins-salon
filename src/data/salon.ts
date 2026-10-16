/**
 * Lins Salon — Konten & Konfigurasi Bisnis.
 *
 * Semua informasi operasional dan konten bisnis dikelola di file ini.
 * Cari kata kunci "PLACEHOLDER" untuk melihat bagian yang perlu diisi data riil.
 */

export type HariDalamSeminggu =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat"
  | "Sabtu"
  | "Minggu";

export interface JamOperasional {
  label: string;
  hari: HariDalamSeminggu[];
  /** Format 24 jam "HH:MM". Kosongkan buka/tutup jika libur/tutup. */
  buka?: string;
  tutup?: string;
}

export interface LayananItem {
  nama: string;
  deskripsi: string;
  /** Tarif mulai dari (dalam IDR). */
  hargaMulai: number;
  durasi?: string;
}

export interface KategoriLayanan {
  judul: string;
  layanan: LayananItem[];
}

export interface FotoGaleri {
  src: string;
  alt: string;
  kategori: "Rambut" | "Pewarnaan" | "Perawatan" | "Kecantikan" | "Suasana";
  width: number;
  height: number;
}

export interface TestimoniItem {
  kutipan: string;
  nama: string;
  layanan?: string;
}

export interface KeunggulanItem {
  judul: string;
  deskripsi: string;
}

export interface SalonConfig {
  nama: string;
  tagline: string;
  deskripsi: string;
  siteUrl: string;
  kontak: {
    nomorWhatsApp: string;
    pesanWhatsApp: string;
    telepon: string;
    instagram: string;
    alamat: {
      jalan: string;
      kota: string;
      provinsi: string;
      kodePos: string;
      negara: string;
    };
    googleMapsUrl: string;
  };
  jamOperasional: JamOperasional[];
  layanan: KategoriLayanan[];
  galeri: FotoGaleri[];
  keunggulan: KeunggulanItem[];
  testimoni: TestimoniItem[];
}

export const salon: SalonConfig = {
  nama: "Lins Salon",
  tagline: "Perawatan Rambut & Kecantikan",
  deskripsi:
    "Lins Salon adalah salon kecantikan lokal yang menghadirkan perawatan rambut, pewarnaan, creambath, facial, serta perawatan kuku dalam suasana yang hangat, tenang, dan bersahabat.",

  /**
   * URL publik website — digunakan untuk metadata SEO, sitemap, dan robots.txt.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  kontak: {
    /**
     * PLACEHOLDER — Nomor WhatsApp format internasional tanpa tanda + atau spasi (contoh: "62812xxxxxxxx").
     */
    nomorWhatsApp: "",
    pesanWhatsApp:
      "Halo Lins Salon, saya ingin konsultasi dan reservasi jadwal perawatan.",

    /** PLACEHOLDER — Format nomor telepon untuk ditampilkan, contoh: "0812-xxxx-xxxx" */
    telepon: "",

    /** PLACEHOLDER — Username akun Instagram tanpa tanda @ */
    instagram: "",

    /** Alamat lengkap lokasi salon. `jalan` berisi Plus Code Google Maps. */
    alamat: {
      jalan: "JJX4+FP5, Dangdang, Kec. Cisauk",
      kota: "Kabupaten Tangerang",
      provinsi: "Banten",
      kodePos: "15340",
      negara: "ID",
    },

    /**
     * Tautan Google Maps berdasarkan Plus Code. Ganti dengan tautan bagikan
     * resmi Lins Salon dari Google Maps jika sudah ada.
     */
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=JJX4%2BFP5%20Cisauk",
  },

  jamOperasional: [
    {
      label: "Senin — Sabtu",
      hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
      buka: "09:00",
      tutup: "20:00",
    },
    {
      label: "Minggu",
      hari: ["Minggu"],
    },
  ],

  layanan: [
    {
      judul: "Rambut",
      layanan: [
        {
          nama: "Potong Rambut",
          deskripsi: "Konsultasi bentuk wajah, cuci rambut, pemotongan presisi, dan penataan blow-dry.",
          hargaMulai: 75000,
          durasi: "45 mnt",
        },
        {
          nama: "Pewarnaan Rambut",
          deskripsi: "Pewarnaan penuh, highlights halus, hingga balayage dengan nuansa warna yang natural.",
          hargaMulai: 350000,
          durasi: "2–3 jam",
        },
        {
          nama: "Hair Treatment",
          deskripsi: "Perawatan nutrisi intensif untuk mengembalikan kilau rambut kering dan rusak.",
          hargaMulai: 150000,
          durasi: "60 mnt",
        },
        {
          nama: "Smoothing",
          deskripsi: "Pelurusan rambut yang lembut, mudah diatur, dan tetap mempertahankan volume alami.",
          hargaMulai: 400000,
          durasi: "3–4 jam",
        },
        {
          nama: "Creambath Relaksasi",
          deskripsi: "Pijatan lembut pada kulit kepala, leher, dan bahu menggunakan krim bernutrisi.",
          hargaMulai: 100000,
          durasi: "60 mnt",
        },
      ],
    },
    {
      judul: "Kecantikan & Kuku",
      layanan: [
        {
          nama: "Facial Treatment",
          deskripsi: "Pembersihan pori mendalam dan hidrasi menyegarkan yang disesuaikan dengan jenis kulit.",
          hargaMulai: 150000,
          durasi: "60 mnt",
        },
        {
          nama: "Manicure",
          deskripsi: "Pembentukan kuku, perawatan kutikula, dan pulasan kuteks bersih yang rapi.",
          hargaMulai: 75000,
          durasi: "45 mnt",
        },
        {
          nama: "Pedicure",
          deskripsi: "Rendaman relaksasi, scrub lembut, dan perawatan kuku untuk menyegarkan langkah kaki.",
          hargaMulai: 90000,
          durasi: "60 mnt",
        },
        {
          nama: "Eyelash Extension",
          deskripsi: "Pemasangan bulu mata helai demi helai untuk hasil lentik yang ringan dan tampak alami.",
          hargaMulai: 200000,
          durasi: "90 mnt",
        },
      ],
    },
  ],

  galeri: [
    {
      src: "/images/gallery/work-01.jpg",
      alt: "Rambut bergelombang dengan sentuhan pewarnaan balayage karamel lembut",
      kategori: "Pewarnaan",
      width: 896,
      height: 1200,
    },
    {
      src: "/images/gallery/work-02.jpg",
      alt: "Proses pemotongan rambut dengan gunting dan sisir profesional",
      kategori: "Rambut",
      width: 1200,
      height: 896,
    },
    {
      src: "/images/gallery/work-04.jpg",
      alt: "Momen relaksasi pijat creambath di area cuci rambut salon",
      kategori: "Perawatan",
      width: 1200,
      height: 896,
    },
    {
      src: "/images/gallery/work-03.jpg",
      alt: "Hasil perawatan kuku manicure dengan pulasan kuteks nude bersih di atas kain linen",
      kategori: "Kecantikan",
      width: 896,
      height: 1200,
    },
    {
      src: "/images/gallery/work-05.jpg",
      alt: "Model rambut bob lurus berkilau warna espresso tampak samping",
      kategori: "Rambut",
      width: 896,
      height: 1200,
    },
    {
      src: "/images/gallery/work-06.jpg",
      alt: "Aplikasi masker perawatan facial yang menenangkan di ruang perawatan",
      kategori: "Kecantikan",
      width: 1200,
      height: 896,
    },
  ],

  keunggulan: [
    {
      judul: "Dikerjakan pelan-pelan",
      deskripsi:
        "Tidak diburu antrean. Setiap janji temu mendapat waktu dan perhatian penuh dari awal sampai selesai.",
    },
    {
      judul: "Ruang yang adem",
      deskripsi:
        "Hangat, hening, dan wangi. Cocok untuk rehat sebentar dari hiruk-pikuk hari-harimu.",
    },
    {
      judul: "Ngobrol dulu",
      deskripsi:
        "Kami dengarkan maumu sebelum gunting atau pewarna disentuh, supaya hasilnya benar-benar kamu.",
    },
  ],

  testimoni: [
    {
      kutipan:
        "Awalnya ragu ingin potong model apa. Stylist-nya sabar mendengarkan dan hasilnya pas sekali dengan bentuk wajah. Sangat rapi.",
      nama: "Pelanggan Lins Salon",
      layanan: "Potong Rambut",
    },
    {
      kutipan:
        "Tempatnya bersih, tenang, dan tidak terburu-buru. Pijatan creambath-nya benar-benar bikin rileks setelah seminggu bekerja.",
      nama: "Pelanggan Lins Salon",
      layanan: "Creambath Relaksasi",
    },
    {
      kutipan:
        "Warna balayage-nya keluar sangat lembut dan natural sesuai referensi yang saya minta. Rambut juga tetap halus setelahnya.",
      nama: "Pelanggan Lins Salon",
      layanan: "Pewarnaan Rambut",
    },
  ],
};

export const navigation = [
  { label: "Beranda", href: "#beranda" },
  { label: "Layanan", href: "#layanan" },
  { label: "Galeri", href: "#galeri" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
] as const;
