import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={styles.toast} role="status">
      <CheckCircle size={16} />
      {message}
    </div>
  );
}
