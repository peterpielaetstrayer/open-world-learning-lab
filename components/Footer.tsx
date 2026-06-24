const footerLinks = [
  { href: "#origin", label: "Origin" },
  { href: "#framework", label: "Framework" },
  { href: "#missions", label: "Missions" },
  { href: "#guardrails", label: "Guardrails" },
  { href: "#library", label: "Library" },
];

export default function Footer() {
  return (
    <footer className="border-t border-sand-dark/50 bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-serif text-xl">Open World Learning Lab</p>
            <p className="mt-3 text-sm text-sand/70 leading-relaxed max-w-sm">
              Open-source education design for a more alive learning future.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-sand/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-sand/50 max-w-lg">
            Educational design materials intended for CC BY 4.0 unless otherwise
            noted.
          </p>
          <p className="text-xs text-sand/50">Built as a public concept project.</p>
        </div>
      </div>
    </footer>
  );
}
