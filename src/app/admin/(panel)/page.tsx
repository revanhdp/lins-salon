import Link from "next/link";
import { seed } from "@/app/admin/actions";
import { card, Flash, PageHeader, primaryButton } from "@/app/admin/_ui";
import { requireAdmin } from "@/lib/auth";
import { collections } from "@/lib/mongodb";

interface Status {
  connected: boolean;
  seeded: boolean;
  counts: { layanan: number; galeri: number; testimoni: number };
}

async function getStatus(): Promise<Status> {
  try {
    const c = await collections();
    const [settings, layanan, galeri, testimoni] = await Promise.all([
      c.settings.countDocuments({ _id: "site" }),
      c.layanan.countDocuments(),
      c.galeri.countDocuments(),
      c.testimoni.countDocuments(),
    ]);
    return { connected: true, seeded: settings > 0, counts: { layanan, galeri, testimoni } };
  } catch {
    return { connected: false, seeded: false, counts: { layanan: 0, galeri: 0, testimoni: 0 } };
  }
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  await requireAdmin();
  const { ok, err } = await searchParams;
  const status = await getStatus();

  const sections = [
    { href: "/admin/layanan", title: "Layanan & harga", note: `${status.counts.layanan} layanan` },
    { href: "/admin/galeri", title: "Galeri", note: `${status.counts.galeri} foto` },
    { href: "/admin/testimoni", title: "Testimoni", note: `${status.counts.testimoni} ulasan` },
    { href: "/admin/pengaturan", title: "Kontak & jam buka", note: "WhatsApp, alamat, jam" },
  ];

  return (
    <>
      <PageHeader title="Ringkasan">
        Ubah isi website dari sini. Setelah disimpan, perubahan langsung tampil di website.
      </PageHeader>
      <Flash ok={ok} err={err} />

      {!status.connected && (
        <p role="alert" className="mb-6 rounded-xl bg-rose/10 px-4 py-3 text-sm font-medium text-rose-deep">
          Database tidak terjangkau. Periksa MONGODB_URI dan pastikan MongoDB berjalan. Sementara itu website memakai data bawaan.
        </p>
      )}

      {status.connected && !status.seeded && (
        <div className={`${card} mb-8`}>
          <h2 className="display text-2xl">Mulai dari data bawaan</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Database masih kosong. Muat layanan, harga, foto galeri, dan testimoni yang sekarang tampil di website, lalu ubah sesuai kebutuhan. Langkah ini hanya perlu dilakukan sekali.
          </p>
          <form action={seed} className="mt-5">
            <button type="submit" className={primaryButton}>
              Muat data bawaan
            </button>
          </form>
        </div>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <li key={section.href}>
            <Link href={section.href} className={`${card} block transition-colors hover:border-rose`}>
              <h2 className="display text-2xl">{section.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{section.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
