import {
  Fanfic,
  FanficContents,
  FanficContentsType,
  ImageFanfic
} from "../../types";
import { firebaseAuth, fireStorage, fireStore } from "../util/firebase";
import { preloadImage } from "../util/util";

const contentsCache: Map<string, FanficContents> = new Map();

export const createImageContents = (
  contents: Partial<ImageFanfic>
): ImageFanfic => {
  return {
    id: contents.id || "",
    type: "image",
    path: contents.path || "",
    order: contents.order || 0,
    title: contents.title || "",
    fanfic_id: contents.fanfic_id || "",
    author_id: contents.author_id || "",
    created_at: contents.created_at || Date.now()
  };
};

export const getFanficContents = async (
  fanficId: Fanfic["id"]
): Promise<FanficContents> => {
  const cache = contentsCache.get(fanficId);

  if (cache) {
    return cache;
  }

  const ss = await fireStore
    .collection("fanfics")
    .doc(fanficId)
    .collection("contents")
    .orderBy("order")
    .get();

  const contents = await Promise.all(
    ss.docs.map(async doc => {
      const data = doc.data();

      if (!data) {
        throw new Error("データがありません");
      }

      await preloadImage((data as FanficContentsType).path);

      return data as FanficContentsType;
    })
  );

  contentsCache.set(fanficId, contents);

  return contents;
};

export const updateFanficContents = async (
  fanficId: Fanfic["id"],
  contents: FanficContents
) => {
  const currentUser = firebaseAuth.currentUser;

  if (!currentUser) {
    throw new Error("ログインしていません。");
  }

  const ref = fireStore
    .collection("fanfics")
    .doc(fanficId)
    .collection("contents");

  const batch = fireStore.batch();

  const newContents = contents.map((item, i) => {
    const newItem: FanficContentsType = {
      ...item,
      order: i,
      fanfic_id: fanficId,
      author_id: currentUser.uid
    };

    if (newItem.id) {
      batch.set(ref.doc(newItem.id), newItem);
    } else {
      const newRef = ref.doc();
      newItem.id = newRef.id;
      batch.set(newRef, newItem);
    }

    return newItem;
  });

  await batch.commit();

  contentsCache.set(fanficId, newContents);

  return newContents;
};

export const uploadFanficImage = (
  fanficId: Fanfic["id"],
  file: File
): Promise<string> => {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("ログインしていません");
  }

  return new Promise((re, rj) => {
    const ex = file.name.match(/\.(\w{3,4})/);
    const ref = fireStorage
      .ref(user.uid)
      .child(fanficId)
      .child(`${Date.now()}.${ex ? ex[1] : "png"}`)
      .put(file, { contentType: file.type });

    ref.on("state_changed", ss => {}, rj, () => {
      ref.snapshot.ref
        .getDownloadURL()
        .then(re)
        .catch(rj);
    });
  });
};

export const deleteFanficContents = async (
  fanficId: Fanfic["id"],
  contentsId: FanficContentsType["id"]
) => {
  await fireStore
    .collection("fanfics")
    .doc(fanficId)
    .collection("contents")
    .doc(contentsId)
    .delete();

  contentsCache.delete(fanficId);
};
