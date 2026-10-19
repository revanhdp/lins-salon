import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "text";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: ReactNode;
}

const base =
  "group inline-flex items-center justify-center gap-2.5 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "h-12 rounded-full bg-rose px-7 text-paper hover:bg-rose-deep",
  outline: "h-12 rounded-full border border-ink/20 px-7 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light: "h-12 rounded-full bg-paper px-7 text-ink hover:bg-blush",
  text: "h-12 text-ink underline decoration-rose/50 decoration-2 underline-offset-[6px] hover:decoration-rose",
};

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], className);

  if (!external && href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
