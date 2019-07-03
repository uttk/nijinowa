import { Fanfic, User } from "../../types";
import { firebaseAuth, fireStore } from "../util/firebase";
import { getFanficLikers } from "./fanfic_like";

const fanficCache: Map<string, Fanfic> = new Map();
const userFanficsCache: Map<string, Fanfic[]> = new Map();
const paginationCache: Map<
  number,
  { list: Map<number, Fanfic[]>; endIndex: number | null; lastItemDate: number }
> = new Map();

const checkFanfic = (fanfic: Fanfic): Fanfic => {
  if (fanfic.title.length === 0) {
    throw new Error("タイトルを入力してください");
  }

  const user = firebaseAuth.currentUser;

  if (!user || fanfic.author_id !== user.uid) {
    throw new Error("編集権限がありません。");
  }

  return { ...fanfic };
};

export const createFanficObj = (fanfic: Partial<Fanfic>): Fanfic => ({
  id: fanfic.id || "",
  likes: fanfic.likes || 0,
  title: fanfic.title || "",
  parents: fanfic.parents || [],
  author_id: fanfic.author_id || "",
  thumbnail: fanfic.thumbnail || "",
  created_at: fanfic.created_at || 0,
  updated_at: fanfic.updated_at || 0,
  description: fanfic.description || ""
});

export const getUserFanfics = async (uid: User["id"]): Promise<Fanfic[]> => {
  const cache = userFanficsCache.get(uid);

  if (cache) {
    return cache;
  }

  const fanficsSS = await fireStore
    .collection("fanfics")
    .where("author_id", "==", uid)
    .get();

  const promises = fanficsSS.docs.map(
    async (doc): Promise<Fanfic> => {
      const data = doc.data();

      if (!data) {
        throw new Error("データがありません");
      }

      const likers = await getFanficLikers(doc.id).catch(() => null);
      const likes = likers ? Object.keys(likers).length : 0;

      fanficCache.set(doc.id, { ...data, likes } as Fanfic);

      return data as Fanfic;
    }
  );

  return await Promise.all(promises).then(fanfics => {
    userFanficsCache.set(uid, fanfics);
    return fanfics;
  });
};

export const getCurrentUserFanfics = async (): Promise<Fanfic[]> => {
  const user = firebaseAuth.currentUser;

  if (user) {
    return await getUserFanfics(user.uid);
  }

  throw new Error("ログインしていません");
};

export const getFanfic = async (id: Fanfic["id"]): Promise<Fanfic> => {
  const cache = fanficCache.get(id);

  if (cache) {
    return cache;
  }

  const fanficSS = await fireStore
    .collection("fanfics")
    .doc(id)
    .get();

  const data = fanficSS.data();

  if (!data) {
    throw new Error("データがありません");
  }

  fanficCache.set(id, data as Fanfic);

  return { ...data } as Fanfic;
};

export const createFanfic = async (
  fanfic: Partial<Fanfic>
): Promise<Fanfic> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません");
  }

  const ref = fireStore.collection("fanfics").doc();
  const newFanfic: Fanfic = checkFanfic(
    createFanficObj({
      ...fanfic,
      id: ref.id,
      thumbnail: "",
      author_id: currentUser.uid,
      created_at: Date.now(),
      updated_at: Date.now()
    })
  );

  await ref.set(newFanfic);

  fanficCache.set(newFanfic.id, { ...newFanfic });

  return newFanfic;
};

export const updateFanfic = async (fanfic: Fanfic): Promise<Fanfic> => {
  fanfic = checkFanfic(fanfic);

  const ref = fireStore.collection("fanfics").doc(fanfic.id);

  fanfic.updated_at = Date.now();

  await ref.set(fanfic);

  fanficCache.set(fanfic.id, { ...fanfic });

  return fanfic;
};

export const deleteFanfic = async (fanficId: Fanfic["id"]) => {
  await fireStore
    .collection("fanfics")
    .doc(fanficId)
    .delete();

  fanficCache.delete(fanficId);
};

export const existFanfic = async (fanficId: Fanfic["id"]): Promise<boolean> => {
  if (fanficCache.get(fanficId)) {
    return true;
  }

  const ref = fireStore.collection("fanfics").doc(fanficId);
  const doc = await ref.get();

  return doc.exists;
};

export const getFanficPagination = async (
  unit: number,
  index: number
): Promise<Fanfic[]> => {
  const unitCache = paginationCache.get(unit) || {
    list: new Map<number, Fanfic[]>(),
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
    .collection("fanfics")
    .orderBy("created_at", "desc")
    .startAfter(lastItemDate)
    .limit(unit);

  const ss = await ref.get();

  const trends = ss.docs.map(v => v.data() as Fanfic);
  const lastItem: Fanfic | undefined = trends.slice(-1)[0];

  paginationCache.set(unit, {
    list: list.set(index, trends),
    endIndex: trends.length === unit ? null : index,
    lastItemDate: lastItem ? lastItem.created_at : lastItemDate
  });

  return trends;
};

export const extendFanfic = async (
  title: string,
  parentId: Fanfic["id"]
): Promise<Fanfic> => {
  return await createFanfic({ title, parents: [parentId] });
};
