import { useContext } from "react";
import { AppContext } from "../../../index";
import { FolloweeList, User } from "../../../types";
import { getFolloweeList, getFollowerList, getUser } from "../../actions/users";
import { alerts } from "../alerts";

export const defaultUser: User = {
  id: "",
  bio: "",
  icon: "",
  name: "",
  type: "normal",
  created_at: 0,
  updated_at: 0
};

export const useUsers = () => {
  const { clutch } = useContext(AppContext);
  const { current_user } = clutch.state.users;
  const { followee_list, follower_list } = current_user;

  const callbacks = {
    followee_list,
    follower_list,
    current_user: current_user.profile,

    getUser: (uid: User["id"], isAlert?: boolean): Promise<User | null> => {
      const promiseCreator = () =>
        getUser(uid)
          .then(user => user)
          .catch(() => {
            if (isAlert) {
              alerts.get_user.error();
            }
            return null;
          });

      return clutch.request(`get-user-${uid}`, promiseCreator);
    },

    getFolloweeList: (uid: User["id"]): Promise<FolloweeList | null> => {
      const promiseCreator = () =>
        getFolloweeList(uid).catch(() => {
          alerts.get_followee_list.error();
          return null;
        });

      return clutch
        .request(`get-followee-list-${uid}`, promiseCreator)
        .catch(() => {
          alerts.get_followee_list.error();
          return null;
        });
    },

    getFollowerList: (uid: User["id"]): Promise<FolloweeList | null> => {
      const promiseCreator = () =>
        getFollowerList(uid).catch(() => {
          alerts.get_follower_list.error();
          return null;
        });

      return clutch
        .request(`get-follower-list-${uid}`, promiseCreator)
        .catch(() => {
          alerts.get_follower_list.error();
          return null;
        });
    },

    isFollowee: (followeeId: User["id"]): boolean => {
      const user = current_user.profile;

      if (user && followeeId && user.id !== followeeId) {
        if (followee_list) {
          for (const uid in followee_list) {
            if (uid === followeeId) {
              return true;
            }
          }
        } else {
          clutch.dispatch("get-followee", { type: "get-login-user-followee" });
        }
      }

      return false;
    },

    updateUser: (user: User): Promise<boolean> => {
      return clutch
        .dispatch("update-login-user", {
          type: "update-login-user",
          payload: user
        })
        .then(() => {
          alerts.update_user.success();
          return true;
        })
        .catch(() => {
          alerts.update_user.error();
          return false;
        });
    },

    updateIcon: async (icon: File): Promise<boolean> => {
      if (!icon.type.match("image")) {
        alerts.required_image_file.error();
        return false;
      }

      return clutch
        .dispatch("upload-icon", {
          type: "upload-user-icon",
          payload: icon
        })
        .then(() => {
          alerts.upload_image.success();
          return true;
        })
        .catch(() => {
          alerts.upload_image.error();
          return false;
        });
    },

    followUser: async (userId: User["id"]) => {
      clutch
        .pipe(
          "follow-user",
          () => ({ type: "follow-user", payload: userId })
        )
        .then(alerts.follow_user.success)
        .catch(alerts.follow_user.error);
    },

    unfollowUser: async (userId: User["id"]) => {
      clutch
        .pipe(
          "unfollow-user",
          () => ({ type: "unfollow-user", payload: userId })
        )
        .then(alerts.unfollow_user.success)
        .catch(alerts.unfollow_user.error);
    }
  };

  return callbacks;
};
