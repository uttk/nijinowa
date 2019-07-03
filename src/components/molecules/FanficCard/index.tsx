import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../logics/util/dayjs";
import { Fanfic } from "../../../types";
import { IconButton } from "../../atoms/Button";
import { ThumbnailImage } from "../../organisms/ThumbnailImage";
import { UserIcon } from "../../organisms/UserIcon";
import styles from "./FanficCard.module.scss";

interface FanficCardProps extends React.Props<{}> {
  fanfic: Fanfic;
  showUserIcon?: boolean;
  onClick?: (fanfic: Fanfic) => void;
  onMenuClick?: ((e: React.MouseEvent) => void) | (() => void);
}

export const FanficCard: React.FC<FanficCardProps> = ({
  fanfic,
  showUserIcon,
  onClick,
  onMenuClick
}) => {
  const selectCard = onClick ? () => onClick(fanfic) : undefined;
  const date = formatDate(fanfic.updated_at);

  return (
    <div className={styles.fanfic_card}>
      {onMenuClick ? (
        <div className={styles.card_header}>
          <IconButton
            color="transparent"
            size={16}
            icon="dot"
            onClick={onMenuClick}
          />
        </div>
      ) : null}

      <Link
        className={styles.no_link_style}
        to={`/fanfic/${fanfic.id}`}
        onClick={selectCard}
      >
        <div className={styles.thumbnail}>
          <ThumbnailImage src={fanfic.thumbnail} />
        </div>

        <div className={styles.card_body}>
          <div className={styles.header}>
            <span className={styles.date}>{date ? `${date}に更新` : ""}</span>
          </div>

          <div className={styles.title}>
            {fanfic.title.replace(/(.{35}).+/, "$1...")}
          </div>
        </div>
      </Link>

      {showUserIcon === false ? null : (
        <div className={styles.user_icon}>
          {
            <UserIcon
              uid={fanfic.author_id}
              path={`/user/${fanfic.author_id}`}
            />
          }
        </div>
      )}
    </div>
  );
};
