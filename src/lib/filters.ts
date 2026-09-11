import type { ListFilters, Request, RequestStatus } from "../types";
import { requestStatusLabel } from "./labels";

export const EMPTY_LIST_FILTERS: ListFilters = {
  query: "",
  address: "",
  dateFrom: "",
  dateTo: "",
  type: "all",
  status: "all",
  workType: "all",
  source: "all",
};

export const BOARD_COLUMNS: { status: RequestStatus; title: string }[] = [
  { status: "new", title: "Новая" },
  { status: "in_progress", title: "В работе" },
  { status: "assigned", title: "Назначена" },
];

export function isBoardStatus(status: RequestStatus): boolean {
  return BOARD_COLUMNS.some((column) => column.status === status);
}

export function findAddressMatches(
  query: string,
  requests: Request[],
): Request[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) {
    return [];
  }

  return requests.filter(
    (item) =>
      isBoardStatus(item.status) &&
      item.address.toLowerCase().includes(normalized),
  );
}

export function matchesListFilters(
  request: Request,
  filters: ListFilters,
): boolean {
  if (filters.type !== "all" && request.type !== filters.type) {
    return false;
  }
  if (filters.status !== "all" && request.status !== filters.status) {
    return false;
  }
  if (filters.workType !== "all" && request.workType !== filters.workType) {
    return false;
  }
  if (filters.source !== "all" && request.source !== filters.source) {
    return false;
  }
  if (filters.dateFrom && request.createdDate < filters.dateFrom) {
    return false;
  }
  if (filters.dateTo && request.createdDate > filters.dateTo) {
    return false;
  }

  const addressQuery = filters.address.trim().toLowerCase();
  if (
    addressQuery &&
    !request.address.toLowerCase().includes(addressQuery)
  ) {
    return false;
  }

  const query = filters.query.trim().toLowerCase();
  if (query) {
    const haystack = [
      String(request.id),
      request.address,
      request.source,
      request.workType,
      request.executorName ?? "",
      requestStatusLabel(request.status),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(query)) {
      return false;
    }
  }

  return true;
}
