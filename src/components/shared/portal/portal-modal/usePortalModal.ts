import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import type { PortalModalTab } from './PortalModal';

export function usePortalModal({
  open,
  onClose,
  tabs,
  activeIdProp,
  initialActive,
  onTabChange,
  idProp,
}: {
  open: boolean;
  onClose?: () => void;
  tabs: PortalModalTab[];
  activeIdProp?: string;
  initialActive?: string;
  onTabChange?: (id: string, index: number) => void;
  idProp?: string;
}) {
  const autoId = useId().replace(/:/g, '');
  const baseId = idProp || `modal-${autoId}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isControlled = activeIdProp !== undefined;

  const firstId = tabs[0]?.id ?? '';
  const [internalActive, setInternalActive] = useState(() => initialActive || firstId);
  const activeId = isControlled ? activeIdProp : internalActive;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('overflow-hidden');
    } else if (dialog.open) {
      dialog.close();
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  const close = () => {
    onClose?.();
  };

  const onCancel = (event: FormEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };

  const onClickDialog = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  const onChange = (id: string, index: number) => {
    if (!isControlled) setInternalActive(id);
    onTabChange?.(id, index);
  };

  const activeTitleId = useMemo(() => {
    const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
    return active ? `${baseId}-title-${active.id}` : `${baseId}-title`;
  }, [activeId, tabs, baseId]);

  return { baseId, dialogRef, activeId, close, onCancel, onClickDialog, onChange, activeTitleId };
}
