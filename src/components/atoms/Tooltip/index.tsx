import React from "react";
import styles from "./Tooltip.module.scss";

interface TooltipProps extends React.Props<{}> {
  label: string;
  position?: "top" | "bottom" | "left" | "right";
  maxWidth?: number;
  minWidth?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  position = "top",
  maxWidth,
  minWidth,
  className
}) => (
  <div className={styles.tooltip_body}>
    <div
      style={{ maxWidth, minWidth }}
      className={`${styles.tooltip} ${className || ""} ${styles[position]}`}
    >
      <p className={styles.tooltip_label}>{label}</p>
    </div>
  </div>
);
