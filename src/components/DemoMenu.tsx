import { useEffect, useRef, useState } from "react";
import styles from "./DemoMenu.module.css";

interface DemoMenuProps {
  onReset: () => void;
  onConflict: () => void;
  onNoCrews: () => void;
  onRightsHint: () => void;
}

export function DemoMenu({
  onReset,
  onConflict,
  onNoCrews,
  onRightsHint,
}: DemoMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Demo
      </button>
      {open ? (
        <div className={styles.menu} role="menu">
          <button type="button" role="menuitem" onClick={() => run(onReset)}>
            Сбросить данные
          </button>
          <button type="button" role="menuitem" onClick={() => run(onConflict)}>
            Симулировать конфликт
          </button>
          <button type="button" role="menuitem" onClick={() => run(onNoCrews)}>
            Сценарий «нет свободных бригад»
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => run(onRightsHint)}
          >
            Недостаточно прав (чужая заявка)
          </button>
        </div>
      ) : null}
    </div>
  );
}
