import type { HTMLAttributes } from 'react';
import { Button } from 'sectei-library';
import { usePortalButtonSection } from './usePortalButtonSection';

export interface PortalButtonSectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  intro?: string;
  buttonText?: string;
  href?: string;
  onClick?: () => void;
  buttonVariant?: string;
  buttonSize?: string;
  disabled?: boolean;
  className?: string;
}

export function PortalButtonSection({
  title = '',
  intro = '',
  buttonText = '',
  href,
  onClick,
  buttonVariant = 'secondary',
  buttonSize = 'default',
  disabled = false,
  className = '',
  ...rest
}: PortalButtonSectionProps) {
  const { titleId, classes } = usePortalButtonSection({ className });

  return (
    <section className={classes} aria-labelledby={title ? titleId : undefined} {...rest}>
      <div className="button-section__content">
        {title ? (
          <h2 id={titleId} className="button-section__title">
            {title}
          </h2>
        ) : null}

        {intro ? <p className="button-section__intro">{intro}</p> : null}

        {buttonText ? (
          <div className="button-section__action">
            <Button variant={buttonVariant} size={buttonSize} href={href} onClick={onClick} disabled={disabled}>
              {buttonText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
