import React from "react";
import styles from "./Typography.module.scss";

interface TypographyProps extends React.Props<{}> {
  text?: string;
  isLoad?: boolean;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  text,
  isLoad,
  variant,
  className
}) => {
  const style = isLoad === true && !text ? styles.typography_none_text : "";
  const copy = text || "";
  const names = `${style} ${styles.typography} ${className || ""}`;

  switch (variant) {
    case "h1":
      return <h1 className={names}>{copy}</h1>;

    case "h2":
      return <h2 className={names}>{copy}</h2>;

    case "h3":
      return <h3 className={names}>{copy}</h3>;

    case "h4":
      return <h4 className={names}>{copy}</h4>;

    case "h5":
      return <h5 className={names}>{copy}</h5>;

    case "h6":
      return <h6 className={names}>{copy}</h6>;

    case "span":
      return <span className={names}>{copy}</span>;

    default:
      return <p className={names}>{copy}</p>;
  }
};
