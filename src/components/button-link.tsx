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
  "group inline-flex items-center justify-center gap-2.5 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors duration-300";

const variants: Record<Variant, string> = {
  primary: "h-12 px-7 bg-ink text-ivory hover:bg-taupe",
  outline: "h-12 px-7 border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  light: "h-12 px-7 bg-ivory text-ink hover:bg-blush",
  text: "h-12 text-ink underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink",
};

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn(base, variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
