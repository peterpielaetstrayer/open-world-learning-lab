import Link from "next/link";
import { navLinks, siteConfig } from "@/content/shared";

export default function Footer() {
  return (
    <footer className="border-t border-sand-dark/50 bg-foreground text-background" data-print-hide="true">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-serif text-xl">{siteConfig.name}</p>
            <p className="mt-3 text-sm text-sand/70 leading-relaxed max-w-sm print:text-muted">
              Independent education design lab developing place-based learning journeys, mentor systems, and intelligent tools.
            </p>
          </div>

          <nav aria-label="Footer navigation" data-print-hide="true">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-sand/70 hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-sand/10 space-y-3">
          <p className="text-xs text-sand/50 print:text-muted">{siteConfig.copyright}</p>
          <p className="text-xs text-sand/50 print:text-muted">{siteConfig.licensingNote}</p>
          <p className="text-xs text-sand/50 max-w-2xl print:text-muted">{siteConfig.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
