import React from "react";
import { RouteComponentProps } from "react-router";
import { Tab, TabBar, TabWrapper } from "../../atoms/Tab";
import { Typography } from "../../atoms/Typography";
import { FanficCardList } from "../../molecules/FanficCardList";
import { UserList } from "../../molecules/UserList";
import { FollowButton } from "../../organisms/FollowButton";
import { UserIcon } from "../../organisms/UserIcon";
import { PageTemplate } from "../../templates/PageTemplate";
import { useUserProfile } from "./use";
import styles from "./UserProfile.module.scss";

export const UserProfile: React.FC<RouteComponentProps> = () => {
  const {
    user,
    type,
    fanfics,
    isLoading,
    followeeList,
    followerList,
    selectType
  } = useUserProfile();

  return (
    <PageTemplate>
      <div className={styles.user_profile}>
        <div className={styles.user_status}>
          <UserIcon iconPath={user.icon} size={200} />

          <div className={styles.status_wrapper}>
            <Typography variant="h2" text={user.name} isLoad={isLoading} />
            <Typography variant="p" text={user.bio} isLoad={isLoading} />
          </div>
        </div>

        <div className={styles.profile_body}>
          <TabBar>
            <Tab
              label="作品一覧"
              selected={type === "fanfics"}
              onClick={selectType("fanfics")}
            />

            <Tab
              label="フォロー"
              selected={type === "followee"}
              onClick={selectType("followee")}
            />

            <Tab
              label="フォロワー"
              selected={type === "follower"}
              onClick={selectType("follower")}
            />

            <TabWrapper>
              <FollowButton uid={user.id} />
            </TabWrapper>
          </TabBar>

          <div className={styles.list_body}>
            {(() => {
              switch (type) {
                case "fanfics":
                  return <FanficCardList fanfics={fanfics} />;

                case "followee":
                  return (
                    <UserList
                      users={followeeList}
                      defaultLabel="フォローしている人はまだいません"
                    />
                  );

                case "follower":
                  return (
                    <UserList
                      users={followerList}
                      defaultLabel="フォロワーはまだいません"
                    />
                  );

                default:
                  return null;
              }
            })()}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};
