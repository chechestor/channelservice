import { Badge } from "./ui/Badge";
import { crewStatusLabel } from "../lib/labels";
import { equipmentLabel } from "../lib/matching";
import type { Crew } from "../types";
import styles from "./CrewRecommendation.module.css";

interface CrewRecommendationProps {
  crew: Crew;
}

export function CrewRecommendation({ crew }: CrewRecommendationProps) {
  return (
    <section className={styles.card} aria-label="Рекомендованная бригада">
      <p className={styles.kicker}>Система рекомендует</p>
      <h3>{crew.name}</h3>
      <div className={styles.meta}>
        <Badge tone="success">{crewStatusLabel(crew.status)}</Badge>
        <span>Район: {crew.district}</span>
      </div>
      <p className={styles.equipment}>
        Оборудование: {crew.equipment.map(equipmentLabel).join(", ")}
      </p>
      <p className={styles.hint}>
        Подходит по доступности, типу работ и ограничениям заявки.
      </p>
    </section>
  );
}
