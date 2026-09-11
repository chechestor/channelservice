import { Badge } from "./ui/Badge";
import {
  formatCreated,
  formatSla,
  requestStatusLabel,
  requestStatusTone,
  requestTypeLabel,
} from "../lib/labels";
import type { Crew, Request } from "../types";
import styles from "./RequestRow.module.css";

interface RequestRowProps {
  request: Request;
  crew?: Crew;
  selected: boolean;
  onOpen: () => void;
}

export function RequestRow({
  request,
  crew,
  selected,
  onOpen,
}: RequestRowProps) {
  return (
    <tr
      className={`${styles.row} ${selected ? styles.selected : ""}`}
      onClick={onOpen}
    >
      <td className={styles.id}>№{request.id}</td>
      <td>{formatCreated(request)}</td>
      <td>
        <Badge tone={request.type === "emergency" ? "emergency" : "planned"}>
          {requestTypeLabel(request.type)}
        </Badge>
      </td>
      <td>{request.address}</td>
      <td>{request.workType}</td>
      <td>
        {request.slaRemaining ? (
          <Badge tone={request.slaUrgent ? "danger" : "sla"}>
            {request.slaUrgent ? `SLA ${request.slaRemaining}` : formatSla(request)}
          </Badge>
        ) : (
          "—"
        )}
      </td>
      <td>{request.executorName ?? "—"}</td>
      <td>{crew ? crew.name : "Не назначена"}</td>
      <td>
        <Badge tone={requestStatusTone(request.status)}>
          {requestStatusLabel(request.status)}
        </Badge>
      </td>
      <td>
        <button type="button" className={styles.open} onClick={onOpen}>
          Открыть
        </button>
      </td>
    </tr>
  );
}
