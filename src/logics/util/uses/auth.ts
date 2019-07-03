import { useContext } from "react";
import { AppContext } from "../../../index";
import { alerts } from "../alerts";

export const useAuth = () => {
  const { clutch } = useContext(AppContext);
  const { auth } = clutch.state;

  const callbacks = {
    ...auth,

    loginCheck: () => {
      return clutch
        .pipe(
          "login-check",
          () => ({ type: "login-check" }),
          () => ({ type: "get-login-user" })
        )
        .catch(alerts.login_check.error);
    },

    loginWithGoogle: () => {
      return clutch
        .pipe(
          "login",
          () => ({ type: "google-login" }),
          () => ({ type: "get-login-user" })
        )
        .then(alerts.login.success)
        .catch(alerts.login.error);
    },

    logout: async () => {
      if (window.confirm("本当にログアウトしますか？")) {
        return clutch
          .pipe(
            "login",
            () => ({ type: "logout" }),
            () => ({ type: "get-login-user" })
          )
          .then(alerts.logout.success)
          .catch(alerts.logout.error);
      }
    },

    unsubscribeService: async (): Promise<boolean> => {
      return clutch
        .dispatch("unsubscribe", { type: "unsubscribe-service" })
        .then(() => {
          alerts.unsubscribe.success();
          return false;
        })
        .catch(() => {
          alerts.unsubscribe.error();
          return false;
        });
    }
  };

  return callbacks;
};
