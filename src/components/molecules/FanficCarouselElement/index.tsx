import React from "react";
import { FanficContentsType } from "../../../types";
import styles from "./FanficCarouselElement.module.scss";

const getCarouselClass = (showType: -1 | 0 | 1 | number): string => {
  switch (showType) {
    case -1:
      return styles.carousel_left;

    case 0:
      return styles.carousel_selected;

    case 1:
      return styles.carousel_right;

    default:
      return styles.carousel_hidden;
  }
};

interface FanficCarouselElementProps extends React.Props<{}> {
  contents: FanficContentsType;
  showType: -1 | 0 | 1 | number;
}
export const FanficCarouselElement: React.FC<FanficCarouselElementProps> = ({
  contents,
  showType
}) => {
  return (
    <div className={getCarouselClass(showType)}>
      <img className={styles.image_fanfic} src={contents.path} />
    </div>
  );
};
