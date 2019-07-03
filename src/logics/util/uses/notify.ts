import { useContext } from "react";
import { AppContext } from "../../..";
import { Notify, User } from "../../../types";
import {
  deleteNotify,
  getNotifiesPagination,
  notifyToUser,
  readNotify,
  watchUserNotify
} from "../../actions/notify";
import { alerts } from "../alerts";

export const useNotify = () => {
  const { clutch } = useContext(AppContext);

  return {
    getNotifiesPagination: (unit: number, index: number): Promise<Notify[]> => {
      const promiseCreator = () =>
        getNotifiesPagination(unit, index).catch(() => {
          alerts.get_notifies.error();
          return [];
        });

      return clutch
        .request(`notify-pagination-${unit}-${index}`, promiseCreator)
        .then(result => {
          return result || [];
        });
    },

    watchUserNotify: (cb: (notifies: Notify[]) => void): (() => void) => {
      return watchUserNotify(cb, alerts.get_notifies.error);
    },

    notifyToUser: (
      id: Notify["id"],
      to: User["id"],
      message: string,
      link?: string
    ): Promise<void | null> => {
      return clutch
        .request(id, () => notifyToUser({ id, to, message, link }))
        .catch(() => void 0);
    },

    readNotify: (notifies: Notify[]): Promise<void | null> => {
      return clutch
        .request("read-notify", () => readNotify(notifies))
        .catch(() => null);
    },

    deleteNotify: (
      notifyId: Notify["id"],
      uid: User["id"]
    ): Promise<void | null> => {
      return clutch
        .request(notifyId, () => deleteNotify(notifyId, uid))
        .catch(() => void 0);
    }
  };
};
