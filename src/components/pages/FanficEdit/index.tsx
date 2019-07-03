import React from "react";
import { RouteComponentProps } from "react-router";
import { IconButton } from "../../atoms/Button";
import { Tooltip } from "../../atoms/Tooltip";
import { Typography } from "../../atoms/Typography";
import { FanficParentEditableField } from "../../molecules/FanficParentEditableField";
import { EditTypography } from "../../organisms/EditTypography";
import { FanficContentsEditableField } from "../../organisms/FanficContentsEditableField";
import { PageTemplate } from "../../templates/PageTemplate";
import styles from "./FanficEdit.module.scss";
import { useFanficEdit } from "./use";

export const FanficEdit: React.FC<RouteComponentProps> = () => {
  const { fanfic, contents, isLoading, ...context } = useFanficEdit();

  return (
    <PageTemplate>
      <div className={styles.fanfic_edit}>
        <div className={styles.body}>
          <div className={styles.header}>
            <div className={styles.title}>
              <div className={styles.date}>
                <Typography
                  text={context.date ? `${context.date} に投稿` : ""}
                  variant="span"
                />
              </div>

              <EditTypography
                type="text"
                label="タイトル"
                variant="h2"
                text={fanfic.title}
                isLoad={isLoading}
                onSubmit={context.updateTitle}
              />
            </div>
          </div>

          <div className={styles.description}>
            <EditTypography
              type="textarea"
              label="説明文"
              variant="p"
              text={fanfic.description}
              isLoad={isLoading}
              onSubmit={context.updateDescription}
            />
          </div>
        </div>

        <div className={styles.fanfic_contents}>
          <FanficContentsEditableField
            fanfic={fanfic}
            contents={contents}
            onDeleteContents={context.deleteContents}
            onContentsUpdate={context.updateContents}
            onThumbnailUpdate={context.updateThumbnail}
            onUploadImageFile={context.onUploadImageFile}
          />
        </div>

        <div className={styles.fanfic_parents}>
          <FanficParentEditableField
            parents={fanfic.parents}
            onAdd={context.updateParents}
            onDelete={context.deleteParents}
          />
        </div>

        <IconButton
          className={styles.fix_button}
          icon="update"
          color="red"
          size={32}
          onClick={context.saveCurrentFanfic}
        >
          <Tooltip label="作品を更新します" />
        </IconButton>
      </div>
    </PageTemplate>
  );
};
