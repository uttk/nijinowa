import React from "react";
import { RouteComponentProps } from "react-router";
import { Icon } from "../../atoms/Icon";
import { FanficTrendCard } from "../../organisms/FanficTrendCard";
import { PageTemplate } from "../../templates/PageTemplate";
import styles from "./FanficTrends.module.scss";
import { useFanficTrends } from "./use";

export const FanficTrends: React.FC<RouteComponentProps> = () => {
  const { trends, loading } = useFanficTrends();

  return (
    <PageTemplate>
      <div className={styles.trends}>
        <div className={styles.trends_body}>
          {trends.map(fanfic => (
            <FanficTrendCard key={`trend-item-${fanfic.id}`} fanfic={fanfic} />
          ))}

          <div className={styles.loading_wrapper}>
            {loading ? (
              <Icon size={64} icon="loading" className={styles.loading} />
            ) : null}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};
