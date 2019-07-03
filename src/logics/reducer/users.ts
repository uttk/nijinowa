import { AppStoreType } from ".";
import { FolloweeList, FollowerList, User } from "../../types";
import {
  followUser,
  getFolloweeList,
  unfollowUser,
  updateUser,
  uplaodIcon
} from "../actions/users";
import { AppLocalStorage } from "../util/localStorage";

export type Action =
  | {
      type: "get-login-user";
    }
  | {
      type: "get-login-user-followee";
    }
  | {
      type: "update-login-user";
      payload: User;
    }
  | {
      type: "upload-user-icon";
      payload: File;
    }
  | {
      type: "follow-user";
      payload: User["id"];
    }
  | {
      type: "unfollow-user";
      payload: User["id"];
    };

export interface StoreType {
  current_user: {
    profile: User | null;
    followee_list: FolloweeList | null;
    follower_list: FollowerList | null;
  };
}

export const Store: StoreType = {
  current_user: {
    profile: AppLocalStorage.getItem("user"),
    followee_list: null,
    follower_list: null
  }
};

export const reducer = async (
  state: Readonly<StoreType>,
  action: Action,
  appStore: Readonly<AppStoreType>
): Promise<StoreType> => {
  switch (action.type) {
    case "get-login-user": {
      return {
        ...state,
        current_user: {
          ...state.current_user,
          profile: AppLocalStorage.getItem("user")
        }
      };
    }

    case "get-login-user-followee": {
      const user = state.current_user;

      if (user.profile) {
        const followeeList = await getFolloweeList(user.profile.id);

        return {
          ...state,
          current_user: {
            ...state.current_user,
            followee_list: followeeList
          }
        };
      }

      return state;
    }

    case "update-login-user": {
      const user = state.current_user;

      if (user.profile && user.profile.id === action.payload.id) {
        const profile = await updateUser(action.payload);

        AppLocalStorage.setItem("user", profile);

        return { ...state, current_user: { ...state.current_user, profile } };
      }

      throw new Error("ログインしていません");
    }

    case "upload-user-icon": {
      const user = state.current_user;

      if (user.profile) {
        const iconPath = await uplaodIcon(user.profile.id, action.payload);

        if (iconPath) {
          const profile = await updateUser({ ...user.profile, icon: iconPath });

          AppLocalStorage.setItem("user", profile);

          return { ...state, current_user: { ...state.current_user, profile } };
        }
      }

      throw new Error("ログインしていません");
    }

    case "follow-user": {
      if (!action.payload) {
        return state;
      }

      const user = state.current_user.profile;

      if (user && user.id !== action.payload) {
        const followeeItem = await followUser(user.id, action.payload);
        const list = state.current_user.followee_list;

        return {
          ...state,
          current_user: {
            ...state.current_user,
            followee_list: { ...list, [followeeItem.id]: followeeItem }
          }
        };
      }

      throw new Error("ログインしてないかフォローする人が見つかりません");
    }

    case "unfollow-user": {
      if (!action.payload) {
        return state;
      }

      const user = state.current_user.profile;

      if (user && user.id !== action.payload) {
        await unfollowUser(user.id, action.payload);
        const list: FolloweeList = { ...state.current_user.followee_list };

        if (list) {
          delete list[action.payload];
        }

        return {
          ...state,
          current_user: {
            ...state.current_user,
            followee_list: list
          }
        };
      }

      throw new Error("ログインしてないかフォローしている人が見つかりません");
    }

    default:
      return state;
  }
};
