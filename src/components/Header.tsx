import { DemoMenu } from "./DemoMenu";
import { DispatcherAvatar } from "./DispatcherAvatar";
import styles from "./Header.module.css";

interface HeaderProps {
  onReset: () => void;
  onConflict: () => void;
  onNoCrews: () => void;
  onRightsHint: () => void;
}

export function Header({
  onReset,
  onConflict,
  onNoCrews,
  onRightsHint,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <strong>Каналсервис</strong>
        <span>Центр управления</span>
      </div>
      <DemoMenu
        onReset={onReset}
        onConflict={onConflict}
        onNoCrews={onNoCrews}
        onRightsHint={onRightsHint}
      />
      <div className={styles.user} aria-label="Текущий пользователь">
        <DispatcherAvatar />
        <span>Диспетчер Игорь</span>
      </div>
    </header>
  );
}
