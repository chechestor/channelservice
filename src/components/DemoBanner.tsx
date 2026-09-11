import type { DemoScenario } from "../types";
import styles from "./DemoBanner.module.css";

interface DemoBannerProps {
  scenario: DemoScenario;
  onReset: () => void;
}

const MESSAGES: Record<Exclude<DemoScenario, "none">, string> = {
  conflict:
    "Режим конфликта: откройте заявку №10428, подберите бригаду и подтвердите назначение.",
  no_crews:
    "Режим «нет свободных бригад»: откройте неназначенную заявку и запустите автоподбор.",
};

export function DemoBanner({ scenario, onReset }: DemoBannerProps) {
  if (scenario === "none") {
    return null;
  }

  return (
    <div className={styles.banner} role="status">
      <span>{MESSAGES[scenario]}</span>
      <button type="button" onClick={onReset}>
        Сбросить демо
      </button>
    </div>
  );
}
