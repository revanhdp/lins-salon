import { MapPin } from "lucide-react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { navigation, salon } from "@/data/salon";
import { getContent } from "@/lib/content";
import { getInstagramUrl, getMapsUrl, getWhatsAppUrl } from "@/lib/utils";

interface SocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export async function Footer() {
  const { kontak, jamOperasional } = await getContent();
  const instagramUrl = getInstagramUrl(kontak);
  const year = new Date().getFullYear();

  const social: SocialLink[] = [
    ...(instagramUrl ? [{ label: "Instagram", href: instagramUrl, Icon: InstagramIcon }] : []),
    { label: "WhatsApp", href: getWhatsAppUrl(kontak), Icon: WhatsAppIcon },
    { label: "Lokasi Salon", href: getMapsUrl(kontak), Icon: MapPin },
  ];

  return (
    <footer data-hide-mobile-cta className="relative overflow-hidden bg-plum text-paper">
      <div className="shell pt-16 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-3xl">Lins Salon</p>
            <p className="mt-4 max-w-xs text-sm leading-[1.75] text-paper/65">
              Salon kecantikan lokal. Ruang yang tenang dan nyaman untuk merawat penampilan sekaligus beristirahat.
            </p>
          </div>

          <nav aria-label="Navigasi Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="text-sm font-semibold text-blush">Jelajahi</h2>
            <ul className="mt-4 space-y-0.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block py-2.5 text-sm text-paper/80 transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-blush">Hubungi kami</h2>
            <ul className="mt-4 space-y-0.5">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 py-2.5 text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {salon.nama}. Seluruh hak cipta dilindungi.
          </p>
          <p>
            {jamOperasional
              .filter((h) => h.buka)
              .map((h) => `${h.label} · ${h.buka} – ${h.tutup} WIB`)
              .join(" ")}
          </p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="display pointer-events-none mt-6 select-none whitespace-nowrap text-center text-[26vw] leading-[0.8] text-paper/[0.06] lg:text-[19rem]"
      >
        Lins Salon
      </p>
    </footer>
  );
}
