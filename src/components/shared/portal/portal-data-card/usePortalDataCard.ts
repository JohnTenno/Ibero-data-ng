function joinMeta(parts: (string | number | null | undefined)[] = []): string {
  return parts
    .map((part) => (part == null ? '' : String(part).trim()))
    .filter(Boolean)
    .join(' · ');
}

export function usePortalDataCard({
  meta,
  source,
  year,
  institutions,
  className,
}: {
  meta?: string;
  source?: string | number;
  year?: string | number;
  institutions?: string | number;
  className: string;
}) {
  const metaText = meta ?? joinMeta([source, year, institutions]);
  const classes = ['data-card', className].filter(Boolean).join(' ');

  return { metaText, classes };
}
