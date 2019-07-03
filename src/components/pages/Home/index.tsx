import React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "../../atoms/Button";
import { Icon } from "../../atoms/Icon";
import { PageTemplate } from "../../templates/PageTemplate";
import styles from "./Home.module.scss";
import { useHome } from "./use";

export const Home: React.FC<RouteComponentProps> = () => {
  const { isLogin, isCheked, login, goToTrend } = useHome();

  return (
    <PageTemplate className={styles.page}>
      <div className={styles.home}>
        <div className={styles.title}>
          <div className={styles.wrapper}>
            <h1 className={styles.title_label}>NIJINOWA</h1>

            <div className={styles.wrapper}>
              <p>
                <big>NIJINOWA</big> は二次創作を投稿できるサービスです
              </p>
            </div>

            <div className={styles.container}>
              <div className={styles.wrapper}>
                <Button color="blue" onClick={goToTrend}>
                  トレンドを見る
                </Button>
              </div>

              <div className={styles.wrapper}>
                <Button disabled={!isCheked} onClick={login}>
                  {isLogin
                    ? "ダッシュボードに移動"
                    : "Googleアカウントでログイン"}
                </Button>
              </div>

              <div className={styles.wrapper}>
                <a
                  href="https://twitter.com/uttk8128"
                  target="_blank"
                  className={styles.twitter_btn}
                >
                  <Icon icon="twitter_white" size={32} />
                  製作者のTwitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};
