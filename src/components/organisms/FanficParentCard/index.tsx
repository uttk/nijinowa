import React, { useEffect, useState } from "react";
import { defaultFanfic, useFanfic } from "../../../logics/util/uses/fanfic";
import { useUtil } from "../../../logics/util/uses/util";
import { FanficCard } from "../../molecules/FanficCard";

interface FanficParentCardProps extends React.Props<{}> {
  id: string;
}

export const FanficParentCard: React.FC<FanficParentCardProps> = React.memo(
  ({ id }) => {
    const [fanfic, setFanfic] = useState(defaultFanfic);
    const { cancelRequest } = useUtil();
    const { getFanfic } = useFanfic();

    useEffect(() => {
      getFanfic(id).then(result => {
        if (result) {
          setFanfic(result);
        }
      });

      return () => {
        cancelRequest(`get-fanfic-${id}`);
      };
    }, []);

    return <FanficCard fanfic={fanfic} />;
  }
);
