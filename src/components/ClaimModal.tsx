import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import styles from "./ClaimModal.module.css";

interface ClaimModalProps {
  requestId: number;
  onAccept: () => void;
  onOpenOnly: () => void;
  onDecline: () => void;
}

export function ClaimModal({
  requestId,
  onAccept,
  onOpenOnly,
  onDecline,
}: ClaimModalProps) {
  return (
    <Modal
      title="Хотите взять эту заявку в работу?"
      onClose={onDecline}
      footer={
        <>
          <Button variant="secondary" onClick={onOpenOnly}>
            Только открыть
          </Button>
          <Button onClick={onAccept}>Да</Button>
        </>
      }
    >
      <p className={styles.text}>Заявка №{requestId}</p>
    </Modal>
  );
}
