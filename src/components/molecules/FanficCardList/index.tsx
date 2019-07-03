import React from "react";
import { Fanfic } from "../../../types";
import { FanficCard } from "../FanficCard";
import styles from "./FanficCardList.module.scss";

interface FanficCardListProps extends React.Props<{}> {
  fanfics: Fanfic[] | null;
}

export const FanficCardList: React.FC<FanficCardListProps> = React.memo(
  ({ fanfics }) => {
    if (!fanfics) {
      return null;
    }

    return (
      <div className={styles.list_body}>
        {fanfics.length ? (
          <div className={styles.list_wrap}>
            {fanfics.map(fanfic => (
              <FanficCard
                key={`fanfic-list-item-${fanfic.id}`}
                fanfic={fanfic}
                showUserIcon={false}
              />
            ))}
          </div>
        ) : (
          <h3 className={styles.list_label}>まだ、作品が投稿されていません</h3>
        )}
      </div>
    );
  }
);
