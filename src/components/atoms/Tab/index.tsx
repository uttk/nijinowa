import React from "react";
import styles from "./Tab.module.scss";

type TabColor = "red" | "blue" | "white" | "transparent";

interface TabProps extends React.Props<{}> {
  color?: TabColor;
  label: string;
  selected: boolean;
  onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
}

const getClassName = (selected: boolean, color: TabColor) => {
  if (selected) {
    return `${styles.tab} ${styles.selected} ${styles[color]}`;
  } else {
    return `${styles.tab} ${styles[color]}`;
  }
};

export const Tab: React.FC<TabProps> = ({
  color = "white",
  label,
  selected,
  onClick
}) => (
  <button className={getClassName(selected, color)} onClick={onClick}>
    <h3>{label}</h3>
  </button>
);

interface TabBarProps extends React.Props<{}> {
  className?: string;
}

export const TabWrapper: React.FC<{ className?: string }> = ({
  className,
  children
}) => (
  <div className={`${styles.tab_wrapper} ${className || ""}`}>{children}</div>
);

export const TabBar: React.FC<TabBarProps> = ({ className, children }) => (
  <div className={`${styles.tab_bar} ${className || ""}`}>{children}</div>
);
