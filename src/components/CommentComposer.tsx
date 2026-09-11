import { useState, type FormEvent } from "react";
import { Button } from "./ui/Button";
import styles from "./CommentComposer.module.css";

interface CommentComposerProps {
  onSubmit: (text: string) => void;
}

export function CommentComposer({ onSubmit }: CommentComposerProps) {
  const [text, setText] = useState("");
  const canSubmit = text.trim().length > 0;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <label>
        Комментарий
        <textarea
          rows={3}
          value={text}
          placeholder="Добавьте комментарий к заявке"
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={!canSubmit}>
        Добавить комментарий
      </Button>
    </form>
  );
}
