import React, { useState } from "react";
import useReactRouter from "use-react-router";
import { useAuth } from "../../../logics/util/uses/auth";
import { useFanfic } from "../../../logics/util/uses/fanfic";
import { useUtil } from "../../../logics/util/uses/util";
import { Fanfic } from "../../../types";
import { IconButton } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { createForm } from "../../modules/Form";
import styles from "./ReplyButton.module.scss";

interface ReplyButtonProps extends React.Props<{}> {
  fanfic: Fanfic;
}

const Form = createForm<{ title: string }>(["title"]);

export const ReplyButton: React.FC<ReplyButtonProps> = React.memo(
  ({ fanfic, children }) => {
    const { history } = useReactRouter();
    const { alerts } = useUtil();
    const [showPopup, setPopupState] = useState(false);
    const { createExtendFanfic } = useFanfic();
    const { isLogin } = useAuth();

    const onClose = () => setPopupState(false);
    const onClick = () => {
      if (window.confirm("この作品の二次創作を作成しますか？")) {
        setPopupState(true);
      }
    };
    const onSubmit = (result: { title?: string }) => {
      if (result.title) {
        createExtendFanfic(result.title, fanfic.id).then(bool => {
          if (bool) {
            history.push("/dashboard/fanfics");
          }
        });
      } else {
        alerts.required_title.error();
      }
    };

    return isLogin ? (
      <>
        <button className={styles.button_wrapper}>
          <IconButton
            size={32}
            icon="reply"
            color="transparent"
            onClick={onClick}
          >
            {children}
          </IconButton>
        </button>

        <ModalPopup show={showPopup} onClose={onClose}>
          <Form.Body onSubmit={onSubmit}>
            <Form.TextInput label="作品のタイトル" name="title" />
            <Form.SubmitButton label="二次創作を作成" />
          </Form.Body>
        </ModalPopup>
      </>
    ) : null;
  }
);
