import { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { useFanfic } from "../../../logics/util/uses/fanfic";
import { defaultUser, useUsers } from "../../../logics/util/uses/users";
import { useUtil } from "../../../logics/util/uses/util";
import { Fanfic, FolloweeList, FollowerList, User } from "../../../types";

export type ProfileType = "fanfics" | "followee" | "follower";

export const useUserProfile = () => {
  const { getUser, getFolloweeList, getFollowerList } = useUsers();
  const { match } = useReactRouter<{ id: string }>();
  const [type, setType] = useState<ProfileType>("fanfics");
  const [user, setUser] = useState<User>(defaultUser);
  const [fanfics, setFanfics] = useState<Fanfic[] | null>(null);
  const [followeeList, setFollowee] = useState<FolloweeList | null>(null);
  const [followerList, setFollower] = useState<FollowerList | null>(null);
  const { isLoading } = useUtil();
  const { getUserFanfics } = useFanfic();

  const getFanfics = () => {
    if (user.id) {
      getUserFanfics(user.id).then(setFanfics);
    }
  };

  const getFollowee = () => {
    if (user.id) {
      getFolloweeList(user.id).then(setFollowee);
    }
  };

  const getFollower = () => {
    if (user.id) {
      getFollowerList(user.id).then(setFollower);
    }
  };

  useEffect(() => {
    getUser(match.params.id, true).then(userData => {
      if (userData) {
        setUser(userData);
      }
    });
  }, [match.params.id]);

  useEffect(() => {
    switch (type) {
      case "fanfics":
        getFanfics();
        break;

      case "followee":
        getFollowee();
        break;

      case "follower":
        getFollower();
        break;
    }
  }, [type, user]);

  return {
    type,
    user,
    fanfics,
    isLoading,
    followeeList,
    followerList,
    selectType: (t: ProfileType) => () => setType(t)
  };
};
