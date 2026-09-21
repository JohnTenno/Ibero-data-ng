import type { DialogHTMLAttributes, ReactNode } from 'react';
import { Button } from 'sectei-library';
import { PortalTabs } from '../portal-tabs/PortalTabs';
import { PortalTable, type PortalTableAlign, type PortalTableColumn, type PortalTableRow } from '../portal-table/PortalTable';
import { usePortalModal } from './usePortalModal';
import './portal-modal.css';

export interface PortalModalAction {
  id?: string;
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export interface PortalModalTab {
  id: string;
  label: string;
  title?: ReactNode;
  description?: ReactNode;
  table?: {
    columns: PortalTableColumn[];
    rows?: PortalTableRow[];
    footer?: Record<string, ReactNode>;
    size?: 'condensed' | 'expanded' | 'general';
    align?: PortalTableAlign;
    caption?: string;
  };
  content?: ReactNode;
  actions?: PortalModalAction[];
  disabled?: boolean;
}

export interface PortalModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  tabs?: PortalModalTab[];
  activeId?: string;
  initialActive?: string;
  onTabChange?: (id: string, index: number) => void;
  className?: string;
  id?: string;
  size?: 'small' | 'large' | '';
}

export function PortalModal({
  open = false,
  onClose,
  tabs = [],
  activeId: activeIdProp,
  initialActive,
  onTabChange,
  className = '',
  id: idProp,
  size = 'large',
  ...rest
}: PortalModalProps) {
  const { baseId, dialogRef, activeId, close, onCancel, onClickDialog, onChange, activeTitleId } = usePortalModal({
    open,
    onClose,
    tabs,
    activeIdProp,
    initialActive,
    onTabChange,
    idProp,
  });

  if (!tabs.length) return null;

  const sizeClass = size === 'large' ? 'modal-large' : size === 'small' ? 'modal-small' : '';

  const classes = ['modal', 'modal-popup', sizeClass, className].filter(Boolean).join(' ');

  const items = tabs.map((tab) => {
    const tabTitleId = `${baseId}-title-${tab.id}`;

    return {
      id: tab.id,
      label: tab.label,
      disabled: tab.disabled,
      content: (
        <div className="modal-popup__panel">
          {tab.title ? (
            <h1 id={tabTitleId} className="modal-popup__title">
              {tab.title}
            </h1>
          ) : null}

          {tab.description ? <p className="modal-popup__description">{tab.description}</p> : null}

          {tab.table ? (
            <div className="modal-popup__body">
              <PortalTable
                columns={tab.table.columns}
                rows={tab.table.rows}
                footer={tab.table.footer}
                size={tab.table.size ?? 'condensed'}
                align={tab.table.align}
                caption={tab.table.caption}
              />
            </div>
          ) : tab.content ? (
            <div className="modal-popup__body">{tab.content}</div>
          ) : null}

          {tab.actions?.length ? (
            <div className="modal-popup__footer">
              {tab.actions.map((action, i) => (
                <Button
                  key={action.id || `${tab.id}-action-${i}`}
                  type="button"
                  variant="primary"
                  disabled={action.disabled}
                  href={action.href}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ),
    };
  });

  return (
    <dialog
      ref={dialogRef}
      id={baseId}
      className={classes}
      aria-labelledby={activeTitleId}
      onCancel={onCancel}
      onClick={onClickDialog}
      {...rest}
    >
      <div className="modal-container modal-popup__container">
        <button
          type="button"
          className="button-pictogram button-bare-secondary modal-close modal-popup__close"
          aria-label="Cerrar"
          onClick={close}
        >
          <span className="pictogram-close" aria-hidden="true" />
        </button>

        <PortalTabs
          id={`${baseId}-tabs`}
          ariaLabel="Opciones de descarga"
          items={items}
          activeId={activeId}
          onChange={onChange}
          className="modal-popup__tabs"
        />
      </div>
    </dialog>
  );
}
