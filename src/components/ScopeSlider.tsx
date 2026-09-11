import type { InProgressScope } from "../types";
import { SegmentedSlider } from "./SegmentedSlider";

interface ScopeSliderProps {
  value: InProgressScope;
  onChange: (value: InProgressScope) => void;
}

const OPTIONS: { id: InProgressScope; label: string }[] = [
  { id: "mine", label: "Мои" },
  { id: "all", label: "Все" },
];

export function ScopeSlider({ value, onChange }: ScopeSliderProps) {
  return (
    <SegmentedSlider
      value={value}
      options={OPTIONS}
      onChange={onChange}
      ariaLabel="Фильтр заявок в работе"
      size="sm"
    />
  );
}
