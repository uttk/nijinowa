import React from "react";
import { RouteComponentProps } from "react-router";
import { IconButton } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { PopupItem, SimplePopup } from "../../atoms/SimplePopup";
import { Tooltip } from "../../atoms/Tooltip";
import { FanficCard } from "../../molecules/FanficCard";
import { ToggleWrapper } from "../../organisms/ToggleWrapper";
import { DashboardTemplate } from "../../templates/DashboardTemplate";
import styles from "./FanficsDashboard.module.scss";
import { useFanficDashboard } from "./use";

export const FanficsDashboard: React.FC<RouteComponentProps> = () => {
  const { Form, ...context } = useFanficDashboard();

  return (
    <DashboardTemplate>
      <div className={styles.fanfic_dashboard}>
        <ModalPopup
          show={context.showPopup}
          onClose={context.closePopup}
          width={400}
        >
          <div className={styles.form_header}>
            <p>プロジェクト作成</p>
          </div>

          <Form.Body onSubmit={context.onCreateFanfic}>
            <Form.TextInput label="タイトル" name="title" />
            <Form.TextArea label="説明文" name="description" />
            <Form.SubmitButton label="作成" />
          </Form.Body>
        </ModalPopup>

        <div className={styles.fanfic_list}>
          {context.fanfics.map((fanfic, i) => (
            <ToggleWrapper
              key={`my-fanfic-${fanfic.id}-${i}`}
              onceDidMount={context.setWindowEvent}
            >
              {({ flag, trueFlag }) => (
                <div className={styles.card_wrappper}>
                  <FanficCard
                    fanfic={fanfic}
                    showUserIcon={false}
                    onMenuClick={trueFlag}
                  />

                  <SimplePopup show={flag} className={styles.popup}>
                    <PopupItem
                      label="削除する"
                      onClick={context.deleteHandler(fanfic.id)}
                    />
                  </SimplePopup>
                </div>
              )}
            </ToggleWrapper>
          ))}
        </div>

        <IconButton
          className={styles.create_button}
          size={32}
          icon="edit"
          onClick={context.openPopup}
        >
          <Tooltip label="新しく作品を作成する" />
        </IconButton>
      </div>
    </DashboardTemplate>
  );
};
