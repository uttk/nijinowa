import { AppStoreType } from ".";
import { Fanfic } from "../../types";
import {
  createFanfic,
  deleteFanfic,
  getCurrentUserFanfics,
  updateFanfic
} from "../actions/fanfic";

export type Action =
  | {
      type: "get-my-fanfics";
    }
  | {
      type: "select-fanfic";
      payload: Fanfic | null;
    }
  | {
      type: "create-fanfic";
      payload: Partial<Fanfic>;
    }
  | {
      type: "update-fanfic";
      payload: Partial<Fanfic>;
    }
  | {
      type: "save-fanfic";
      payload: Fanfic["id"];
    }
  | {
      type: "delete-fanfic";
      payload: Fanfic["id"];
    };

export interface StoreType {
  my_fanfics: Fanfic[];
  select_fanfic: Fanfic | null;
}

export const Store: StoreType = {
  my_fanfics: [],
  select_fanfic: null
};

export const reducer = async (
  state: Readonly<StoreType>,
  action: Action,
  appStore: Readonly<AppStoreType>
): Promise<StoreType> => {
  switch (action.type) {
    case "get-my-fanfics": {
      if (state.my_fanfics.length > 0) {
        return state;
      }

      const fanfics = await getCurrentUserFanfics();

      return { ...state, my_fanfics: fanfics };
    }

    case "select-fanfic": {
      return {
        ...state,
        select_fanfic: action.payload
      };
    }

    case "create-fanfic": {
      const fanfic = await createFanfic(action.payload);

      return {
        ...state,
        select_fanfic: fanfic,
        my_fanfics: state.my_fanfics.concat(fanfic)
      };
    }

    case "update-fanfic": {
      const { select_fanfic } = state;

      if (select_fanfic) {
        return {
          ...state,
          select_fanfic: { ...select_fanfic, ...action.payload }
        };
      }

      throw new Error("編集できる作品が見つかりません");
    }

    case "save-fanfic": {
      const { select_fanfic, my_fanfics } = state;

      if (select_fanfic) {
        if (select_fanfic.id === action.payload) {
          const fanfic = await updateFanfic(select_fanfic);
          const fanfics = my_fanfics.map(v =>
            v.id === fanfic.id ? fanfic : v
          );

          return { ...state, select_fanfic: fanfic, my_fanfics: fanfics };
        }
      }

      throw new Error("保存する作品が見つかりません");
    }

    case "delete-fanfic": {
      const { select_fanfic, my_fanfics } = state;
      const selectFanficId = select_fanfic ? select_fanfic.id : "";
      const fanfic = my_fanfics.find(v => v.id === action.payload);

      if (fanfic) {
        await deleteFanfic(fanfic.id);

        return {
          ...state,
          select_fanfic: fanfic.id === selectFanficId ? null : select_fanfic,
          my_fanfics: my_fanfics.filter(v => v.id !== fanfic.id)
        };
      }

      throw new Error("削除する作品が見つかりません");
    }

    default:
      return state;
  }
};
