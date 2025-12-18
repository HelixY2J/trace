import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/**
 * Primary CTA button that navigates via Next.js Link.
 * Uses brand colors defined in Tailwind's inline theme.
 */
export function PrimaryButton({
  href,
  children,
  className,
  ariaLabel,
}: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-md bg-brand-primary px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}


