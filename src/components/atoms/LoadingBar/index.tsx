import React from "react";
import styles from "./LoadingBar.module.scss";

export const LoadingBar: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return isLoading ? <div className={styles.loading_bar} /> : null;
};
