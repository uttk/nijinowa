import { AppStoreType } from ".";
import {
  firebaseLogout,
  getFirebaseAuthState,
  GoogleSingin,
  unsubscribeService
} from "../actions/auth";
import { AppLocalStorage } from "../util/localStorage";

export type Action =
  | {
      type: "login-check";
    }
  | {
      type: "google-login";
    }
  | {
      type: "logout";
    }
  | {
      type: "unsubscribe-service";
    };

export interface StoreType {
  isLogin: boolean;
  isCheked: boolean;
}

export const Store: StoreType = {
  isLogin: false,
  isCheked: false
};

export const reducer = async (
  state: Readonly<StoreType>,
  action: Action,
  appStore: Readonly<AppStoreType>
): Promise<StoreType> => {
  switch (action.type) {
    case "login-check": {
      if (!state.isCheked) {
        const user = await getFirebaseAuthState();

        if (user) {
          AppLocalStorage.setItem("user", user);
        } else {
          AppLocalStorage.removeItem("user");
        }

        return { isLogin: !!user, isCheked: true };
      } else {
        return state;
      }
    }

    case "google-login": {
      if (state.isLogin) {
        return state;
      } else {
        const result = await GoogleSingin();

        AppLocalStorage.setItem("user", result);

        return { isLogin: true, isCheked: true };
      }
    }

    case "logout": {
      await firebaseLogout();

      AppLocalStorage.removeItem("user");

      return { isLogin: false, isCheked: true };
    }

    case "unsubscribe-service": {
      await unsubscribeService();

      AppLocalStorage.removeItem("user");

      return { isLogin: false, isCheked: true };
    }

    default:
      return state;
  }
};
