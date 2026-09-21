import { Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { usePortalAlternativeCover } from './usePortalAlternativeCover';

function renderTextWithBreaks(content: ReactNode): ReactNode {
  if (typeof content !== 'string' || !content.includes('\n')) {
    return content;
  }

  const lines = content.split('\n');
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

function TextWithVariant({
  as: Tag,
  className,
  desktop,
  mobile,
}: {
  as: 'h1' | 'p';
  className: string;
  desktop?: ReactNode;
  mobile?: ReactNode;
}) {
  if (!desktop && !mobile) return null;

  const mobileText = mobile ?? desktop;
  const hasVariant = mobile != null && mobile !== desktop;

  if (!hasVariant) {
    return <Tag className={className}>{renderTextWithBreaks(desktop)}</Tag>;
  }

  return (
    <Tag className={className}>
      <span className="hidden-mobile">{renderTextWithBreaks(desktop)}</span>
      <span className="hidden-desktop">{renderTextWithBreaks(mobileText)}</span>
    </Tag>
  );
}

export interface PortalAlternativeCoverProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  align?: 'left' | 'right';
  backgroundColor?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  titleMobile?: ReactNode;
  subtitleMobile?: ReactNode;
  imageSrc?: string;
  imageSrcMobile?: string;
  imageAlt?: string;
  videoSrc?: string;
  videoSrcMobile?: string;
  className?: string;
}

export function PortalAlternativeCover({
  align = 'left',
  backgroundColor,
  title,
  subtitle,
  titleMobile,
  subtitleMobile,
  imageSrc,
  imageSrcMobile,
  imageAlt = '',
  videoSrc,
  videoSrcMobile,
  className = '',
  ...rest
}: PortalAlternativeCoverProps) {
  const { classes, imageAriaHidden, backgroundStyle } = usePortalAlternativeCover({
    align,
    backgroundColor,
    imageSrc,
    imageAlt,
    videoSrc,
    className,
  });

  return (
    <header className={classes} style={backgroundStyle} {...rest}>
      {videoSrc ? (
        <>
          <video
            className={videoSrcMobile ? 'cover-image hidden-mobile' : 'cover-image'}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden={imageAriaHidden}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {videoSrcMobile ? (
            <video className="cover-image hidden-desktop" autoPlay muted loop playsInline aria-hidden={imageAriaHidden}>
              <source src={videoSrcMobile} type="video/mp4" />
            </video>
          ) : null}
        </>
      ) : imageSrc ? (
        <>
          <img
            className={imageSrcMobile ? 'cover-image hidden-mobile' : 'cover-image'}
            src={imageSrc}
            alt={imageAlt}
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
          {imageSrcMobile ? (
            <img
              className="cover-image hidden-desktop"
              src={imageSrcMobile}
              alt={imageAlt}
              decoding="async"
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
        </>
      ) : null}

      <div className="cover-gradient">
        <div className="cover-body">
          <TextWithVariant as="h1" className="cover-title" desktop={title} mobile={titleMobile} />
          <TextWithVariant as="p" className="cover-subtitle" desktop={subtitle} mobile={subtitleMobile} />
        </div>
      </div>
    </header>
  );
}
