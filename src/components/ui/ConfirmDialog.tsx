import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-editorial-sm text-text-secondary leading-relaxed mt-2 mb-6">
        {message}
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">
          {cancelLabel}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`flex-1 ${
            danger
              ? "bg-danger text-white border border-danger hover:opacity-90"
              : "btn-primary"
          }`}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", border: danger ? "1px solid var(--color-danger)" : undefined }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
