import React from "react";
import { Fanfic, FanficContentsType } from "../../../types";
import { IconButton } from "../../atoms/Button";
import { Icon } from "../../atoms/Icon";
import { PopupItem, SimplePopup } from "../../atoms/SimplePopup";
import {
  ToggleWrapper,
  ToggleWrapperChildProps
} from "../../organisms/ToggleWrapper";
import styles from "./FanficContentsEditableCard.module.scss";

interface FanficContentsEditableCardProps extends React.Props<{}> {
  isThumbnail: boolean;
  contents: FanficContentsType;
  itemProps: (id: string) => object;
  onDeleteContents: (contentsId: string) => void;
  onThumbnailUpdate: (thumbnail: Fanfic["thumbnail"]) => void;
}

const setWindowEvent = ({ falseFlag }: ToggleWrapperChildProps) => {
  window.addEventListener("click", falseFlag);
  return () => window.removeEventListener("click", falseFlag);
};

export const FanficContentsEditableCard: React.FC<
  FanficContentsEditableCardProps
> = ({
  contents,
  isThumbnail,
  itemProps,
  onDeleteContents,
  onThumbnailUpdate
}) => {
  const deleteContents = () => onDeleteContents(contents.id);
  const thumbnailUpdate = () => onThumbnailUpdate(contents.path);

  return (
    <ToggleWrapper onceDidMount={setWindowEvent}>
      {({ flag, trueFlag }) => (
        <div className={styles.card_body}>
          <SimplePopup show={flag} className={styles.popup}>
            <PopupItem label="サブネイルに設定" onClick={thumbnailUpdate} />
            <PopupItem label="削除" onClick={deleteContents} />
          </SimplePopup>

          <div className={styles.img_card_header}>
            <IconButton
              color="transparent"
              size={16}
              icon="dot"
              onClick={trueFlag}
            />
          </div>

          <div className={styles.card_shadow}>
            <div className={`${styles.image_card}`} {...itemProps(contents.id)}>
              {isThumbnail ? (
                <Icon className={styles.thumbnail_icon} size={32} icon="star" />
              ) : null}

              <img src={contents.path} draggable={false} alt="image card" />
            </div>
          </div>
        </div>
      )}
    </ToggleWrapper>
  );
};
