import React from "react";
import styles from "./Board.module.scss";

interface BoardProps extends React.Props<{}> {
  headerLabel: string;
  minWidth?: number;
}

export const Board: React.FC<BoardProps> = ({
  children,
  headerLabel,
  minWidth = 300
}) => (
  <div className={styles.board} style={{ minWidth }}>
    <div className={styles.header}>
      <h3>{headerLabel}</h3>
    </div>

    <ul className={styles.list_body}>{children}</ul>
  </div>
);
