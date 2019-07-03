import React from "react";
import { Icon, IconKinds } from "../Icon";
import styles from "./Button.module.scss";

interface ButtonProps extends React.Props<{}> {
  type?: "submit";
  size?: "small" | "medium" | "large";
  color?: "red" | "blue" | "yello";
  width?: number | "auto";
  height?: number | "auto";
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  type,
  size = "medium",
  color = "red",
  children,
  disabled,
  className,
  onClick
}) => (
  <button
    disabled={disabled}
    className={`${styles.btn_base} ${styles[color]} ${
      styles[size]
    } ${className || ""}`}
    type={type}
    onClick={onClick}
  >
    {children}
  </button>
);

interface IconProps extends React.Props<{}> {
  size: number;
  icon: IconKinds;
  color?: "red" | "blue" | "yello" | "white" | "transparent";
  border?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const IconButton: React.FC<IconProps> = ({
  size,
  icon,
  color = "red",
  border = "none",
  children,
  className,
  onClick
}) => (
  <div
    className={`${styles.icon_btn} ${styles[color]} ${className || ""}`}
    style={{ padding: size / 2, width: size, height: size, border }}
    onClick={onClick}
  >
    <Icon className={styles.icon} icon={icon} size={size} />
    {children}
  </div>
);
