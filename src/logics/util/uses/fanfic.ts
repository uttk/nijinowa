import { useContext } from "react";
import { AppContext } from "../../../index";
import { Fanfic } from "../../../types";
import {
  existFanfic,
  getFanfic,
  getFanficPagination,
  getUserFanfics
} from "../../actions/fanfic";
import { alerts } from "../alerts";
import { useAuth } from "./auth";

export const defaultFanfic: Fanfic = {
  id: "",
  likes: 0,
  title: "",
  parents: [],
  thumbnail: "",
  author_id: "",
  description: "",
  created_at: 0,
  updated_at: 0
};

export const useFanfic = () => {
  const context = useContext(AppContext);
  const { clutch } = context;
  const user = clutch.state.users.current_user.profile;
  const { my_fanfics, select_fanfic } = clutch.state.fanfic;
  const { isCheked, loginCheck } = useAuth();

  const callbacks = {
    select_fanfic,
    my_fanfics,

    isMyFanfic(fanfic: Fanfic | null): boolean {
      if (!fanfic || !user) {
        return false;
      }

      return fanfic.author_id === user.id;
    },

    checkParentId: async (parentId: string): Promise<boolean> => {
      return await existFanfic(parentId).catch(() => {
        alerts.exist_fanfic.error();
        return false;
      });
    },

    getUserFanfics: (uid: string): Promise<Fanfic[] | null> => {
      const promiseCreator = () => getUserFanfics(uid);

      return clutch
        .request(`get-user-fanfics-${uid}`, promiseCreator)
        .catch(() => {
          alerts.get_fanfic.error();
          return null;
        });
    },

    getMyFanfics: () => {
      if (isCheked) {
        clutch
          .dispatch("get-my-fanfics", { type: "get-my-fanfics" })
          .catch(alerts.get_fanfic.error);
      } else {
        loginCheck().then(() => {
          clutch
            .dispatch("get-my-fanfics", { type: "get-my-fanfics" })
            .catch(alerts.get_fanfic.error);
        });
      }
    },

    getFanfic: async (id: Fanfic["id"]): Promise<Fanfic | null> => {
      const promiseCreator = () =>
        getFanfic(id).catch(() => {
          alerts.get_fanfic.error();
          return null;
        });

      return clutch.request(`get-fanfic-${id}`, promiseCreator);
    },

    getEditableFanfic: async (id: Fanfic["id"]): Promise<boolean> => {
      const fanfic = await callbacks.getFanfic(id);

      return clutch
        .dispatch("select-fanfic", {
          type: "select-fanfic",
          payload: fanfic
        })
        .then(() => true)
        .catch(() => {
          alerts.get_fanfic.error();
          return false;
        });
    },

    getFanficTrends: async (
      unit: number,
      index: number
    ): Promise<Fanfic[] | null> => {
      const promiseCreator = () =>
        getFanficPagination(unit, index).catch(() => {
          alerts.get_fanfic_trends.error();
          return null;
        });

      return clutch.request(`get-trends-${unit}-${index}`, promiseCreator);
    },

    createFanfic: async (fanfic: Partial<Fanfic>): Promise<boolean> => {
      if (fanfic.title && fanfic.title.length === 0) {
        alerts.required_title.error();
        return false;
      }

      return clutch
        .dispatch("create-fanfic", {
          type: "create-fanfic",
          payload: fanfic
        })
        .then(() => {
          alerts.create_fanfic.success();
          return true;
        })
        .catch(() => {
          alerts.create_fanfic.error();
          return false;
        });
    },

    updateFanfic: async (fanfic: Partial<Fanfic>): Promise<boolean> => {
      if (fanfic.title && fanfic.title.length === 0) {
        alerts.required_title.error();
        return false;
      }

      return clutch
        .dispatch("update-fanfic", {
          type: "update-fanfic",
          payload: fanfic
        })
        .then(() => true)
        .catch(() => {
          alerts.update_fanfic.error();
          return false;
        });
    },

    saveFanfic: async (fanficId: Fanfic["id"]): Promise<void> => {
      clutch
        .dispatch("update-fanfic", {
          type: "save-fanfic",
          payload: fanficId
        })
        .then(alerts.update_fanfic.success)
        .catch(alerts.update_fanfic.error);
    },

    createExtendFanfic: async (
      title: string,
      parentId: Fanfic["id"]
    ): Promise<boolean> => {
      return clutch
        .pipe(
          "extend-fanfic",
          () => ({
            type: "create-fanfic",
            payload: { title, parents: [parentId] }
          }),
          state => {
            if (state.fanfic.select_fanfic) {
              return {
                type: "extends-fanfic-contents",
                payload: { fanficId: state.fanfic.select_fanfic.id, parentId }
              };
            }

            throw new Error("作品の作成に失敗しました");
          }
        )
        .then(() => {
          alerts.create_fanfic.success();
          return true;
        })
        .catch(() => {
          alerts.create_fanfic.error();
          return false;
        });
    },

    deleteFanfic: async (fanficId: Fanfic["id"]): Promise<boolean> => {
      return clutch
        .dispatch(`delete-fanfic-${fanficId}`, {
          type: "delete-fanfic",
          payload: fanficId
        })
        .then(() => {
          alerts.delete_fanfic.success();
          return true;
        })
        .catch(() => {
          alerts.delete_fanfic.error();
          return false;
        });
    }
  };

  return callbacks;
};
