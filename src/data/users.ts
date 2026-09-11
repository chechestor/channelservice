import type { Role, RoleProfile } from "../types";

export const CURRENT_DISPATCHER = {
  name: "Игорь Смирнов",
  shortName: "Игорь",
  label: "Диспетчер",
} as const;

export function isCurrentDispatcher(name?: string): boolean {
  if (!name) {
    return false;
  }
  return name.trim().toLowerCase() === CURRENT_DISPATCHER.name.toLowerCase();
}

export function isOwnedByAnotherDispatcher(executorName?: string): boolean {
  return Boolean(executorName) && !isCurrentDispatcher(executorName);
}

export const ROLE_PROFILES: Record<Role, RoleProfile> = {
  dispatcher: {
    role: "dispatcher",
    label: "Диспетчер",
    name: "Игорь Смирнов",
    shortName: "Игорь",
  },
  manager: {
    role: "manager",
    label: "Руководитель",
    name: "Елена Орлова",
    shortName: "Елена",
  },
  crew_leader: {
    role: "crew_leader",
    label: "Бригадир",
    name: "Алексей Кузнецов",
    shortName: "Алексей",
  },
};

export function canAssignCrews(role: Role): boolean {
  return role === "dispatcher" || role === "manager";
}

export function canClaimRequests(role: Role): boolean {
  return canAssignCrews(role);
}
