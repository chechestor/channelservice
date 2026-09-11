import { RequestRow } from "./RequestRow";
import type { Crew, Request } from "../types";
import styles from "./RequestsTable.module.css";

interface RequestsTableProps {
  requests: Request[];
  crews: Crew[];
  selectedRequestId: number | null;
  onOpen: (id: number) => void;
}

export function RequestsTable({
  requests,
  crews,
  selectedRequestId,
  onOpen,
}: RequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className={styles.empty} role="status">
        Нет заявок по выбранным фильтрам.
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>№</th>
            <th>Создана</th>
            <th>Тип</th>
            <th>Адрес</th>
            <th>Работы</th>
            <th>SLA</th>
            <th>Исполнитель</th>
            <th>Бригада</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              crew={crews.find((crew) => crew.id === request.assignedCrewId)}
              selected={request.id === selectedRequestId}
              onOpen={() => onOpen(request.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
