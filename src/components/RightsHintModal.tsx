import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import styles from "./RightsHintModal.module.css";

interface RightsHintModalProps {
  onClose: () => void;
}

export function RightsHintModal({ onClose }: RightsHintModalProps) {
  return (
    <Modal
      title="Недостаточно прав (чужая заявка)"
      onClose={onClose}
      footer={<Button onClick={onClose}>Понятно</Button>}
    >
      <p className={styles.text}>
        Сейчас вы — диспетчер Игорь. Откройте заявку <strong>№10429</strong> в
        колонке «В работе» (переключатель <strong>Все</strong>) и попробуйте
        назначить бригаду.
      </p>
    </Modal>
  );
}
