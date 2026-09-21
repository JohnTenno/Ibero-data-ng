import type { HTMLAttributes, ReactNode } from 'react';
import { usePortalTabs } from './usePortalTabs';
import './portal-tabs.css';

export interface PortalTabItem {
  id?: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface PortalTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items?: PortalTabItem[];
  idAriaLabelledby?: string;
  ariaLabel?: string;
  activeId?: string;
  initialActive?: string;
  onChange?: (id: string, index: number) => void;
  className?: string;
  id?: string;
}

export function PortalTabs({
  items = [],
  idAriaLabelledby,
  ariaLabel,
  activeId: activeIdProp,
  initialActive,
  onChange,
  className = '',
  id: idProp,
  ...rest
}: PortalTabsProps) {
  const { baseId, ids, activeIndex, buttonsRef, select, onKeyDown } = usePortalTabs({
    items,
    activeIdProp,
    initialActive,
    onChange,
    idProp,
  });

  if (!items.length) return null;

  const classes = ['tabs', className].filter(Boolean).join(' ');
  const tablistProps = idAriaLabelledby
    ? { 'aria-labelledby': idAriaLabelledby }
    : { 'aria-label': ariaLabel || 'Tabs' };

  return (
    <div id={baseId} className={classes} {...rest}>
      <div role="tablist" {...tablistProps}>
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={ids[index].itemId}
              ref={(node) => {
                buttonsRef.current[index] = node;
              }}
              id={ids[index].tab}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={ids[index].panel}
              tabIndex={selected ? 0 : -1}
              disabled={Boolean(item.disabled)}
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="tabs__panels">
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <div
              key={ids[index].itemId}
              id={ids[index].panel}
              role="tabpanel"
              aria-labelledby={ids[index].tab}
              tabIndex={0}
              hidden={!selected}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
