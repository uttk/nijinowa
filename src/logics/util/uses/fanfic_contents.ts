import { useContext } from "react";
import { AppContext } from "../../../index";
import { Fanfic, FanficContents, FanficContentsType } from "../../../types";
import { alerts } from "../alerts";

export const useFanficContents = () => {
  const { clutch } = useContext(AppContext);
  const { contents } = clutch.state;

  return {
    contents,

    getFanficContents: async (fanficId: Fanfic["id"]) => {
      return clutch
        .dispatch(`get-contents-${fanficId}`, {
          type: "get-contents",
          payload: fanficId
        })
        .catch(alerts.get_fanfic_contents.error);
    },

    saveFanficContents: async (fanficId: Fanfic["id"]) => {
      return clutch
        .dispatch(`save-fanfic-contents-${fanficId}`, {
          type: "save-fanfic-contents",
          payload: fanficId
        })
        .catch(alerts.update_fanfic_contents.error);
    },

    updateFanficContents: async (
      fanficId: Fanfic["id"],
      newContents: FanficContents
    ): Promise<void> => {
      return clutch.dispatch("update-fanfic-contents", {
        type: "update-contents",
        payload: { fanficId, contents: newContents }
      });
    },

    addImageContents: async (
      fanficId: Fanfic["id"],
      image: File
    ): Promise<boolean> => {
      if (!image.type.match("image")) {
        alerts.required_image_file.error();
      }

      return clutch
        .dispatch("upload-contents-image", {
          type: "upload-contents-image",
          payload: { fanficId, image }
        })
        .then(() => {
          alerts.update_fanfic.success();
          return true;
        })
        .catch(() => {
          alerts.upload_image.error();
          return false;
        });
    },

    deleteFanficContents: async (
      fanficId: Fanfic["id"],
      contentsId: FanficContentsType["id"]
    ) => {
      return clutch
        .dispatch(`delete-contents-${contentsId}`, {
          type: "delete-contents",
          payload: { fanficId, contentsId }
        })
        .then(alerts.delete_fanfic_contents.success)
        .catch(alerts.delete_fanfic_contents.error);
    }
  };
};
