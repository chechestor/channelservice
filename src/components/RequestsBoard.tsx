import { Plus } from "lucide-react";
import { BOARD_COLUMNS } from "../lib/filters";
import { isCurrentDispatcher } from "../data/users";
import type { Crew, InProgressScope, Request } from "../types";
import { RequestCard } from "./RequestCard";
import { ScopeSlider } from "./ScopeSlider";
import styles from "./RequestsBoard.module.css";

interface RequestsBoardProps {
  requests: Request[];
  crews: Crew[];
  selectedRequestId: number | null;
  inProgressScope: InProgressScope;
  onInProgressScopeChange: (value: InProgressScope) => void;
  onOpen: (id: number) => void;
  onCreate: () => void;
}

export function RequestsBoard({
  requests,
  crews,
  selectedRequestId,
  inProgressScope,
  onInProgressScopeChange,
  onOpen,
  onCreate,
}: RequestsBoardProps) {
  return (
    <div className={styles.board}>
      {BOARD_COLUMNS.map((column) => {
        const rawItems = requests.filter((item) => item.status === column.status);
        const items =
          column.status === "in_progress" && inProgressScope === "mine"
            ? rawItems.filter((item) => isCurrentDispatcher(item.executorName))
            : rawItems;
        const emptyText =
          column.status === "in_progress" &&
          inProgressScope === "mine" &&
          rawItems.length > 0
            ? "Нет ваших заявок"
            : "Нет заявок";

        return (
          <section key={column.status} className={styles.column}>
            <header>
              <div className={styles.heading}>
                <h2>{column.title}</h2>
                {column.status === "new" ? (
                  <button
                    type="button"
                    className={styles.add}
                    onClick={onCreate}
                    aria-label="Создать заявку"
                  >
                    <Plus size={16} />
                  </button>
                ) : null}
                {column.status === "in_progress" ? (
                  <ScopeSlider
                    value={inProgressScope}
                    onChange={onInProgressScopeChange}
                  />
                ) : null}
              </div>
              <span>{items.length}</span>
            </header>
            {items.length === 0 ? (
              <p className={styles.empty}>{emptyText}</p>
            ) : (
              <ul>
                {items.map((request) => (
                  <li key={request.id}>
                    <RequestCard
                      request={request}
                      crew={crews.find(
                        (crew) => crew.id === request.assignedCrewId,
                      )}
                      selected={request.id === selectedRequestId}
                      onOpen={() => onOpen(request.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
