import { AppStoreType } from ".";
import { Fanfic, FanficContents, FanficContentsType } from "../../types";
import {
  createImageContents,
  deleteFanficContents,
  getFanficContents,
  updateFanficContents,
  uploadFanficImage
} from "../actions/fanfic_contents";

export type Action =
  | {
      type: "get-contents";
      payload: Fanfic["id"];
    }
  | {
      type: "update-contents";
      payload: {
        fanficId: Fanfic["id"];
        contents: FanficContents;
      };
    }
  | {
      type: "upload-contents-image";
      payload: {
        fanficId: Fanfic["id"];
        image: File;
      };
    }
  | {
      type: "save-fanfic-contents";
      payload: Fanfic["id"];
    }
  | {
      type: "delete-contents";
      payload: {
        fanficId: Fanfic["id"];
        contentsId: FanficContentsType["id"];
      };
    }
  | {
      type: "extends-fanfic-contents";
      payload: {
        parentId: Fanfic["id"];
        fanficId: Fanfic["id"];
      };
    };

export interface StoreType {
  [fanficId: string]: FanficContents | undefined;
}

export const Store: StoreType = {};

export const reducer = async (
  state: Readonly<StoreType>,
  action: Action,
  appStore: Readonly<AppStoreType>
): Promise<StoreType> => {
  switch (action.type) {
    case "get-contents": {
      const contents = await getFanficContents(action.payload);
      return { ...state, [action.payload]: contents };
    }

    case "save-fanfic-contents": {
      const contents = state[action.payload];

      if (contents) {
        const newContents = await updateFanficContents(
          action.payload,
          contents
        );

        return { ...state, [action.payload]: newContents };
      }

      throw new Error("コンテンツが見つかりませんでした");
    }

    case "update-contents": {
      const { fanficId, contents } = action.payload;
      return { ...state, [fanficId]: contents };
    }

    case "upload-contents-image": {
      const { fanficId, image } = action.payload;
      const contents = await getFanficContents(fanficId);
      const path = await uploadFanficImage(fanficId, image);
      const newContents = await updateFanficContents(
        fanficId,
        contents.concat(createImageContents({ path, order: contents.length }))
      );

      return { ...state, [fanficId]: newContents };
    }

    case "delete-contents": {
      const { fanficId, contentsId } = action.payload;

      await deleteFanficContents(fanficId, contentsId);

      const contents = state[fanficId] || [];

      return {
        ...state,
        [fanficId]: contents.filter(v => v.id !== contentsId)
      };
    }

    case "extends-fanfic-contents":
      const { fanficId, parentId } = action.payload;

      const parentContents = await getFanficContents(parentId);
      const baseContents = await getFanficContents(fanficId);

      const contents = baseContents
        .concat(parentContents)
        .filter((v, i, a) => a.findIndex(c => c.id === v.id) === i)
        .sort((v, w) => (v.order > w.order ? 1 : -1));

      const newContents = await updateFanficContents(fanficId, contents);

      return { ...state, [fanficId]: newContents };

    default:
      return state;
  }
};
