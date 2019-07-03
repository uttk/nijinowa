import React from "react";
import styles from "./ModalPopup.module.scss";

interface ModalPopupProps extends React.Props<{}> {
  show: boolean;
  width?: number;
  height?: number;
  onClose?: ((state: false) => void) | (() => void);
}

export const ModalPopup: React.FC<ModalPopupProps> = ({
  show,
  width = 300,
  height,
  children,
  onClose
}) => {
  const close = () => onClose && onClose(false);

  return show ? (
    <>
      <div className={styles.background} onClick={close} />
      <div className={styles.popup_show} style={{ width, height }}>
        <div className={styles.body}>{children}</div>
      </div>
    </>
  ) : (
    <></>
  );
};
