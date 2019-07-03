import React, { useEffect } from "react";
import useReactRouter from "use-react-router";
import { useAuth } from "../../../logics/util/uses/auth";
import { useUtil } from "../../../logics/util/uses/util";
import { Board } from "../../atoms/Board";
import { BoardItem, BoardLinkItem } from "../../atoms/BoardItem";
import { PageTemplate } from "../PageTemplate";
import styles from "./DashboardTemplate.module.scss";

interface DashboardTemplte extends React.Props<{}> {
  title?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplte> = ({
  title,
  children
}) => {
  const { history } = useReactRouter();
  const { isLogin, isCheked, loginCheck, logout } = useAuth();
  const { alerts } = useUtil();

  useEffect(() => {
    if (!isCheked) {
      loginCheck();
    } else if (!isLogin) {
      alerts.required_login.error();
      history.replace("/");
    }
  }, [isLogin, isCheked, history]);

  return isLogin ? (
    <PageTemplate title={title}>
      <div className={styles.dashboard}>
        <div className={styles.contents}>{children}</div>

        <div className={styles.side_menu}>
          <Board headerLabel="ユーザーメニュー">
            <BoardLinkItem label="ダッシュボード" path="/dashboard" />
            <BoardLinkItem label="投稿作品一覧" path="/dashboard/fanfics" />
            <BoardLinkItem
              label="プロフィール編集"
              path="/dashboard/user-edit"
            />
            <BoardItem label="ログアウト" onClick={logout} />
          </Board>
        </div>
      </div>
    </PageTemplate>
  ) : (
    <PageTemplate />
  );
};
