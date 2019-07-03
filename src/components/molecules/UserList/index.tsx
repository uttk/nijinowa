import React from "react";
import { User } from "../../../types";
import { FollowButton } from "../../organisms/FollowButton";
import { UserIcon } from "../../organisms/UserIcon";
import styles from "./UserList.module.scss";

type UserListItem = Pick<User, "id" | "icon" | "bio" | "name">;

interface UserListProps extends React.Props<{}> {
  users: { [uid: string]: UserListItem } | null;
  defaultLabel: string;
}

export const UserList: React.FC<UserListProps> = React.memo(
  ({ users, defaultLabel }) => {
    if (!users) {
      return null;
    }

    const userList: UserListItem[] = [];

    for (const key in users) {
      if (key) {
        userList.push(users[key]);
      }
    }

    return (
      <div className={styles.list_body}>
        {userList.length ? (
          userList.map(user => (
            <div key={`user-list-${user.id}`} className={styles.list_item}>
              <div className={styles.container}>
                <UserIcon
                  size={80}
                  iconPath={user.icon}
                  path={`/user/${user.id}`}
                />
                <span className={styles.user_name}>{user.name}</span>
              </div>

              <div className={styles.container}>
                <FollowButton uid={user.id} className={styles.button} />

                <div className={styles.bio}>
                  <p>{user.bio}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3 className={styles.list_label}>{defaultLabel}</h3>
        )}
      </div>
    );
  }
);
