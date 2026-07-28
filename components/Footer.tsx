import Link from "next/link";
import { navLinks, siteConfig } from "@/content/shared";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-deep-field text-on-dark" data-print-hide="true">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-serif text-xl">{siteConfig.name}</p>
            <p className="mt-3 text-sm text-on-dark/70 leading-relaxed max-w-sm">
              Independent education design lab developing place-based learning journeys, mentor systems, and intelligent tools.
            </p>
          </div>

          <nav aria-label="Footer navigation" data-print-hide="true">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-on-dark/70 hover:text-on-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-on-dark/70 hover:text-on-dark transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-on-dark/10 space-y-3">
          <p className="text-xs text-on-dark/50">{siteConfig.copyright}</p>
          <p className="text-xs text-on-dark/50">{siteConfig.licensingNote}</p>
          <p className="text-xs text-on-dark/50 max-w-2xl">{siteConfig.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
