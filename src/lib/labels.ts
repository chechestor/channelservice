import type { CrewStatus, Request, RequestStatus, RequestType } from "../types";

export function requestTypeLabel(type: RequestType): string {
  return type === "emergency" ? "Аварийная" : "Плановая";
}

export function requestStatusLabel(status: RequestStatus): string {
  if (status === "new") return "Новая";
  if (status === "in_progress") return "В работе";
  if (status === "assigned") return "Назначена";
  if (status === "completed") return "Завершена";
  return "Отменена";
}

export function requestStatusTone(
  status: RequestStatus,
): "warning" | "progress" | "success" | "neutral" | "danger" {
  if (status === "new") return "warning";
  if (status === "in_progress") return "progress";
  if (status === "assigned") return "success";
  if (status === "completed") return "neutral";
  return "danger";
}

export function crewStatusLabel(status: CrewStatus): string {
  if (status === "available") return "Свободна";
  if (status === "busy") return "Занята";
  return "Недоступна";
}

export function formatSla(request: {
  slaRemaining?: string;
  slaDeadline?: string;
}): string {
  if (request.slaRemaining) {
    return request.slaRemaining;
  }
  if (request.slaDeadline) {
    return `до ${request.slaDeadline}`;
  }
  return "—";
}

export function formatCreated(request: Request): string {
  const [year, month, day] = request.createdDate.split("-");
  return `${day}.${month}.${year} ${request.createdAt}`;
}

export function nextDemoClock(minutesFromMidnight: number): {
  label: string;
  next: number;
} {
  const hours = Math.floor(minutesFromMidnight / 60) % 24;
  const minutes = minutesFromMidnight % 60;
  const label = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  return { label, next: minutesFromMidnight + 1 };
}
