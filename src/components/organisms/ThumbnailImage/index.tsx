import React, { useEffect, useState } from "react";
import styles from "./ThumbnailImage.module.scss";

interface ThumbnailImageProps extends React.Props<{}> {
  src: string;
  defaultHieght?: number;
  className?: string;
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = React.memo(
  ({ src, className }) => {
    const [thumbnail, setThumbnail] = useState<string>("");

    useEffect(() => {
      if (src) {
        const img = new Image();

        const loadSrc = () => {
          setThumbnail(src);
        };

        img.addEventListener("load", loadSrc);

        img.src = src;

        return () => {
          img.removeEventListener("load", loadSrc);
        };
      }
    }, [src]);

    return thumbnail ? (
      <img src={thumbnail} className={`${styles.thumbnail_img} ${className}`} />
    ) : (
      <div className={styles.no_image_wrapper}>
        <div className={styles.no_image}>
          <p>No Image</p>
        </div>
      </div>
    );
  }
);
