import { useId } from 'react';

export function usePortalDatasetHeader({
  className,
  source,
  institution,
  dataset,
  lastUpdated,
}: {
  className: string;
  source?: string;
  institution?: string;
  dataset?: { label: string; href: string } | null;
  lastUpdated?: string;
}) {
  const autoId = useId();
  const titleId = `dataset-header-title-${autoId}`;
  const classes = ['dataset-header', className].filter(Boolean).join(' ');
  const hasMeta = Boolean(source || institution || dataset || lastUpdated);

  return { titleId, classes, hasMeta };
}
