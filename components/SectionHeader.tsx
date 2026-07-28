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
    <header className={`mb-12 md:mb-16 max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`field-label mb-3 ${dark ? "text-sand/60" : ""}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] tracking-tight ${
          dark ? "text-background" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-6 text-base md:text-lg leading-relaxed max-w-2xl ${
            dark ? "text-sand/80" : "text-muted"
          }`}
        >
          {intro}
        </p>
      )}
    </header>
  );
}
