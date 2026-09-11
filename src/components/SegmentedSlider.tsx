import type { KeyboardEvent } from "react";
import styles from "./SegmentedSlider.module.css";

interface SegmentedSliderProps<T extends string> {
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}

export function SegmentedSlider<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  size = "md",
}: SegmentedSliderProps<T>) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? Math.min(index + 1, options.length - 1)
        : Math.max(index - 1, 0);
    onChange(options[next].id);
  };

  return (
    <div
      className={`${styles.slider} ${size === "sm" ? styles.sm : styles.md}`}
      data-index={index}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {options.map((option) => {
        const checked = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={checked ? styles.checked : undefined}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
