export type Role = "dispatcher" | "manager" | "crew_leader";

export type RequestStatus =
  | "new"
  | "in_progress"
  | "assigned"
  | "completed"
  | "cancelled";

export type CrewStatus = "available" | "busy" | "unavailable";

export type RequestType = "emergency" | "planned";

export type ViewMode = "board" | "list";

export type InProgressScope = "mine" | "all";

export type DemoScenario = "none" | "conflict" | "no_crews";

export interface CreateRequestDraft {
  address: string;
  type: RequestType;
  workType: string;
  source: string;
  description: string;
}

export interface ListFilters {
  query: string;
  address: string;
  dateFrom: string;
  dateTo: string;
  type: RequestType | "all";
  status: RequestStatus | "all";
  workType: string;
  source: string;
}

export interface Request {
  id: number;
  createdDate: string;
  createdAt: string;
  type: RequestType;
  source: string;
  address: string;
  workType: string;
  description?: string;
  slaDeadline?: string;
  slaRemaining?: string;
  slaUrgent?: boolean;
  status: RequestStatus;
  assignedCrewId?: number;
  executorName?: string;
}

export interface Crew {
  id: number;
  name: string;
  status: CrewStatus;
  district: string;
  equipment: string[];
  currentRequestId?: number;
}

export interface HistoryEntry {
  id: string;
  time: string;
  text: string;
  reason?: string;
}

export interface RoleProfile {
  role: Role;
  label: string;
  name: string;
  shortName: string;
}

export interface ConflictState {
  requestId: number;
  assignedCrewId: number;
  actorName: string;
  time: string;
}

export interface ToastState {
  id: number;
  message: string;
}
