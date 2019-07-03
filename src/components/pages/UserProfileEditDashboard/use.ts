import { useState } from "react";
import useReactRouter from "use-react-router";
import { useAuth } from "../../../logics/util/uses/auth";
import { defaultUser, useUsers } from "../../../logics/util/uses/users";
import { useUtil } from "../../../logics/util/uses/util";
import { createForm } from "../../modules/Form";

const Form = createForm<{ name: string; bio: string }>(["name", "bio"]);

const IconForm = createForm<{ icon: File }>(["icon"]);

export const useUserProfileEditDashboard = () => {
  const { history } = useReactRouter();
  const [showIconForm, setIconFormState] = useState(false);
  const { isLoading } = useUtil();
  const { unsubscribeService } = useAuth();
  const { current_user, updateUser, updateIcon } = useUsers();
  const user = current_user ? current_user : defaultUser;

  return {
    user,
    isLoading,
    showIconForm,

    Form,
    IconForm,

    openIconForm: () => setIconFormState(true),

    closeIconForm: () => setIconFormState(false),

    updateUserStatus: (result: Partial<{ name: string; bio: string }>) => {
      updateUser({ ...user, ...result });
    },

    updateIcon: (result: { icon?: File }) => {
      if (result.icon) {
        updateIcon(result.icon).then(done => {
          if (done) {
            setIconFormState(false);
          }
        });
      }
    },

    unsubscribe: async () => {
      if (
        window.confirm(
          "本当に退会しますか？退会するとサービスの機能が制限されます"
        )
      ) {
        await unsubscribeService().then(result => {
          if (result) {
            history.replace("/");
          }
        });
      }
    }
  };
};
