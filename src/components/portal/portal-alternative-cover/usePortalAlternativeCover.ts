import type { CSSProperties } from 'react';

const ALIGNMENTS: Record<string, string> = {
  left: 'cover-alternative-left',
  right: 'cover-alternative-right',
};

export function usePortalAlternativeCover({
  align,
  backgroundColor,
  imageSrc,
  imageAlt,
  videoSrc,
  className,
}: {
  align: 'left' | 'right';
  backgroundColor?: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  className: string;
}) {
  const alignClass = ALIGNMENTS[align] ?? ALIGNMENTS.left;
  const colorOnly = Boolean(backgroundColor) && !videoSrc && !imageSrc;

  const classes = ['cover', 'cover-alternative', alignClass, colorOnly ? 'cover-alternative-bg-color' : '', className]
    .filter(Boolean)
    .join(' ');

  const imageAriaHidden = imageAlt ? undefined : true;
  const backgroundStyle: CSSProperties | undefined = backgroundColor ? { backgroundColor } : undefined;

  return { classes, imageAriaHidden, backgroundStyle };
}
