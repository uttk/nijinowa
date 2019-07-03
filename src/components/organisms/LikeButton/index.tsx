import React, { useEffect, useState } from "react";
import { useFanficLike } from "../../../logics/util/uses/fanfic_like";
import { Fanfic } from "../../../types";
import { IconButton } from "../../atoms/Button";
import styles from "./LikeButton.module.scss";

interface LikeButton extends React.Props<{}> {
  fanfic: Fanfic;
  likes: number;
}

export const LikeButton: React.FC<LikeButton> = React.memo(
  ({ fanfic, likes, children }) => {
    const fanficId = fanfic.id;
    const { isLiked, fanficLike, fanficDislike } = useFanficLike();
    const [likeNum, setLikeNum] = useState(0);
    const [liked, setLiked] = useState(false);
    const onClick = () => {
      if (!fanficId) {
        return;
      }

      if (liked) {
        fanficDislike(fanfic).then(result => {
          if (result) {
            setLiked(false);
            setLikeNum(Math.max(likeNum - 1, 0));
          }
        });
      } else {
        fanficLike(fanfic).then(result => {
          if (result) {
            setLiked(true);
            setLikeNum(likeNum + 1);
          }
        });
      }
    };

    useEffect(() => {
      if (fanficId) {
        isLiked(fanficId).then(setLiked);
      }
    }, [fanficId]);

    useEffect(() => {
      if (typeof likes === "number") {
        setLikeNum(likes);
      }
    }, [likes]);

    return (
      <div className={styles.button_wrapper}>
        <IconButton
          size={32}
          icon={liked ? "like_white" : "like"}
          className={liked ? styles.button_color : ""}
          color="transparent"
          onClick={onClick}
        >
          {children}
        </IconButton>
        <span className={styles.button_label}>{likeNum}</span>
      </div>
    );
  }
);
