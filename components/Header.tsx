"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { navLinks, siteConfig } from "@/content/shared";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-page/85 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]"
      data-print-hide="true"
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-5 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link
          href="/"
          className="font-serif text-[0.9375rem] leading-snug sm:text-lg text-ink tracking-tight hover:text-water transition-colors min-w-0 shrink focus-visible:rounded-sm"
        >
          <span className="sm:hidden">{siteConfig.shortName}</span>
          <span className="hidden sm:inline">{siteConfig.name}</span>
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
            className="btn-tactile inline-flex min-h-11 items-center rounded-full bg-moss px-5 py-2.5 text-sm font-medium text-on-dark hover:bg-moss/90"
          >
            Start a Conversation
          </Link>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-md -mr-1"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="relative flex h-3.5 w-6 flex-col justify-between" aria-hidden="true">
            <span
              className={`block h-0.5 w-full bg-foreground transition-transform origin-center ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-foreground transition-transform origin-center ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav
          ref={menuRef}
          id={menuId}
          className="md:hidden border-t border-border bg-page px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center text-secondary hover:text-ink transition-colors py-2"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center rounded-full bg-moss px-5 py-2.5 text-sm font-medium text-on-dark"
                onClick={closeMenu}
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
