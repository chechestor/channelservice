import { useCallback, useMemo, useState } from "react";
import { INITIAL_CREWS } from "../data/crews";
import { INITIAL_HISTORY, type HistoryByRequest } from "../data/history";
import { INITIAL_REQUESTS } from "../data/requests";
import { CURRENT_DISPATCHER, ROLE_PROFILES, canAssignCrews, canClaimRequests, isOwnedByAnotherDispatcher } from "../data/users";
import {
  EMPTY_LIST_FILTERS,
  isBoardStatus,
  matchesListFilters,
} from "../lib/filters";
import { nextDemoClock } from "../lib/labels";
import { cloneData } from "../lib/matching";
import type {
  ConflictState,
  CreateRequestDraft,
  Crew,
  DemoScenario,
  InProgressScope,
  ListFilters,
  Request,
  Role,
  ToastState,
  ViewMode,
} from "../types";

const CONFLICT_REQUEST_ID = 10428;
const CONFLICT_CREW_ID = 5;
const CONFLICT_ACTOR = "Марина Петрова";
const CONFLICT_TIME = "14:41";
const INITIAL_CLOCK = 14 * 60 + 35;

export function useAssignmentApp() {
  const [role, setRole] = useState<Role>("dispatcher");
  const [requests, setRequests] = useState<Request[]>(() =>
    cloneData(INITIAL_REQUESTS),
  );
  const [crews, setCrews] = useState<Crew[]>(() => cloneData(INITIAL_CREWS));
  const [history, setHistory] = useState<HistoryByRequest>(() =>
    cloneData(INITIAL_HISTORY),
  );
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [pendingClaimId, setPendingClaimId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [listFilters, setListFilters] = useState<ListFilters>(EMPTY_LIST_FILTERS);
  const [demoScenario, setDemoScenario] = useState<DemoScenario>("none");
  const [clock, setClock] = useState(INITIAL_CLOCK);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lockedOpen, setLockedOpen] = useState(false);
  const [rightsHintOpen, setRightsHintOpen] = useState(false);
  const [conflict, setConflict] = useState<ConflictState | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [inProgressScope, setInProgressScope] =
    useState<InProgressScope>("mine");

  const profile = ROLE_PROFILES[role];
  const selectedRequest =
    requests.find((item) => item.id === selectedRequestId) ?? null;
  const pendingClaimRequest =
    requests.find((item) => item.id === pendingClaimId) ?? null;

  const boardRequests = useMemo(
    () => requests.filter((item) => isBoardStatus(item.status)),
    [requests],
  );

  const listRequests = useMemo(
    () => requests.filter((item) => matchesListFilters(item, listFilters)),
    [listFilters, requests],
  );

  const takeTime = useCallback(() => {
    const { label, next } = nextDemoClock(clock);
    setClock(next);
    return label;
  }, [clock]);

  const appendHistory = useCallback(
    (requestId: number, text: string, reason?: string, time?: string) => {
      const entryTime = time ?? takeTime();
      setHistory((current) => {
        const list = current[requestId] ?? [];
        return {
          ...current,
          [requestId]: [
            ...list,
            {
              id: `${requestId}-${list.length + 1}-${entryTime}`,
              time: entryTime,
              text,
              reason,
            },
          ],
        };
      });
      return entryTime;
    },
    [takeTime],
  );

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const resetDemoState = useCallback(() => {
    setRequests(cloneData(INITIAL_REQUESTS));
    setCrews(cloneData(INITIAL_CREWS));
    setHistory(cloneData(INITIAL_HISTORY));
    setSelectedRequestId(null);
    setPendingClaimId(null);
    setListFilters(EMPTY_LIST_FILTERS);
    setCreateOpen(false);
    setInProgressScope("mine");
    setClock(INITIAL_CLOCK);
    setToast(null);
    setLockedOpen(false);
    setRightsHintOpen(false);
    setConflict(null);
  }, []);

  const reset = useCallback(() => {
    setRole("dispatcher");
    setDemoScenario("none");
    resetDemoState();
  }, [resetDemoState]);

  const simulateConflict = useCallback(() => {
    setRole("dispatcher");
    setDemoScenario("conflict");
    resetDemoState();
  }, [resetDemoState]);

  const simulateNoCrews = useCallback(() => {
    setRole("dispatcher");
    setDemoScenario("no_crews");
    resetDemoState();
    setCrews(
      cloneData(INITIAL_CREWS).map((crew) =>
        crew.status === "available"
          ? { ...crew, status: "busy" as const }
          : crew,
      ),
    );
  }, [resetDemoState]);

  const openRequest = useCallback(
    (id: number) => {
      const request = requests.find((item) => item.id === id);
      if (!request) {
        return;
      }

      setConflict(null);

      if (
        request.status === "new" &&
        !request.executorName &&
        canClaimRequests(role)
      ) {
        setPendingClaimId(id);
        return;
      }

      setSelectedRequestId(id);
    },
    [requests, role],
  );

  const closeDrawer = useCallback(() => {
    setSelectedRequestId(null);
  }, []);

  const declineClaim = useCallback(() => {
    setPendingClaimId(null);
  }, []);

  const openWithoutClaim = useCallback(() => {
    if (pendingClaimId === null) {
      return;
    }
    setSelectedRequestId(pendingClaimId);
    setPendingClaimId(null);
  }, [pendingClaimId]);

  const acceptClaim = useCallback(() => {
    if (pendingClaimId === null || !canClaimRequests(role)) {
      setPendingClaimId(null);
      return;
    }

    const actorName = CURRENT_DISPATCHER.name;

    setRequests((current) =>
      current.map((item) =>
        item.id === pendingClaimId
          ? { ...item, status: "in_progress", executorName: actorName }
          : item,
      ),
    );
    appendHistory(pendingClaimId, `${actorName} взял заявку в работу`);
    setSelectedRequestId(pendingClaimId);
    setPendingClaimId(null);
  }, [appendHistory, pendingClaimId, role]);

  const denyPermission = useCallback(() => {
    setLockedOpen(true);
  }, []);

  const closeLocked = useCallback(() => {
    setLockedOpen(false);
  }, []);

  const showRightsHint = useCallback(() => {
    setRightsHintOpen(true);
    setViewMode("board");
    setInProgressScope("all");
  }, []);

  const closeRightsHint = useCallback(() => {
    setRightsHintOpen(false);
  }, []);

  const applyAssignment = useCallback(
    (params: {
      requestId: number;
      crewId: number;
      actorName: string;
      time?: string;
      reason?: string;
      recommendedCrewId?: number;
      historyText?: string;
    }) => {
      const crew = crews.find((item) => item.id === params.crewId);
      if (!crew) {
        return;
      }

      setRequests((current) =>
        current.map((item) =>
          item.id === params.requestId
            ? { ...item, status: "assigned", assignedCrewId: params.crewId }
            : item,
        ),
      );

      setCrews((current) =>
        current.map((item) => {
          if (item.currentRequestId === params.requestId) {
            return { ...item, status: "available", currentRequestId: undefined };
          }
          if (item.id === params.crewId) {
            return {
              ...item,
              status: "busy",
              currentRequestId: params.requestId,
            };
          }
          return item;
        }),
      );

      const changedRecommendation =
        params.recommendedCrewId !== undefined &&
        params.recommendedCrewId !== params.crewId;

      const text =
        params.historyText ??
        (changedRecommendation
          ? `${params.actorName} выбрал ${crew.name} вместо рекомендованной №${params.recommendedCrewId}`
          : `${params.actorName} назначил ${crew.name}`);

      appendHistory(params.requestId, text, params.reason, params.time);
    },
    [appendHistory, crews],
  );

  const assignCrew = useCallback(
    (params: {
      requestId: number;
      crewId: number;
      recommendedCrewId?: number;
      reason?: string;
    }): "assigned" | "conflict" | "denied" | "busy" => {
      if (!canAssignCrews(role)) {
        setLockedOpen(true);
        return "denied";
      }

      const current = requests.find((item) => item.id === params.requestId);
      if (isOwnedByAnotherDispatcher(current?.executorName)) {
        setLockedOpen(true);
        return "denied";
      }

      const targetCrew = crews.find((item) => item.id === params.crewId);
      if (!targetCrew || targetCrew.status !== "available") {
        return "busy";
      }

      if (
        demoScenario === "conflict" &&
        params.requestId === CONFLICT_REQUEST_ID &&
        current?.status === "in_progress"
      ) {
        setConflict({
          requestId: CONFLICT_REQUEST_ID,
          assignedCrewId: CONFLICT_CREW_ID,
          actorName: CONFLICT_ACTOR,
          time: CONFLICT_TIME,
        });
        return "conflict";
      }

      applyAssignment({
        requestId: params.requestId,
        crewId: params.crewId,
        actorName: profile.name,
        recommendedCrewId: params.recommendedCrewId,
        reason: params.reason,
      });

      showToast(`${targetCrew.name} назначена на заявку №${params.requestId}`);
      return "assigned";
    },
    [
      applyAssignment,
      crews,
      demoScenario,
      profile.name,
      requests,
      role,
      showToast,
    ],
  );

  const resolveConflict = useCallback(() => {
    if (!conflict) {
      return;
    }

    applyAssignment({
      requestId: conflict.requestId,
      crewId: conflict.assignedCrewId,
      actorName: conflict.actorName,
      time: conflict.time,
      historyText: `${conflict.actorName} назначила Бригаду №${conflict.assignedCrewId}`,
    });

    setDemoScenario("none");
    setConflict(null);
  }, [applyAssignment, conflict]);

  const recordRecommendation = useCallback(
    (requestId: number, crewName: string) => {
      appendHistory(requestId, `Автоматически предложена ${crewName}`);
    },
    [appendHistory],
  );

  const createRequest = useCallback(
    (draft: CreateRequestDraft) => {
      const nextId = Math.max(0, ...requests.map((item) => item.id)) + 1;
      const createdAt = takeTime();
      const request: Request = {
        id: nextId,
        createdDate: "2026-09-11",
        createdAt,
        type: draft.type,
        source: draft.source,
        address: draft.address,
        workType: draft.workType,
        description: draft.description.trim() || undefined,
        status: "new",
      };
      setRequests((current) => [request, ...current]);
      appendHistory(nextId, "Заявка создана", undefined, createdAt);
      setCreateOpen(false);
    },
    [appendHistory, requests, takeTime],
  );

  const addComment = useCallback(
    (requestId: number, text: string) => {
      const current = requests.find((item) => item.id === requestId);
      if (isOwnedByAnotherDispatcher(current?.executorName)) {
        setLockedOpen(true);
        return;
      }
      appendHistory(requestId, `${CURRENT_DISPATCHER.name}: ${text}`);
    },
    [appendHistory, requests],
  );

  const continueExisting = useCallback(
    (requestId: number) => {
      setCreateOpen(false);
      openRequest(requestId);
    },
    [openRequest],
  );

  return {
    role,
    setRole,
    profile,
    requests,
    crews,
    history,
    selectedRequestId,
    selectedRequest,
    pendingClaimRequest,
    viewMode,
    setViewMode,
    listFilters,
    setListFilters,
    boardRequests,
    listRequests,
    createOpen,
    setCreateOpen,
    inProgressScope,
    setInProgressScope,
    demoScenario,
    toast,
    lockedOpen,
    rightsHintOpen,
    conflict,
    reset,
    simulateConflict,
    simulateNoCrews,
    openRequest,
    closeDrawer,
    acceptClaim,
    openWithoutClaim,
    declineClaim,
    denyPermission,
    closeLocked,
    showRightsHint,
    closeRightsHint,
    assignCrew,
    resolveConflict,
    recordRecommendation,
    createRequest,
    addComment,
    continueExisting,
    dismissToast,
    forceNoCrews: demoScenario === "no_crews",
  };
}
