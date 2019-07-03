import * as firebase from "firebase/app";
import { User } from "../../types";
import { firebaseAuth, fireStore } from "../util/firebase";
import { createUser, getUser } from "./users";

export const GoogleSingin = async (): Promise<User> => {
  let user = firebaseAuth.currentUser;

  if (!user) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = await firebaseAuth.signInWithPopup(provider);
    user = auth.user;
  }

  if (user) {
    const profile = await getUser(user.uid).catch(() => null);

    if (!profile) {
      return await createUser(user as firebase.User);
    } else {
      return profile;
    }
  } else {
    throw new Error("ログインに失敗しました");
  }
};

export const firebaseLogout = () => {
  return firebaseAuth.signOut();
};

export const getFirebaseAuthState = (): Promise<User | null> => {
  return new Promise((re, rj) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      user => {
        unsubscribe();

        if (user) {
          getUser(user.uid)
            .then(re)
            .catch(() => re(null));
        } else {
          re(null);
        }
      },
      error => {
        unsubscribe();
        rj(error);
      }
    );
  });
};

export const unsubscribeService = async () => {
  const user = firebaseAuth.currentUser;

  if (user) {
    await fireStore
      .collection("users")
      .doc(user.uid)
      .delete();

    await user.delete();

    return;
  }

  throw new Error("ログインしていません");
};
