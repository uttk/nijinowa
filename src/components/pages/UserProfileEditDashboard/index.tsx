import React from "react";
import { RouteComponentProps } from "react-router";
import { Button } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { UserIcon } from "../../organisms/UserIcon";
import { DashboardTemplate } from "../../templates/DashboardTemplate";
import { useUserProfileEditDashboard } from "./use";
import styles from "./UserProfileEditDashboard.module.scss";

export const UserProfileEditDashboard: React.FC<RouteComponentProps> = () => {
  const { user, Form, IconForm, ...context } = useUserProfileEditDashboard();

  return (
    <DashboardTemplate>
      <div className={styles.user_profile_edit}>
        <div className={styles.icon_form}>
          <UserIcon iconPath={user.icon} size={200} />

          <div className={styles.button_wrapper}>
            <Button onClick={context.openIconForm}>
              アイコン画像を変更する
            </Button>
          </div>
        </div>

        <div className={styles.form_body}>
          <Form.Body onSubmit={context.updateUserStatus}>
            <Form.TextInput label="名前" name="name" defaultValue={user.name} />

            <Form.TextArea
              label="自己紹介文"
              name="bio"
              defaultValue={user.bio}
            />

            <Form.SubmitButton label="更新" />
          </Form.Body>

          <div className={styles.wrapper}>
            <button
              className={styles.unsubscribe}
              onClick={context.unsubscribe}
            >
              退会する
            </button>
          </div>
        </div>

        <ModalPopup show={context.showIconForm} onClose={context.closeIconForm}>
          <IconForm.Body onSubmit={context.updateIcon}>
            <IconForm.FileInput name="icon" label="アイコン画像" />
            <Form.SubmitButton
              label="アイコン画像を更新"
              disabled={context.isLoading}
            />
          </IconForm.Body>
        </ModalPopup>
      </div>
    </DashboardTemplate>
  );
};
