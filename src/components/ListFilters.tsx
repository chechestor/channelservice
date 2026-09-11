import type { ListFilters, Request, RequestStatus, RequestType } from "../types";
import { requestStatusLabel } from "../lib/labels";
import styles from "./ListFilters.module.css";

interface ListFiltersProps {
  value: ListFilters;
  requests: Request[];
  onChange: (value: ListFilters) => void;
}

const STATUS_OPTIONS: RequestStatus[] = [
  "new",
  "in_progress",
  "assigned",
  "completed",
  "cancelled",
];

export function ListFiltersBar({
  value,
  requests,
  onChange,
}: ListFiltersProps) {
  const workTypes = unique(requests.map((item) => item.workType));
  const sources = unique(requests.map((item) => item.source));

  const patch = (partial: Partial<ListFilters>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <label>
        Поиск
        <input
          type="search"
          value={value.query}
          placeholder="Номер, адрес, источник, работы…"
          onChange={(event) => patch({ query: event.target.value })}
        />
      </label>
      <label>
        Адрес
        <input
          type="search"
          value={value.address}
          placeholder="Поиск по адресу"
          onChange={(event) => patch({ address: event.target.value })}
        />
      </label>
      <label>
        Дата с
        <input
          type="date"
          value={value.dateFrom}
          onChange={(event) => patch({ dateFrom: event.target.value })}
        />
      </label>
      <label>
        Дата по
        <input
          type="date"
          value={value.dateTo}
          onChange={(event) => patch({ dateTo: event.target.value })}
        />
      </label>
      <label>
        Тип
        <select
          value={value.type}
          onChange={(event) =>
            patch({ type: event.target.value as RequestType | "all" })
          }
        >
          <option value="all">Все</option>
          <option value="emergency">Аварийная</option>
          <option value="planned">Плановая</option>
        </select>
      </label>
      <label>
        Статус
        <select
          value={value.status}
          onChange={(event) =>
            patch({ status: event.target.value as RequestStatus | "all" })
          }
        >
          <option value="all">Все</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {requestStatusLabel(status)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Работы
        <select
          value={value.workType}
          onChange={(event) => patch({ workType: event.target.value })}
        >
          <option value="all">Все</option>
          {workTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        Источник
        <select
          value={value.source}
          onChange={(event) => patch({ source: event.target.value })}
        >
          <option value="all">Все</option>
          {sources.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
