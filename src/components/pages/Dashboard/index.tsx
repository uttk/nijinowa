import React from "react";
import { RouteComponentProps } from "react-router";
import { Board } from "../../atoms/Board";
import { BoardItem, NotifyBoardItem } from "../../atoms/BoardItem";
import { DashboardTemplate } from "../../templates/DashboardTemplate";
import styles from "./Dashboard.module.scss";
import { useDashboard } from "./use";

export const Dashboard: React.FC<RouteComponentProps> = () => {
  const { notifies, finished, getNotifies } = useDashboard();

  return (
    <DashboardTemplate>
      <main className={styles.dashboard}>
        <Board headerLabel="通知一覧" minWidth={500}>
          {notifies.map(notify => (
            <NotifyBoardItem key={`notify-item-${notify.id}`} notify={notify} />
          ))}

          {finished ? null : (
            <BoardItem
              className={styles.link}
              label="さらに10件の通知を表示"
              onClick={getNotifies}
            />
          )}
        </Board>
      </main>
    </DashboardTemplate>
  );
};
