import { useContext, useEffect } from "react";
import { AppContext } from "../../..";
import { Fanfic } from "../../../types";
import { fanficDislike, fanficLike, isLiker } from "../../actions/fanfic_like";
import { alerts } from "../alerts";
import { useAuth } from "./auth";

export const useFanficLike = () => {
  const { loginCheck } = useAuth();
  const { clutch } = useContext(AppContext);
  const { current_user } = clutch.state.users;

  useEffect(() => {
    loginCheck();
  }, []);

  return {
    isLiked: async (fanficId: Fanfic["id"]): Promise<boolean> => {
      if (fanficId) {
        return clutch
          .request(`is-liked-${fanficId}`, () => isLiker(fanficId))
          .then(result => Boolean(result))
          .catch(() => {
            alerts.default.error();
            return false;
          });
      }

      return false;
    },

    fanficLike: async (fanfic: Fanfic): Promise<boolean> => {
      const user = current_user.profile;

      if (!user) {
        alerts.required_login.warn();
        return false;
      } else if (fanfic.author_id === user.id) {
        alerts.fanfic_like.warn();
        return false;
      }

      return clutch
        .request(`fanfic-like-${fanfic.id}`, () => fanficLike(fanfic))
        .then(() => {
          alerts.fanfic_like.success();
          return true;
        })
        .catch(() => {
          alerts.fanfic_like.error();
          return false;
        });
    },

    fanficDislike: async (fanfic: Fanfic): Promise<boolean> => {
      return clutch
        .request(`fanfic-dislike-${fanfic.id}`, () => fanficDislike(fanfic))
        .then(result => true)
        .catch(() => {
          alerts.default.error();
          return false;
        });
    }
  };
};
