import { Notify, User } from "../../types";
import { firebaseAuth, fireStore } from "../util/firebase";

const paginationCache: Map<
  number,
  {
    list: Map<number, Notify[]>;
    endIndex: number | null;
    lastItemDate: number;
  }
> = new Map();
const unSubscribeList: Map<string, () => void> = new Map();

export const getNotifiesPagination = async (
  unit: number,
  index: number
): Promise<Notify[]> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  const uid = currentUser.uid;
  const unitCache = paginationCache.get(unit) || {
    list: new Map<number, Notify[]>(),
    endIndex: null,
    lastItemDate: Date.now()
  };

  const { list, endIndex, lastItemDate } = unitCache;

  if (typeof endIndex === "number" && index > endIndex) {
    return [];
  } else {
    const cache = list.get(index);

    if (cache) {
      return cache;
    }
  }

  const ref = fireStore
    .collection("users")
    .doc(uid)
    .collection("notifies")
    .orderBy("created_at", "desc")
    .startAfter(lastItemDate)
    .limit(unit);

  const ss = await ref.get();

  const notifies = ss.docs.map(doc => doc.data() as Notify);
  const lastItem: Notify | undefined = notifies.slice(-1)[0];

  paginationCache.set(unit, {
    list: list.set(index, notifies),
    endIndex: notifies.length === unit ? null : index,
    lastItemDate: lastItem ? lastItem.created_at : lastItemDate
  });

  return notifies;
};

export const watchUserNotify = (
  cb: (notifies: Notify[]) => void,
  onerror: (e: Error) => void
): (() => void) => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  const uid = currentUser.uid;
  const cache = unSubscribeList.get(uid);

  if (cache) {
    cache();
  }

  const unsubscribe = fireStore
    .collection("users")
    .doc(uid)
    .collection("notifies")
    .where("read", "==", false)
    .onSnapshot(ss => {
      if (!ss.metadata.hasPendingWrites) {
        const notifies: Notify[] = [];

        ss.docChanges().forEach(change => {
          if (change.type === "added") {
            notifies.push(change.doc.data() as Notify);
          }
        });

        cb(notifies);
      }
    }, onerror);

  const newUnSubscribe = () => {
    unsubscribe();
    unSubscribeList.delete(uid);
  };

  unSubscribeList.set(uid, newUnSubscribe);

  return newUnSubscribe;
};

export const notifyToUser = async (notify: {
  id: string;
  to: User["id"];
  message: string;
  link?: string;
}): Promise<void> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  const uid = currentUser.uid;
  const ref = fireStore
    .collection("users")
    .doc(notify.to)
    .collection("notifies")
    .doc(notify.id);

  const ss = await ref.get();

  if (ss.exists) {
    throw new Error("既に送っています");
  }

  const newNotify: Notify = {
    ...notify,
    id: ref.id,
    read: false,
    from: uid,
    created_at: Date.now()
  };

  await ref.set(newNotify);
};

export const readNotify = async (notifies: Notify[]): Promise<void> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  const newNotifies = notifies.filter(v => !v.read);

  if (newNotifies.length === 0) {
    return;
  }

  const batch = fireStore.batch();
  const uid = currentUser.uid;
  const notifyRef = fireStore
    .collection("users")
    .doc(uid)
    .collection("notifies");

  newNotifies.forEach(notify => {
    batch.update(notifyRef.doc(notify.id), { read: true });
  });

  batch.commit();
};

export const deleteNotify = async (notifyId: Notify["id"], to: User["id"]) => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  await fireStore
    .collection("users")
    .doc(to)
    .collection("notifies")
    .doc(notifyId)
    .delete();
};
