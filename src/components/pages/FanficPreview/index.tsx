import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { IconButton } from "../../atoms/Button";
import { Tooltip } from "../../atoms/Tooltip";
import { Typography } from "../../atoms/Typography";
import { FanficContentsCarousel } from "../../organisms/FanficContentsCarousel";
import { FanficParentCard } from "../../organisms/FanficParentCard";
import { LikeButton } from "../../organisms/LikeButton";
import { ReplyButton } from "../../organisms/ReplyButton";
import { UserIcon } from "../../organisms/UserIcon";
import { PageTemplate } from "../../templates/PageTemplate";
import styles from "./FanficPreview.module.scss";
import { useFanficPreview } from "./use";

export const FanficPreview: React.FC<RouteComponentProps> = () => {
  const { fanfic, isLoading, createDate, isMyFanfic } = useFanficPreview();

  return (
    <PageTemplate background="#fdfdfd">
      <div className={styles.fanfic_preview}>
        <div className={styles.body}>
          <div className={styles.header}>
            <div className={styles.title}>
              <Typography text={fanfic.title} variant="h2" isLoad={isLoading} />
            </div>
          </div>

          <div className={styles.description}>
            <Typography
              text={fanfic.description}
              variant="p"
              isLoad={isLoading}
            />
          </div>

          <div className={styles.infomation}>
            <div className={styles.info_item}>
              <UserIcon
                uid={fanfic.author_id}
                path={`/user/${fanfic.author_id}`}
              />
            </div>

            <div className={styles.info_item}>
              <span className={styles.info_label}>作品ID</span>
              <Typography
                text={fanfic.id}
                variant="p"
                className={styles.info_text}
              />
            </div>

            <div className={styles.info_item}>
              <span className={styles.info_label}>投稿時間</span>
              <Typography
                text={createDate}
                variant="p"
                className={styles.info_text}
              />
            </div>
          </div>
        </div>

        <div className={styles.fanfic_contents}>
          <FanficContentsCarousel fanficId={fanfic.id} />
        </div>

        {fanfic.parents.length === 0 ? null : (
          <div>
            <h3>親作品</h3>
            <div className={styles.fanfic_parents}>
              {fanfic.parents.map(id => (
                <FanficParentCard key={`fanfic-parents-${id}`} id={id} />
              ))}
            </div>
          </div>
        )}

        {isMyFanfic(fanfic) ? (
          <Link to={`/fanfic/${fanfic.id}/edit`}>
            <IconButton className={styles.edit_button} size={32} icon="edit">
              <Tooltip label="編集画面へ移動する" />
            </IconButton>
          </Link>
        ) : null}
      </div>

      <div className={styles.side_bar}>
        <ReplyButton fanfic={fanfic}>
          <Tooltip label="二次創作を作成する" />
        </ReplyButton>

        <LikeButton fanfic={fanfic} likes={fanfic.likes || 0}>
          <Tooltip label="作品にいいね！する" />
        </LikeButton>
      </div>
    </PageTemplate>
  );
};
