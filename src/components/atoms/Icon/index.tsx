import React from "react";
import close from "../../../assets/icons/close.png";
import close_white from "../../../assets/icons/close_white.png";
import cross from "../../../assets/icons/cross.png";
import dot from "../../../assets/icons/dot.png";
import edit from "../../../assets/icons/edit.png";
import edit_black from "../../../assets/icons/edit_black.png";
import like from "../../../assets/icons/like.png";
import like_white from "../../../assets/icons/like_white.png";
import loading from "../../../assets/icons/loading.png";
import reply from "../../../assets/icons/reply.png";
import star from "../../../assets/icons/star.png";
import trend from "../../../assets/icons/trend.png";
import trend_yellow from "../../../assets/icons/trend_yellow.png";
import twitter from "../../../assets/icons/twitter.png";
import twitter_white from "../../../assets/icons/twitter_white.png";
import update from "../../../assets/icons/update.png";

const icons = {
  dot,
  like,
  star,
  edit,
  close,
  cross,
  reply,
  trend,
  update,
  loading,
  twitter,
  edit_black,
  like_white,
  close_white,
  trend_yellow,
  twitter_white
};

export type IconKinds = keyof typeof icons;

interface IconProps extends React.Props<{}> {
  size?: number;
  icon: IconKinds;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ icon, size, className }) => (
  <img
    className={className}
    src={icons[icon]}
    alt="icon"
    width={size}
    height={size}
  />
);
