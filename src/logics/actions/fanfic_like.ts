import { Fanfic, FanficLiker, FanficLikerList, User } from "../../types";
import { firebaseAuth, fireStore } from "../util/firebase";
import { deleteNotify, notifyToUser } from "./notify";
import { getUser } from "./users";

const likerCache: Map<string, FanficLikerList> = new Map();

export const isLiker = async (fanficId: Fanfic["id"]): Promise<boolean> => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    return false;
  }

  const ss = await fireStore
    .collection("fanfics")
    .doc(fanficId)
    .collection("likers")
    .doc(currentUser.uid)
    .get();

  return ss.exists;
};

export const getFanficLikers = async (
  fanficId: Fanfic["id"]
): Promise<FanficLikerList> => {
  const cache = likerCache.get(fanficId);

  if (cache) {
    return cache;
  }

  const ref = fireStore
    .collection("fanfics")
    .doc(fanficId)
    .collection("likers");

  const ss = await ref.get();
  const likers: FanficLikerList = {};

  const promises = ss.docs.map(async doc => {
    const user = await getUser(doc.id).catch(() => null);

    if (user) {
      likers[user.id] = user;
    }
  });

  await Promise.all(promises);

  likerCache.set(fanficId, likers);

  return likers;
};

export const fanficLike = async (fanfic: Fanfic): Promise<FanficLiker> => {
  const currentUser = firebaseAuth.currentUser;

  if (currentUser) {
    const fanficId = fanfic.id;
    const uid = currentUser.uid;
    const fanficRef = fireStore.collection("fanfics").doc(fanficId);
    const ref = fanficRef.collection("likers");

    const likers = await getFanficLikers(fanficId);

    if (likers[uid]) {
      throw new Error("既にいいねをしています");
    }

    const user = await getUser(uid);

    const liker: FanficLiker = {
      id: uid,
      created_at: Date.now()
    };

    likers[uid] = user;

    await ref.doc(uid).set(liker);

    notifyToUser({
      id: `${fanfic.id}${uid}${fanfic.author_id}`,
      to: fanfic.author_id,
      message: `${user.name}さんが「${fanfic.title}」にいいね！しました`,
      link: `/fanfic/${fanfic.id}`
    });

    likerCache.delete(fanficId);

    return liker;
  }

  throw new Error("ログインしていません");
};

export const fanficDislike = async (fanfic: Fanfic): Promise<void> => {
  const currentUser = firebaseAuth.currentUser;

  if (currentUser) {
    const fanficId = fanfic.id;
    const uid = currentUser.uid;
    const fanficRef = fireStore.collection("fanfics").doc(fanficId);
    const likers = await getFanficLikers(fanficId);

    if (!likers[uid]) {
      throw new Error("いいねをしていません");
    }

    delete likers[uid];

    await fanficRef
      .collection("likers")
      .doc(uid)
      .delete();

    deleteNotify(`${fanfic.id}${uid}${fanfic.author_id}`, fanfic.author_id);

    likerCache.delete(fanficId);

    return;
  }

  throw new Error("ログインしていません");
};
