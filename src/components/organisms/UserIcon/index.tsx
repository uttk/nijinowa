import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dummy from "../../../assets/icons/user_dummy.png";
import { useUsers } from "../../../logics/util/uses/users";
import { User } from "../../../types";
import styles from "./UserIcon.module.scss";

type UserIconProps =
  | {
      uid: User["id"];
      iconPath?: never;
      path?: string;
      size?: number;
      onClick?: (e: React.MouseEvent) => void;
    }
  | {
      uid?: never;
      iconPath: string;
      path?: string;
      size?: number;
      onClick?: (e: React.MouseEvent) => void;
    };

export const UserIcon: React.FC<UserIconProps> = React.memo(
  ({ uid, iconPath, path, size, children, onClick }) => {
    const [icon, setIcon] = useState("");
    const { getUser } = useUsers();
    const click = (e: React.MouseEvent) => {
      e.stopPropagation();

      if (onClick) {
        onClick(e);
      }
    };

    useEffect(() => {
      if (uid && !icon) {
        getUser(uid).then(user => {
          if (user) {
            setIcon(user.icon);
          }
        });
      }
    }, [uid]);

    return path ? (
      <Link to={path} onClick={click}>
        <div className={styles.img_wrapper}>
          <img
            className={styles.user_icon}
            src={iconPath || icon || dummy}
            alt="user icon"
            style={{
              width: size,
              height: size
            }}
          />
          {children}
        </div>
      </Link>
    ) : (
      <div className={styles.img_wrapper}>
        <img
          className={styles.user_icon}
          src={iconPath || icon || dummy}
          alt="user icon"
          style={{
            width: size,
            height: size
          }}
        />
        {children}
      </div>
    );
  }
);
