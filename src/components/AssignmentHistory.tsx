import type { HistoryEntry } from "../types";
import styles from "./AssignmentHistory.module.css";

interface AssignmentHistoryProps {
  entries: HistoryEntry[];
}

export function AssignmentHistory({
  entries,
}: AssignmentHistoryProps) {
  return (
    <section className={styles.section} aria-label="История">
      <h3>История</h3>
      <ol className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <time dateTime={entry.time}>{entry.time}</time>
            <div>
              <p>{entry.text}</p>
              {entry.reason ? (
                <p className={styles.reason}>Причина: {entry.reason}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
