import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../../../logics/util/uses/users";
import { useUtil } from "../../../logics/util/uses/util";
import { IconButton } from "../../atoms/Button";
import { LoadingBar } from "../../atoms/LoadingBar";
import { Tooltip } from "../../atoms/Tooltip";
import { UserIcon } from "../../organisms/UserIcon";
import styles from "./GlobalHeader.module.scss";

interface GlobalHeaderProps extends React.Props<{}> {}

export const GlobalHeader: React.FC<GlobalHeaderProps> = React.memo(() => {
  const { listenRequest } = useUtil();
  const { current_user } = useUsers();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    return listenRequest((request, status) => {
      setLoading(status === "start");
    });
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.no_link_style}>
          <h3 className={styles.title}>NIJINOWA</h3>
        </Link>

        <nav className={styles.navi}>
          <li className={styles.navi_item}>
            <Link to={"/trends"}>
              <IconButton icon="trend_yellow" color="transparent" size={28}>
                <Tooltip label="トレンドへ移動" position="bottom" />
              </IconButton>
            </Link>
          </li>

          <li className={styles.navi_item}>
            {current_user ? (
              <UserIcon path="/dashboard" iconPath={current_user.icon}>
                <Tooltip label="ダッシュボードへ移動" position="bottom" />
              </UserIcon>
            ) : null}
          </li>
        </nav>
      </div>
      <LoadingBar isLoading={isLoading} />
    </header>
  );
});
