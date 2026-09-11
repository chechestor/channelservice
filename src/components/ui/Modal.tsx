import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  size?: "default" | "wide";
  nested?: boolean;
  highlight?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlay?: boolean;
}

export function Modal({
  title,
  children,
  onClose,
  footer,
  size = "default",
  nested = false,
  highlight = false,
  closeOnEscape = true,
  closeOnOverlay = true,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOnEscape, onClose]);

  return (
    <div
      className={`${styles.overlay} ${nested ? styles.nested : ""}`}
      onClick={closeOnOverlay ? onClose : undefined}
      role="presentation"
    >
      <div
        className={`${styles.dialog} ${size === "wide" ? styles.wide : ""} ${highlight ? styles.highlight : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <X size={16} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
