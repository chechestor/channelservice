import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";

interface MessageModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

export function MessageModal({ title, message, onClose }: MessageModalProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={<Button onClick={onClose}>Понятно</Button>}
    >
      <p>{message}</p>
    </Modal>
  );
}
