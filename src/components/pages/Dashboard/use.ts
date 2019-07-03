import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../../logics/util/uses/auth";
import { useNotify } from "../../../logics/util/uses/notify";
import { Notify } from "../../../types";

interface RefType {
  notifies: Notify[];
  index: number;
  unsubscribe: () => void;
  clearId?: NodeJS.Timeout;
}

interface StateType {
  notifies: Notify[];
  finished: boolean;
}

export const useDashboard = () => {
  const { watchUserNotify, getNotifiesPagination, readNotify } = useNotify();
  const { isCheked, isLogin } = useAuth();
  const [state, setState] = useState<StateType>({
    notifies: [],
    finished: true
  });
  const ref = useRef<RefType>({
    notifies: state.notifies,
    index: 0,
    unsubscribe: () => {}
  }).current;

  const updateNotfies = (newNotifies: Notify[]) => {
    const latest = ref.notifies
      .concat(newNotifies)
      .filter((v, i, a) => a.findIndex(n => n.id === v.id) === i)
      .sort((v, w) => (v.created_at > w.created_at ? -1 : 1));

    if (ref.notifies.length !== latest.length) {
      ref.notifies = latest;

      setState({ notifies: latest, finished: newNotifies.length < 10 });

      if (ref.clearId) {
        clearTimeout(ref.clearId);
      }

      ref.clearId = setTimeout(() => {
        readNotify(ref.notifies);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isCheked && isLogin) {
      getNotifiesPagination(10, ref.index).then(newNotifies => {
        ref.index += 1;

        updateNotfies(newNotifies);

        ref.unsubscribe = watchUserNotify(updateNotfies);
      });

      return () => {
        ref.unsubscribe();

        if (ref.clearId) {
          clearTimeout(ref.clearId);
        }
      };
    }
  }, [isCheked]);

  return useMemo(
    () => ({
      ...state,

      getNotifies: () => {
        getNotifiesPagination(10, ref.index).then(newNotifies => {
          ref.index += 1;
          updateNotfies(newNotifies);

          if (newNotifies.length === 0 && !state.finished) {
            setState({ ...state, finished: true });
          }
        });
      }
    }),
    [state]
  );
};
