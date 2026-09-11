import { useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { canAssignCrews, isOwnedByAnotherDispatcher } from "../data/users";
import { crewStatusLabel } from "../lib/labels";
import {
  equipmentLabel,
  getEligibleCrews,
  pickRecommendation,
} from "../lib/matching";
import type { Crew, Request, Role } from "../types";
import { CrewList } from "./CrewList";
import { CrewRecommendation } from "./CrewRecommendation";
import { Button } from "./ui/Button";
import styles from "./AssignmentPanel.module.css";

const AUTO_SELECT_MS = 650;

type Phase = "idle" | "loading" | "recommended" | "no_crew" | "manual";

interface AssignmentPanelProps {
  request: Request;
  crews: Crew[];
  role: Role;
  forceNoCrews: boolean;
  onDenied: () => void;
  onAssign: (params: {
    requestId: number;
    crewId: number;
    recommendedCrewId?: number;
    reason?: string;
  }) => "assigned" | "conflict" | "denied" | "busy";
  onRecordRecommendation: (crewName: string) => void;
}

export function AssignmentPanel({
  request,
  crews,
  role,
  forceNoCrews,
  onDenied,
  onAssign,
  onRecordRecommendation,
}: AssignmentPanelProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [recommendedId, setRecommendedId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const assignedCrew = crews.find((crew) => crew.id === request.assignedCrewId);

  const eligible = useMemo(
    () => getEligibleCrews(request, crews, forceNoCrews),
    [crews, forceNoCrews, request],
  );

  const busyCrews = crews.filter((crew) => crew.status === "busy").slice(0, 3);
  const recommendedCrew = crews.find((crew) => crew.id === recommendedId);
  const alternativeCrews = eligible.filter((crew) => crew.id !== recommendedId);
  const commentRequired =
    selectedId !== null &&
    recommendedId !== null &&
    selectedId !== recommendedId;
  const canConfirm =
    selectedId !== null && (!commentRequired || comment.trim().length > 0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase("idle");
    setRecommendedId(null);
    setSelectedId(null);
    setComment("");
  }, [request.id]);

  useEffect(() => {
    if (request.status === "assigned") {
      setPhase("idle");
      setSelectedId(null);
      setComment("");
    }
  }, [request.assignedCrewId, request.status]);

  const runAutoSelect = () => {
    if (isOwnedByAnotherDispatcher(request.executorName) || !canAssignCrews(role)) {
      onDenied();
      return;
    }

    setPhase("loading");
    setComment("");
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      const match = pickRecommendation(request, eligible);
      if (!match) {
        setRecommendedId(null);
        setSelectedId(null);
        setPhase("no_crew");
        return;
      }
      setRecommendedId(match.id);
      setSelectedId(match.id);
      setPhase("recommended");
      onRecordRecommendation(match.name);
    }, AUTO_SELECT_MS);
  };

  const confirmAssignment = () => {
    if (isOwnedByAnotherDispatcher(request.executorName) || !canAssignCrews(role)) {
      onDenied();
      return;
    }
    if (selectedId === null) {
      return;
    }

    const result = onAssign({
      requestId: request.id,
      crewId: selectedId,
      recommendedCrewId: recommendedId ?? undefined,
      reason: commentRequired ? comment.trim() : undefined,
    });

    if (result === "assigned") {
      setPhase("idle");
    }
  };

  const isClosed =
    request.status === "completed" || request.status === "cancelled";

  return (
    <div className={styles.panel}>
      <div className={styles.current}>
        <span>Текущее назначение</span>
        <strong>
          {assignedCrew ? assignedCrew.name : "Не назначена"}
        </strong>
        {assignedCrew ? (
          <p>
            {crewStatusLabel(assignedCrew.status)} ·{" "}
            {assignedCrew.equipment.map(equipmentLabel).join(", ")}
          </p>
        ) : null}
      </div>

      <h3>Назначение бригады</h3>

      {isClosed ? (
        <p className={styles.manualHint}>
          Назначение бригады недоступно для завершённых и отменённых заявок.
        </p>
      ) : null}

      {phase === "idle" && !isClosed ? (
        <Button onClick={runAutoSelect}>Выбрать автоматически</Button>
      ) : null}

      {phase === "loading" ? (
        <div className={styles.loading} role="status">
          <LoaderCircle size={18} className={styles.spinner} />
          Подбираем свободную бригаду…
        </div>
      ) : null}

      {phase === "no_crew" ? (
        <div className={styles.empty} role="status">
          <strong>Подходящая бригада не найдена</strong>
          <p>
            Сейчас нет свободных бригад, удовлетворяющих обязательным условиям
            заявки.
          </p>
          <div className={styles.actions}>
            <Button onClick={runAutoSelect}>Обновить</Button>
            <Button variant="secondary" onClick={() => setPhase("idle")}>
              Оставить на ручном назначении
            </Button>
          </div>
        </div>
      ) : null}

      {phase === "recommended" && recommendedCrew ? (
        <>
          <CrewRecommendation crew={recommendedCrew} />
          <CrewList title="Другие доступные бригады" crews={alternativeCrews} />
          <CrewList title="Занятые бригады" crews={busyCrews} />
          <div className={styles.actions}>
            <Button onClick={confirmAssignment}>
              Назначить {recommendedCrew.name}
            </Button>
            <Button variant="secondary" onClick={() => setPhase("manual")}>
              Выбрать другую
            </Button>
          </div>
        </>
      ) : null}

      {phase === "manual" && recommendedCrew ? (
        <>
          <p className={styles.manualHint}>
            Рекомендация системы: {recommendedCrew.name}. Если выбираете другую
            бригаду, укажите причину.
          </p>
          <CrewList
            title="Доступные бригады"
            crews={eligible}
            selectable
            selectedId={selectedId}
            recommendedId={recommendedId ?? undefined}
            onSelect={setSelectedId}
          />
          {commentRequired ? (
            <label className={styles.comment}>
              Причина изменения рекомендации
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Укажите причину выбора другой бригады"
                rows={3}
              />
            </label>
          ) : null}
          <div className={styles.actions}>
            <Button onClick={confirmAssignment} disabled={!canConfirm}>
              Назначить
            </Button>
            <Button variant="secondary" onClick={() => setPhase("recommended")}>
              К рекомендации
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
