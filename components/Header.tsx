"use client";

import { useState } from "react";

const navLinks = [
  { href: "#origin", label: "Origin" },
  { href: "#framework", label: "Framework" },
  { href: "#missions", label: "Missions" },
  { href: "#guardrails", label: "Guardrails" },
  { href: "#library", label: "Library" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-dark/40 bg-background/80 backdrop-blur-xl shadow-sm shadow-foreground/[0.03]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-serif text-base leading-snug sm:text-lg md:text-xl text-foreground tracking-tight hover:text-tahoe transition-colors min-w-0 pr-3 sm:pr-0 focus-visible:rounded-sm"
        >
          Open World Learning Lab
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors focus-visible:rounded-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#meta-academy"
            className="btn-tactile rounded-full bg-pine px-5 py-2 text-sm font-medium text-white hover:bg-pine-light"
          >
            Explore the concept
          </a>
        </nav>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
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
          className="md:hidden border-t border-sand-dark/50 bg-background px-6 py-4"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-muted hover:text-foreground transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#meta-academy"
                className="inline-block rounded-full bg-pine px-5 py-2 text-sm font-medium text-white"
                onClick={() => setMenuOpen(false)}
              >
                Explore the concept
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
