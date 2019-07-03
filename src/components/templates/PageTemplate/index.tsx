import React, { useEffect } from "react";
import useReactRouter from "use-react-router";
import { GlobalHeader } from "../../organisms/GlobalHeader";
import styles from "./PageTemplate.module.scss";

interface PageTemplateProps extends React.Props<{}> {
  title?: string;
  background?: string;
  className?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  className,
  background
}) => {
  const { location } = useReactRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={styles.page} style={{ background }}>
      <GlobalHeader />

      <div className={`${styles.body} ${className || ""}`}>{children}</div>

      <div className={styles.footer}>
        <p>©︎ 2019 uttk</p>
      </div>
    </div>
  );
};
