import { useId } from "react";
import styles from "./DispatcherAvatar.module.css";

export function DispatcherAvatar() {
  const clipId = `avatar-clip-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className={styles.avatar}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="32" cy="32" r="32" fill="#d9e8f7" />
        <path d="M8 58c6-12 14-16 24-16s18 4 24 16" fill="#1e4f8f" />
        <path d="M26 44h12l3 16H23z" fill="#f0c49a" />
        <circle cx="15" cy="32" r="4.2" fill="#f3c49a" />
        <circle cx="49" cy="32" r="4.2" fill="#f3c49a" />
        <ellipse cx="32" cy="30" rx="16.5" ry="18" fill="#f6cba3" />
        <path
          d="M16.5 30c.5-13 10-18.5 15.5-18.5 3.2 0 6.2 1.2 8.4 3.2 1.8 1.6 4.6 2 6.6.4 1.4 3.2 1.7 7.2 1.5 11.2-2.4-3.4-6.8-5.6-16.5-5.2-6.2.3-11.2 3.2-15.5 9z"
          fill="#4a2e1c"
        />
        <ellipse cx="23.5" cy="31.5" rx="3.1" ry="3.6" fill="#fff" />
        <ellipse cx="40.5" cy="31.5" rx="3.1" ry="3.6" fill="#fff" />
        <circle cx="24" cy="32" r="1.85" fill="#2b2118" />
        <circle cx="41" cy="32" r="1.85" fill="#2b2118" />
        <circle cx="23.3" cy="31.1" r="0.7" fill="#fff" />
        <circle cx="40.3" cy="31.1" r="0.7" fill="#fff" />
        <path
          d="M20.5 27.2c1.6-1.2 3.8-1.3 5.4-.2"
          fill="none"
          stroke="#3a2718"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M38.2 27c1.6-1.1 3.8-1.2 5.3 0"
          fill="none"
          stroke="#3a2718"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <ellipse cx="22" cy="37.2" rx="3.2" ry="1.7" fill="#f0a08a" opacity="0.55" />
        <ellipse cx="42" cy="37.2" rx="3.2" ry="1.7" fill="#f0a08a" opacity="0.55" />
        <path
          d="M27 40.2c1.6 2.4 8.4 2.4 10 0"
          fill="none"
          stroke="#c56b52"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
