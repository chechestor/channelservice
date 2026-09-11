import { crewStatusLabel } from "../lib/labels";
import { equipmentLabel } from "../lib/matching";
import type { Crew } from "../types";
import styles from "./CrewList.module.css";

interface CrewListProps {
  title: string;
  crews: Crew[];
  selectedId?: number | null;
  recommendedId?: number;
  selectable?: boolean;
  onSelect?: (crewId: number) => void;
}

export function CrewList({
  title,
  crews,
  selectedId,
  recommendedId,
  selectable = false,
  onSelect,
}: CrewListProps) {
  if (crews.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      <ul className={styles.list}>
        {crews.map((crew) => {
          const disabled = crew.status !== "available";
          const selected = crew.id === selectedId;
          return (
            <li key={crew.id}>
              <button
                type="button"
                className={`${styles.item} ${selected ? styles.selected : ""}`}
                disabled={disabled || !selectable}
                onClick={() => onSelect?.(crew.id)}
              >
                <div className={styles.top}>
                  <strong>{crew.name}</strong>
                  <span
                    className={
                      disabled ? styles.statusBusy : styles.statusFree
                    }
                  >
                    {crewStatusLabel(crew.status)}
                  </span>
                </div>
                <p>
                  {disabled && crew.currentRequestId
                    ? `Заявка №${crew.currentRequestId}`
                    : equipmentLabel(crew.equipment[0] ?? "")}
                  {crew.id === recommendedId ? " · рекомендация системы" : ""}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
