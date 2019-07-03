import { useEffect, useMemo } from "react";
import useReactRouter from "use-react-router";
import { formatDate } from "../../../logics/util/dayjs";
import { defaultFanfic, useFanfic } from "../../../logics/util/uses/fanfic";
import { useFanficContents } from "../../../logics/util/uses/fanfic_contents";
import { useUtil } from "../../../logics/util/uses/util";
import { Fanfic, FanficContents } from "../../../types";

export const useFanficEdit = () => {
  const { alerts, isLoading } = useUtil();
  const { history, match } = useReactRouter<{ id: string }>();
  const {
    select_fanfic,
    saveFanfic,
    updateFanfic,
    checkParentId,
    getEditableFanfic
  } = useFanfic();
  const {
    contents,
    addImageContents,
    getFanficContents,
    saveFanficContents,
    deleteFanficContents,
    updateFanficContents
  } = useFanficContents();

  useEffect(() => {
    getEditableFanfic(match.params.id).then(result => {
      if (!result) {
        history.replace("/");
      }
    });
    getFanficContents(match.params.id);
  }, []);

  const callbacks = useMemo(
    () => ({
      isLoading,
      fanfic: select_fanfic || defaultFanfic,
      contents: contents[match.params.id] || [],
      date: select_fanfic
        ? formatDate(select_fanfic.created_at, "YYYY/MM/DD HH:mm")
        : "",

      saveCurrentFanfic: () => {
        if (select_fanfic) {
          saveFanfic(select_fanfic.id);
          saveFanficContents(select_fanfic.id);
        }
      },

      updateTitle: (title: Fanfic["title"]) => {
        updateFanfic({ title });
      },

      updateDescription: (description: Fanfic["description"]) => {
        updateFanfic({ description });
      },

      updateThumbnail: (thumbnail: Fanfic["thumbnail"]) => {
        updateFanfic({ thumbnail });
      },

      updateContents: (newContents: FanficContents) => {
        if (select_fanfic) {
          updateFanficContents(select_fanfic.id, newContents);
        }
      },

      onUploadImageFile: async (image: File): Promise<boolean> => {
        if (select_fanfic) {
          return await addImageContents(select_fanfic.id, image);
        }

        return false;
      },

      updateParents: (parentId: string) => {
        if (!select_fanfic) {
          return;
        }

        const { parents } = select_fanfic;

        if (select_fanfic.id === parentId) {
          alerts.fanfic_parents.warn();
          return;
        } else if (parents.length >= 3) {
          alerts.fanfic_parents.error();
          return;
        }

        (async () => {
          const exsit = await checkParentId(parentId);

          if (exsit) {
            updateFanfic({
              parents: parents
                .concat(parentId)
                .filter((v, i, a) => a.indexOf(v) === i)
            });
          } else {
            alerts.exist_fanfic.warn();
          }
        })();
      },

      deleteParents: (parentId: string) => {
        if (select_fanfic) {
          updateFanfic({
            parents: select_fanfic.parents.filter(v => v !== parentId)
          });
        }
      },

      deleteContents: (contentsId: string) => {
        if (window.confirm("本当に削除しますか？") && select_fanfic) {
          deleteFanficContents(select_fanfic.id, contentsId);
        }
      }
    }),
    [isLoading, select_fanfic, contents]
  );

  return callbacks;
};
