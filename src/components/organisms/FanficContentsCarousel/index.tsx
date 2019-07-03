import React, { useEffect, useState } from "react";
import { useFanficContents } from "../../../logics/util/uses/fanfic_contents";
import { Fanfic } from "../../../types";
import { FanficCarouselElement } from "../../molecules/FanficCarouselElement";
import styles from "./FanficContentsCarousel.module.scss";

interface FanficContentsCarouselProps extends React.Props<{}> {
  fanficId: Fanfic["id"];
}

export const FanficContentsCarousel: React.FC<
  FanficContentsCarouselProps
> = React.memo(({ fanficId }) => {
  const { contents: state, getFanficContents } = useFanficContents();
  const [selected, setIndex] = useState(0);
  const contents = state[fanficId] || [];

  const moveCarousel = (index: number) => {
    return () => {
      if (contents) {
        if (index >= 0 && index < contents.length) {
          setIndex(index);
        }
      }
    };
  };

  useEffect(() => {
    if (fanficId) {
      getFanficContents(fanficId).then(() => {
        if (selected > 0) {
          setIndex(0);
        }
      });
    }
  }, [fanficId]);

  return (
    <div className={styles.fanfic_carousel}>
      <div
        className={`${styles.carousel_left_button}`}
        onClick={moveCarousel(selected - 1)}
      />

      <div className={styles.carolsel_body}>
        <div className={selected === 0 ? styles.carousel_margin : ""} />
        {contents
          .map((con, i) => (
            <FanficCarouselElement
              key={`fanfic-contents-carolsel-${con.id}`}
              contents={con}
              showType={i - selected}
            />
          ))
          .concat(
            <div
              key={`fanfic-contents-right-margin`}
              className={
                contents.length === selected + 1 ? styles.carousel_margin : ""
              }
            />
          )}
      </div>

      <div
        className={styles.carousel_right_button}
        onClick={moveCarousel(selected + 1)}
      />
    </div>
  );
});
