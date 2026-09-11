import { AlertTriangle } from "lucide-react";
import type { ConflictState } from "../types";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import styles from "./ConflictModal.module.css";

interface ConflictModalProps {
  conflict: ConflictState;
  onRefresh: () => void;
}

export function ConflictModal({ conflict, onRefresh }: ConflictModalProps) {
  return (
    <Modal
      title="Назначение изменилось"
      onClose={onRefresh}
      footer={<Button onClick={onRefresh}>Обновить данные</Button>}
    >
      <div className={styles.body}>
        <AlertTriangle size={20} className={styles.icon} />
        <p>
          Пока вы работали с заявкой №{conflict.requestId}, другой диспетчер
          назначил на неё Бригаду №{conflict.assignedCrewId}.
        </p>
        <p className={styles.meta}>
          Изменено:
          <br />
          {conflict.actorName}
          <br />
          {conflict.time}
        </p>
      </div>
    </Modal>
  );
}
