import React from "react";
import { Fanfic } from "../../../types";
import { IconButton } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { Tooltip } from "../../atoms/Tooltip";
import { createForm } from "../../modules/Form";
import { FanficParentEditableCard } from "../../organisms/FanficParentEditableCard";
import { ToggleWrapper } from "../../organisms/ToggleWrapper";
import styles from "./FanficParentEditableField.module.scss";

const Form = createForm<{ parentId: string }>(["parentId"]);

interface FanficParentEditableFieldProps extends React.Props<{}> {
  parents: Fanfic["parents"];
  onAdd: (parentId: string) => void;
  onDelete: (parentId: string) => void;
}

export const FanficParentEditableField: React.FC<
  FanficParentEditableFieldProps
> = ({ parents, onAdd, onDelete }) => {
  const submit = (onClose: () => void) => (result: { parentId?: string }) => {
    if (result.parentId) {
      onAdd(result.parentId);
      onClose();
    }
  };

  return (
    <ToggleWrapper>
      {({ flag, trueFlag, falseFlag }) => (
        <div className={styles.fanfic_parents}>
          <h3>親作品</h3>
          <div className={styles.field_body}>
            {parents.map(id => (
              <FanficParentEditableCard
                key={`fanfic-parents-edit-${id}`}
                id={id}
                onDelete={onDelete}
              />
            ))}

            <IconButton size={32} icon="cross" onClick={trueFlag}>
              <Tooltip label="親作品を追加" />
            </IconButton>
          </div>

          <ModalPopup show={flag} onClose={falseFlag}>
            <Form.Body onSubmit={submit(falseFlag)}>
              <Form.TextInput label="親作品のID" name="parentId" />
              <Form.SubmitButton label="親作品を追加" />
            </Form.Body>
          </ModalPopup>
        </div>
      )}
    </ToggleWrapper>
  );
};
