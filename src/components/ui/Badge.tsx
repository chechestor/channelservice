import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeTone =
  | "emergency"
  | "planned"
  | "warning"
  | "progress"
  | "success"
  | "danger"
  | "neutral"
  | "sla";

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}
