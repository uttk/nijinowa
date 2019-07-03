import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { defaultFanfic, useFanfic } from "../../../logics/util/uses/fanfic";
import { Fanfic } from "../../../types";
import { PopupItem, SimplePopup } from "../../atoms/SimplePopup";
import { FanficCard } from "../../molecules/FanficCard";
import { ToggleWrapper, ToggleWrapperChildProps } from "../ToggleWrapper";
import styles from "./FanficParentEditableCard.module.scss";

interface FanficParentEditableCardProps extends React.Props<{}> {
  id: string;
  onDelete: (parentId: string) => void;
}

const setWindowEevent = ({ falseFlag }: ToggleWrapperChildProps) => {
  window.addEventListener("click", falseFlag);
  return () => window.removeEventListener("click", falseFlag);
};

export const FanficParentEditableCard: React.FC<
  FanficParentEditableCardProps
> = React.memo(({ id, onDelete }) => {
  const { history } = useReactRouter();
  const [fanfic, setFanfic] = useState(defaultFanfic);
  const { getFanfic } = useFanfic();

  const deleteParent = () => {
    if (window.confirm("本当に削除しますか？")) {
      onDelete(id);
    }
  };

  const onClick = (selected: Fanfic) => {
    history.push(`/fanfic/${selected.id}`);
  };

  useEffect(() => {
    getFanfic(id).then(result => {
      if (result) {
        setFanfic(result);
      }
    });
  }, []);

  return (
    <ToggleWrapper onceDidMount={setWindowEevent}>
      {({ flag, trueFlag }) => (
        <div className={styles.editable_card}>
          <SimplePopup show={flag} className={styles.popup}>
            <PopupItem label="削除" onClick={deleteParent} />
          </SimplePopup>

          <FanficCard
            fanfic={fanfic}
            onClick={onClick}
            onMenuClick={trueFlag}
          />
        </div>
      )}
    </ToggleWrapper>
  );
});
