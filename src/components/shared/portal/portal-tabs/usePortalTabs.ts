import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { PortalTabItem } from './PortalTabs';

export function usePortalTabs({
  items,
  activeIdProp,
  initialActive,
  onChange,
  idProp,
}: {
  items: PortalTabItem[];
  activeIdProp?: string;
  initialActive?: string;
  onChange?: (id: string, index: number) => void;
  idProp?: string;
}) {
  const autoId = useId().replace(/:/g, '');
  const baseId = idProp || `tabs-${autoId}`;
  const isControlled = activeIdProp !== undefined;

  const firstEnabled = useMemo(() => {
    const found = items.find((item) => !item.disabled);
    return found?.id ?? items[0]?.id ?? '';
  }, [items]);

  const [internalActive, setInternalActive] = useState(() => initialActive || firstEnabled);

  const activeId = isControlled ? activeIdProp : internalActive;
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const ids = useMemo(
    () =>
      items.map((item, i) => ({
        tab: item.id ? `tab-${item.id}` : `${baseId}-tab-${i}`,
        panel: item.id ? `tabpanel-${item.id}` : `${baseId}-panel-${i}`,
        itemId: item.id || `${baseId}-${i}`,
      })),
    [items, baseId],
  );

  const activeIndex = Math.max(
    0,
    items.findIndex((_, i) => ids[i].itemId === activeId),
  );

  const select = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    const id = ids[index].itemId;
    if (!isControlled) setInternalActive(id);
    onChange?.(id, index);
  };

  const enabledIndexes = useMemo(
    () => items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0),
    [items],
  );

  const focusIndex = (index: number) => {
    buttonsRef.current[index]?.focus();
  };

  const moveFocus = (from: number, direction: 1 | -1) => {
    if (!enabledIndexes.length) return;
    const pos = enabledIndexes.indexOf(from);
    const base = pos === -1 ? 0 : pos;
    const next = enabledIndexes[(base + direction + enabledIndexes.length) % enabledIndexes.length];
    focusIndex(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let handled = false;

    switch (event.key) {
      case 'ArrowLeft':
        moveFocus(index, -1);
        handled = true;
        break;
      case 'ArrowRight':
        moveFocus(index, 1);
        handled = true;
        break;
      case 'Home':
        focusIndex(enabledIndexes[0]);
        handled = true;
        break;
      case 'End':
        focusIndex(enabledIndexes[enabledIndexes.length - 1]);
        handled = true;
        break;
      default:
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return { baseId, ids, activeId, activeIndex, buttonsRef, select, onKeyDown };
}
