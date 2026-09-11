import { useEffect } from "react";
import { X } from "lucide-react";
import {
  formatCreated,
  requestStatusLabel,
  requestStatusTone,
  requestTypeLabel,
} from "../lib/labels";
import type { Crew, HistoryEntry, Request, Role } from "../types";
import { AssignmentHistory } from "./AssignmentHistory";
import { AssignmentPanel } from "./AssignmentPanel";
import { CommentComposer } from "./CommentComposer";
import { Badge } from "./ui/Badge";
import styles from "./RequestDrawer.module.css";

interface RequestDrawerProps {
  request: Request;
  crews: Crew[];
  history: HistoryEntry[];
  role: Role;
  forceNoCrews: boolean;
  onClose: () => void;
  onDenied: () => void;
  onAssign: (params: {
    requestId: number;
    crewId: number;
    recommendedCrewId?: number;
    reason?: string;
  }) => "assigned" | "conflict" | "denied" | "busy";
  onRecordRecommendation: (crewName: string) => void;
  onAddComment: (text: string) => void;
}

export function RequestDrawer({
  request,
  crews,
  history,
  role,
  forceNoCrews,
  onClose,
  onDenied,
  onAssign,
  onRecordRecommendation,
  onAddComment,
}: RequestDrawerProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <h2 id="request-drawer-title">Заявка №{request.id}</h2>
            <p className={styles.subtitle}>{request.address}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть карточку заявки"
          >
            <X size={18} />
          </button>
        </header>

        <div className={styles.body}>
          <dl className={styles.details}>
            <div>
              <dt>Тип</dt>
              <dd>
                <Badge
                  tone={request.type === "emergency" ? "emergency" : "planned"}
                >
                  {requestTypeLabel(request.type)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Создана</dt>
              <dd>{formatCreated(request)}</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>
                <Badge tone={requestStatusTone(request.status)}>
                  {requestStatusLabel(request.status)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Исполнитель</dt>
              <dd>{request.executorName ?? "Не назначен"}</dd>
            </div>
            <div>
              <dt>Источник</dt>
              <dd>{request.source}</dd>
            </div>
            <div>
              <dt>Адрес</dt>
              <dd>{request.address}</dd>
            </div>
            <div>
              <dt>Тип работ</dt>
              <dd>{request.workType}</dd>
            </div>
            <div>
              <dt>SLA</dt>
              <dd>
                {request.slaDeadline
                  ? `до ${request.slaDeadline}`
                  : "не задан"}
              </dd>
            </div>
          </dl>

          {request.description ? (
            <section className={styles.descriptionBlock}>
              <h3>Описание</h3>
              <p>{request.description}</p>
            </section>
          ) : null}

          <AssignmentPanel
            request={request}
            crews={crews}
            role={role}
            forceNoCrews={forceNoCrews}
            onDenied={onDenied}
            onAssign={onAssign}
            onRecordRecommendation={onRecordRecommendation}
          />

          <CommentComposer onSubmit={onAddComment} />

          <AssignmentHistory entries={history} />
        </div>
      </aside>
    </div>
  );
}
