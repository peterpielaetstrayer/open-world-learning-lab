"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, siteConfig } from "@/content/shared";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-page/85 backdrop-blur-xl" data-print-hide="true">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 sm:px-6 lg:px-8 py-4">
        <Link
          href="/"
          className="font-serif text-base leading-snug sm:text-lg text-ink tracking-tight hover:text-water transition-colors min-w-0 pr-3 sm:pr-0 focus-visible:rounded-sm"
        >
          {siteConfig.name}
        </Link>

        <nav
          className="hidden md:flex items-center gap-5 lg:gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isPageLink = !link.href.includes("#");
            const isActive = isPageLink && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors focus-visible:rounded-sm ${
                  isActive
                    ? "text-ink font-medium"
                    : "text-secondary hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="btn-tactile rounded-full bg-moss px-5 py-2 text-sm font-medium text-on-dark hover:bg-moss/90"
          >
            Start a Conversation
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`block h-0.5 w-6 bg-foreground transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-foreground transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden border-t border-border bg-page px-6 py-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-secondary hover:text-ink transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-moss px-5 py-2.5 text-sm font-medium text-on-dark"
                onClick={() => setMenuOpen(false)}
              >
                Start a Conversation
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
