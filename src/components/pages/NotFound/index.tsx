import React from "react";
import { RouteComponentProps } from "react-router";
import { PageTemplate } from "../../templates/PageTemplate";
import styles from "./NotFound.module.scss";

export const NotFound: React.FC<RouteComponentProps> = () => {
  return (
    <PageTemplate>
      <div className={styles.not_found}>
        <h1>お探しのページは見つかりませんでした</h1>
      </div>
    </PageTemplate>
  );
};
