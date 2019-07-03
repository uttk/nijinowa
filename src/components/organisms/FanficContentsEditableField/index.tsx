import React from "react";
import { useDnD } from "../../../logics/util/uses/dnd";
import { useUtil } from "../../../logics/util/uses/util";
import { Fanfic, FanficContents, FanficContentsType } from "../../../types";
import { IconButton } from "../../atoms/Button";
import { ModalPopup } from "../../atoms/ModalPopup";
import { Tooltip } from "../../atoms/Tooltip";
import { createForm } from "../../modules/Form";
import { FanficContentsEditableCard } from "../../molecules/FanficContentsEditableCard";
import { ToggleWrapper } from "../ToggleWrapper";
import styles from "./FanficContentsEditableField.module.scss";

const Form = createForm<{ image: File }>(["image"]);

interface FanficContentsEditableFieldProps extends React.Props<{}> {
  fanfic: Fanfic;
  contents: FanficContents;
  onUploadImageFile: (image: File) => Promise<boolean>;
  onDeleteContents: (contentsId: string) => void;
  onContentsUpdate: (contents: FanficContents) => void;
  onThumbnailUpdate: (thumbnail: Fanfic["thumbnail"]) => void;
}

export const FanficContentsEditableField: React.FC<
  FanficContentsEditableFieldProps
> = React.memo(
  ({
    fanfic,
    contents,
    onDeleteContents,
    onContentsUpdate: update,
    onThumbnailUpdate,
    onUploadImageFile
  }) => {
    const { isLoading } = useUtil();
    const { items, newProps } = useDnD<FanficContentsType>(contents, update);
    const submit = (onClose: () => void) => (result: { image?: File }) => {
      if (result.image) {
        onUploadImageFile(result.image).then(re => {
          if (re) {
            onClose();
          }
        });
      }
    };

    return (
      <>
        <p className={styles.field_label}>
          {items.length > 1 ? "ドラッグ&ドロップで並び替えができます" : ""}
        </p>

        <div className={styles.editable_field}>
          {items.map((item: FanficContentsType) => (
            <FanficContentsEditableCard
              key={`editable-contents-${item.id}`}
              isThumbnail={fanfic.thumbnail === item.path}
              contents={item}
              itemProps={newProps}
              onDeleteContents={onDeleteContents}
              onThumbnailUpdate={onThumbnailUpdate}
            />
          ))}

          <ToggleWrapper>
            {({ flag, trueFlag, falseFlag }) => (
              <>
                <ModalPopup show={flag} onClose={falseFlag}>
                  <Form.Body onSubmit={submit(falseFlag)}>
                    <Form.FileInput
                      label="画像"
                      name="image"
                      disabled={isLoading}
                    />
                    <Form.SubmitButton
                      label="画像をアップロード"
                      disabled={isLoading}
                    />
                  </Form.Body>
                </ModalPopup>

                <div className={styles.add_button}>
                  <IconButton
                    color="red"
                    icon="cross"
                    size={32}
                    onClick={trueFlag}
                  >
                    <Tooltip label="コンテンツを追加" />
                  </IconButton>
                </div>
              </>
            )}
          </ToggleWrapper>
        </div>
      </>
    );
  }
);
