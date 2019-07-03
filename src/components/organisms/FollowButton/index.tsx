import React from "react";
import { useUsers } from "../../../logics/util/uses/users";
import { useUtil } from "../../../logics/util/uses/util";
import { User } from "../../../types";
import { Button } from "../../atoms/Button";

interface FollowButtonProps extends React.Props<{}> {
  uid: User["id"];
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = React.memo(
  ({ uid, className }) => {
    const { alerts } = useUtil();
    const { isFollowee, current_user, followUser, unfollowUser } = useUsers();
    const isFollowed = isFollowee(uid);
    const currentUserId = current_user ? current_user.id : "";
    const onClick = () => {
      if (uid && currentUserId && currentUserId !== uid) {
        if (isFollowed) {
          unfollowUser(uid);
        } else {
          followUser(uid);
        }
      } else if (currentUserId) {
        alerts.follow_user.warn();
      } else {
        alerts.required_login.warn();
      }
    };

    return (
      <Button
        disabled={!uid}
        className={className}
        color={isFollowed ? "red" : "blue"}
        size="small"
        onClick={onClick}
      >
        {isFollowed ? "フォローを解除" : "フォローする"}
      </Button>
    );
  }
);
