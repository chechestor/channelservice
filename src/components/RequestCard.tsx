import { Badge } from "./ui/Badge";
import {
  formatSla,
  requestStatusLabel,
  requestStatusTone,
  requestTypeLabel,
} from "../lib/labels";
import type { Crew, Request } from "../types";
import styles from "./RequestCard.module.css";

interface RequestCardProps {
  request: Request;
  crew?: Crew;
  selected: boolean;
  onOpen: () => void;
}

export function RequestCard({
  request,
  crew,
  selected,
  onOpen,
}: RequestCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onOpen}
    >
      <div className={styles.top}>
        <strong>№{request.id}</strong>
        <Badge tone={request.type === "emergency" ? "emergency" : "planned"}>
          {requestTypeLabel(request.type)}
        </Badge>
      </div>
      <p className={styles.address}>{request.address}</p>
      <p className={styles.meta}>{request.workType}</p>
      {request.slaRemaining ? (
        <Badge tone={request.slaUrgent ? "danger" : "sla"}>
          {request.slaUrgent ? `SLA ${request.slaRemaining}` : formatSla(request)}
        </Badge>
      ) : null}
      <div className={styles.footer}>
        <span>{request.executorName ?? "Исполнитель не назначен"}</span>
        <span>{crew ? crew.name : "Бригада не назначена"}</span>
      </div>
      <Badge tone={requestStatusTone(request.status)}>
        {requestStatusLabel(request.status)}
      </Badge>
    </button>
  );
}
