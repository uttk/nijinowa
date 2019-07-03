import {
  Followee,
  FolloweeList,
  Follower,
  FollowerList,
  User
} from "../../types";
import { fireStorage, fireStore } from "../util/firebase";
import { deleteNotify, notifyToUser } from "./notify";

const userCache: Map<string, User> = new Map();
const followeeCache: Map<string, FolloweeList> = new Map();
const followerCache: Map<string, FollowerList> = new Map();

export const getUser = async (uid: string): Promise<User> => {
  const cache = userCache.get(uid);

  if (cache) {
    return cache;
  }

  const userSS = await fireStore
    .collection("users")
    .doc(uid)
    .get();

  const data = userSS.data();

  if (!data) {
    throw new Error("データがありません");
  }

  userCache.set(uid, data as User);

  return data as User;
};

export const createUser = (user: firebase.User): Promise<User> => {
  const params: User = {
    id: user.uid,
    bio: "",
    name: "名無し",
    icon: "",
    type: "normal",
    created_at: Date.now(),
    updated_at: Date.now()
  };

  userCache.set(params.id, params);

  return fireStore
    .collection("users")
    .doc(user.uid)
    .set(params)
    .then(() => params);
};

export const updateUser = async (user: User): Promise<User> => {
  user = { ...user };

  const ref = fireStore.collection("users").doc(user.id);

  user.updated_at = Date.now();
  user.type = "normal";

  await ref.update(user);

  userCache.set(user.id, user);

  return { ...user };
};

export const uplaodIcon = (uid: User["id"], icon: File): Promise<string> => {
  return new Promise((re, rj) => {
    const ex = icon.name.match(/\.(\w{3,4})/);
    const ref = fireStorage
      .ref(uid)
      .child("thumbnails")
      .child(`${Date.now()}.${ex ? ex[1] : "png"}`)
      .put(icon, { contentType: icon.type });

    ref.on("state_changed", ss => {}, rj, () => {
      ref.snapshot.ref
        .getDownloadURL()
        .then(re)
        .catch(rj);
    });
  });
};

export const getFolloweeList = async (
  uid: User["id"]
): Promise<{ [followeeId: string]: User }> => {
  const list = followeeCache.get(uid);

  if (list) {
    return list;
  }

  const ref = fireStore
    .collection("users")
    .doc(uid)
    .collection("followees");

  const ss = await ref.get();
  const followeeList: FolloweeList = {};

  const promises = ss.docs.map(async doc => {
    const user = await getUser(doc.id).catch(() => null);

    if (user) {
      followeeList[user.id] = user;
    }
  });

  await Promise.all(promises);

  followeeCache.set(uid, followeeList);

  return followeeList;
};

export const followUser = async (
  uid: User["id"],
  followeeId: User["id"]
): Promise<User> => {
  const followee = await getUser(followeeId);

  const ref = fireStore
    .collection("users")
    .doc(uid)
    .collection("followees")
    .doc(followeeId);

  const followeeData: Followee = {
    id: followee.id,
    created_at: Date.now()
  };

  await ref.set(followeeData);

  followeeCache.delete(uid);

  await addFollower(followeeId, uid);

  notifyToUser({
    id: `follow-${uid}-${followee.id}`,
    to: followee.id,
    message: `${followee.name}さんがあなたをフォローしました`
  });

  return followee;
};

export const unfollowUser = async (
  uid: User["id"],
  followeeId: User["id"]
): Promise<void> => {
  await fireStore
    .collection("users")
    .doc(uid)
    .collection("followees")
    .doc(followeeId)
    .delete();

  followeeCache.delete(uid);

  deleteNotify(`follow-${uid}-${followeeId}`, followeeId);

  await removeFollower(followeeId, uid);
};

export const getFollowerList = async (
  uid: User["id"]
): Promise<FollowerList> => {
  const cache = followerCache.get(uid);

  if (cache) {
    return cache;
  }

  const ref = fireStore
    .collection("users")
    .doc(uid)
    .collection("followers");

  const ss = await ref.get();
  const followerList: FolloweeList = {};

  const promises = ss.docs.map(async doc => {
    const user = await getUser(doc.id).catch(() => null);

    if (user) {
      followerList[user.id] = user;
    }
  });

  await Promise.all(promises);

  followerCache.set(uid, followerList);

  return followerList;
};

export const addFollower = async (
  uid: User["id"],
  followerId: User["id"]
): Promise<Follower> => {
  const follower = await getUser(followerId);

  const ref = fireStore
    .collection("users")
    .doc(uid)
    .collection("followers")
    .doc(followerId);

  const followerData: Follower = {
    id: follower.id,
    created_at: Date.now()
  };

  return await ref.set(followerData).then(() => {
    followerCache.delete(uid);
    return followerData;
  });
};

export const removeFollower = async (
  uid: User["id"],
  followerId: User["id"]
): Promise<void> => {
  await fireStore
    .collection("users")
    .doc(uid)
    .collection("followers")
    .doc(followerId)
    .delete();

  followerCache.delete(uid);
};
