import { useEffect, useMemo, useState } from "react";
import { useFanfic } from "../../../logics/util/uses/fanfic";
import { Fanfic } from "../../../types";
import { createForm } from "../../modules/Form";
import { ToggleWrapperChildProps } from "../../organisms/ToggleWrapper";

const Form = createForm<{ title: string; description: string }>([
  "title",
  "description"
]);

const setWindowEvent = ({ falseFlag }: ToggleWrapperChildProps) => {
  window.addEventListener("click", falseFlag);
  return () => window.removeEventListener("click", falseFlag);
};

export const useFanficDashboard = () => {
  const [showPopup, setPopupState] = useState(false);
  const { my_fanfics, getMyFanfics, createFanfic, deleteFanfic } = useFanfic();

  useEffect(() => getMyFanfics(), []);

  return useMemo(
    () => ({
      Form,
      showPopup,
      fanfics: my_fanfics,
      setWindowEvent,

      openPopup: () => setPopupState(true),

      closePopup: () => setPopupState(false),

      onCreateFanfic: (result: { title?: string; description?: string }) => {
        createFanfic(result).then(done => {
          if (done) {
            setPopupState(false);
          }
        });
      },

      deleteHandler: (fanficId: Fanfic["id"]) => {
        return () => {
          if (window.confirm("本当に削除しますか？")) {
            deleteFanfic(fanficId);
          }
        };
      }
    }),
    [my_fanfics, showPopup, createFanfic]
  );
};
