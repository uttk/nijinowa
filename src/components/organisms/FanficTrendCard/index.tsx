import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { defaultUser, useUsers } from "../../../logics/util/uses/users";
import { useUtil } from "../../../logics/util/uses/util";
import { Fanfic } from "../../../types";
import { Icon } from "../../atoms/Icon";
import { ThumbnailImage } from "../../organisms/ThumbnailImage";
import { UserIcon } from "../UserIcon";
import styles from "./FanficTrendCard.module.scss";

export const FanficTrendCard: React.FC<{ fanfic: Fanfic }> = React.memo(
  ({ fanfic }) => {
    const { cancelRequest } = useUtil();
    const { getUser } = useUsers();
    const [author, setAuthor] = useState(defaultUser);

    useEffect(() => {
      if (fanfic.author_id) {
        getUser(fanfic.author_id).then(result => {
          if (result) {
            setAuthor(result);
          }
        });

        return () => {
          cancelRequest(`get-user-${fanfic.author_id}`);
        };
      }
    }, [fanfic.author_id]);

    return (
      <div className={styles.article}>
        <Link className={styles.trend_card} to={`/fanfic/${fanfic.id}`}>
          <div className={styles.thumbnail}>
            <ThumbnailImage src={fanfic.thumbnail} />
          </div>

          <div className={styles.card_body}>
            <h3 className={styles.title}>
              {fanfic.title.replace(/(.{65}).+/, "$1...")}
            </h3>

            <div className={styles.card_status}>
              <div className={styles.status_icon_wrapper}>
                <Icon icon="like" size={32} />
                <span className={styles.icon_label}>{fanfic.likes}</span>
              </div>
            </div>
          </div>
        </Link>

        <div className={styles.author_field}>
          <div className={styles.author_icon}>
            <UserIcon
              iconPath={author.icon}
              path={`/user/${author.id || "non_user"}`}
            />
          </div>

          <Link className={styles.non_link_text} to={`/user/${author.id}`}>
            <h3 className={styles.author_name}>{author.name}</h3>
          </Link>
        </div>
      </div>
    );
  }
);
