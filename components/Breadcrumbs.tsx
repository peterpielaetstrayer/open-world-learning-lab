import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" data-print-hide="true">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-stone/50">
                /
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors focus-visible:rounded-sm"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
