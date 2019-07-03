import React, { useMemo, useState } from "react";
import { IconButton } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { Typography } from "../../atoms/Typography";
import { createForm } from "../../modules/Form";
import styles from "./EditTypography.module.scss";

const Form = createForm<{ edit_typo: string }>(["edit_typo"]);

interface EditTypographyProps extends React.Props<{}> {
  type: "text" | "textarea";
  text: string;
  label: string;
  isLoad?: boolean;
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  onSubmit: (input: string) => void;
}

export const EditTypography: React.FC<EditTypographyProps> = React.memo(
  ({ type, text, label, isLoad, variant, onSubmit }) => {
    const [showPopup, setPopup] = useState(false);
    const callbacks = useMemo(
      () => ({
        onShow: () => setPopup(true),
        onClose: () => setPopup(false),

        submit: (result: { edit_typo?: string }) => {
          onSubmit(result.edit_typo || "");
          setPopup(false);
        }
      }),
      [setPopup, onSubmit]
    );

    return (
      <div className={styles.edit_typography}>
        <Typography
          className={styles.typography}
          text={text}
          isLoad={isLoad}
          variant={variant}
        />

        {isLoad !== true ? (
          <IconButton
            size={24}
            icon="edit_black"
            color="transparent"
            className={styles.edit_btn}
            onClick={callbacks.onShow}
          />
        ) : null}

        <ModalPopup show={showPopup} onClose={callbacks.onClose}>
          <Form.Body onSubmit={callbacks.submit}>
            {type === "text" ? (
              <Form.TextInput
                label={label}
                name="edit_typo"
                defaultValue={text}
              />
            ) : (
              <Form.TextArea
                label={label}
                name="edit_typo"
                defaultValue={text}
              />
            )}

            <Form.SubmitButton label="変更する" />
          </Form.Body>
        </ModalPopup>
      </div>
    );
  }
);
