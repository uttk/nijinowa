import React from "react";
import { Link } from "react-router-dom";
import styles from "./SimplePopup.module.scss";

interface SimplePopupProps extends React.Props<{}> {
  show: boolean;
  className?: string;
}

export const SimplePopup: React.FC<SimplePopupProps> = ({
  show,
  className,
  children
}) =>
  show ? (
    <div className={`${styles.simple_popup} ${className || ""}`}>
      {children}
    </div>
  ) : null;

interface PopupItemProps extends React.Props<{}> {
  label: string;
  path?: string;
  onClick?: ((e: React.MouseEvent) => void) | (() => void);
}

export const PopupItem: React.FC<PopupItemProps> = ({ label, path, onClick }) =>
  path ? (
    <Link
      className={`${styles.popup_item} ${styles.popup_link}`}
      to={path}
      onClick={onClick}
    >
      {label}
    </Link>
  ) : (
    <div className={styles.popup_item} onClick={onClick}>
      {label}
    </div>
  );
