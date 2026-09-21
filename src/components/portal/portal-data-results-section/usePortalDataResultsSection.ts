import { useId } from 'react';

export function usePortalDataResultsSection({
  total,
  items,
  className,
}: {
  total?: number;
  items: unknown[];
  className: string;
}) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const count = total ?? items.length;

  const classes = ['data-results-section', 'container', 'width-fixed', className].filter(Boolean).join(' ');

  return { titleId, count, classes };
}
