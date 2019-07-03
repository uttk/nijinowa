import * as firebase from "firebase";

export type FirebaseTimestamp = firebase.firestore.Timestamp;

export type UserType = "admin" | "normal";

export interface User {
  id: string;
  bio: string;
  name: string;
  icon: string;
  type: UserType;

  created_at: number;
  updated_at: number;
}

export interface Follower {
  id: string;
  created_at: number;
}

export interface FollowerList {
  [followerId: string]: User;
}

export interface Followee {
  id: string;
  created_at: number;
}

export interface FolloweeList {
  [followeeId: string]: User;
}

export interface Notify {
  id: string;
  read: boolean;
  message: string;

  to: User["id"];
  from: User["id"];

  link?: string;

  created_at: number;
}

export interface ImageFanfic {
  id: string;
  type: "image";
  title: string;
  path: string;
  order: number;
  fanfic_id: Fanfic["id"];
  author_id: User["id"];
  created_at: number;
}

export type FanficContentsType = ImageFanfic;

export type FanficContents = FanficContentsType[];

export interface Fanfic {
  id: string;
  author_id: User["id"];

  title: string;
  description: string;
  thumbnail: string;
  parents: string[];

  created_at: number;
  updated_at: number;

  likes: number;
}

export interface FanficLiker {
  id: User["id"];
  created_at: number;
}

export interface FanficLikerList {
  [likerId: string]: User;
}

export type StorageUploadState =
  | "canceled"
  | "error"
  | "paused"
  | "running"
  | "success";
