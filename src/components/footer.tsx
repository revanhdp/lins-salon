import { MapPin } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { navigation, salon } from "@/data/salon";
import { getInstagramUrl, getMapsUrl, getWhatsAppUrl } from "@/lib/utils";

interface SocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function Footer() {
  const instagramUrl = getInstagramUrl();
  const year = new Date().getFullYear();

  const social: SocialLink[] = [
    ...(instagramUrl ? [{ label: "Instagram", href: instagramUrl, Icon: InstagramIcon }] : []),
    { label: "WhatsApp", href: getWhatsAppUrl(), Icon: WhatsAppIcon },
    { label: "Lokasi Salon", href: getMapsUrl(), Icon: MapPin },
  ];

  return (
    <footer data-hide-mobile-cta className="bg-ink text-ivory">
      <div className="shell border-t border-ivory/10 py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#beranda" className="font-serif text-2xl font-medium tracking-[0.18em]">
              LINS <span className="text-taupe-light">SALON</span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-[1.75] text-ivory/60">
              Salon kecantikan lokal — ruang yang tenang dan nyaman untuk merawat penampilan serta relaksasi diri Anda.
            </p>
          </div>

          <nav aria-label="Navigasi Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="text-[0.6875rem] tracking-[0.2em] text-ivory/50 uppercase">Navigasi</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-ivory/80 transition-colors hover:text-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-[0.6875rem] tracking-[0.2em] text-ivory/50 uppercase">Hubungi Kami</h2>
            <ul className="mt-5 space-y-3">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm text-ivory/80 transition-colors hover:text-ivory"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ivory/10 pt-8 text-xs text-ivory/50 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {salon.nama}. Seluruh hak cipta dilindungi.
          </p>
          <p>
            {salon.jamOperasional
              .filter((h) => h.buka)
              .map((h) => `${h.label} · ${h.buka} — ${h.tutup} WIB`)
              .join(" ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
