interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
  dark?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  intro,
  className = "",
  dark = false,
}: SectionHeaderProps) {
  return (
    <header className={`mb-heading-gap max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`font-mono text-metadata mb-2 md:mb-3 ${dark ? "text-on-dark/60" : "text-quiet"}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight text-balance ${
          dark ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 md:mt-6 text-base md:text-lg leading-relaxed max-w-reading ${
            dark ? "text-on-dark/80" : "text-secondary"
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
