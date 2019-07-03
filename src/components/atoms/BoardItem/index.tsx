import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../logics/util/dayjs";
import { Notify } from "../../../types";
import { UserIcon } from "../../organisms/UserIcon";
import { Icon, IconKinds } from "../Icon";
import styles from "./BoardItem.module.scss";

interface BoardItemProps extends React.Props<{}> {
  icon?: IconKinds;
  label: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const BoardItem: React.FC<BoardItemProps> = ({
  icon,
  label,
  className,
  onClick
}) => (
  <li className={`${styles.list_item} ${className}`} onClick={onClick}>
    {icon ? <Icon icon={icon} size={48} /> : null}
    <span className={styles.item_label}>{label}</span>
  </li>
);

interface BoardLinkItemProps extends React.Props<{}> {
  icon?: IconKinds;
  path: string;
  label: string;
}

export const BoardLinkItem: React.FC<BoardLinkItemProps> = ({
  icon,
  path,
  label
}) => (
  <li>
    <Link className={styles.list_item} to={path}>
      {icon ? <Icon icon={icon} size={48} /> : null}
      <span className={styles.item_label}>{label}</span>
    </Link>
  </li>
);

interface NotifyBoardItemProps extends React.Props<{}> {
  notify: Notify;
}

export const NotifyBoardItem: React.FC<NotifyBoardItemProps> = ({ notify }) => (
  <li className={`${styles.list_item} ${notify.read ? styles.read : ""}`}>
    <div className={styles.from_user}>
      <UserIcon uid={notify.from} path={`/user/${notify.from}`} />
    </div>

    <div>
      <span className={styles.date}>{formatDate(notify.created_at)}</span>

      {notify.link ? (
        <Link to={notify.link} className={styles.no_link_style}>
          <p>{notify.message}</p>
        </Link>
      ) : (
        <p>{notify.message}</p>
      )}
    </div>
  </li>
);
