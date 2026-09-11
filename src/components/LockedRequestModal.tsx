import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import styles from "./LockedRequestModal.module.css";

interface LockedRequestModalProps {
  onClose: () => void;
}

export function LockedRequestModal({ onClose }: LockedRequestModalProps) {
  return (
    <Modal
      title="Заявка недоступна для изменения"
      onClose={onClose}
      footer={<Button onClick={onClose}>Понятно</Button>}
    >
      <p className={styles.text}>
        Заявка находится в работе у другого сотрудника и не может быть изменена
        вами.
      </p>
    </Modal>
  );
}
