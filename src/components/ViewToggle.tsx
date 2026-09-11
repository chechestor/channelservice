import type { ViewMode } from "../types";
import { SegmentedSlider } from "./SegmentedSlider";

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

const OPTIONS: { id: ViewMode; label: string }[] = [
  { id: "board", label: "Доска" },
  { id: "list", label: "Список" },
];

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <SegmentedSlider
      value={value}
      options={OPTIONS}
      onChange={onChange}
      ariaLabel="Режим отображения"
      size="md"
    />
  );
}
