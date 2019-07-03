import { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { formatDate } from "../../../logics/util/dayjs";
import { defaultFanfic, useFanfic } from "../../../logics/util/uses/fanfic";
import { useUtil } from "../../../logics/util/uses/util";

export const useFanficPreview = () => {
  const { match, history } = useReactRouter<{ id: string }>();
  const [fanfic, setFanfic] = useState(defaultFanfic);
  const { isMyFanfic, getFanfic } = useFanfic();
  const createDate = formatDate(fanfic.created_at, "YYYY/MM/DD HH:mm");
  const { cancelRequest } = useUtil();
  const fanficId = match.params.id;

  useEffect(() => {
    getFanfic(fanficId).then(result => {
      if (result) {
        setFanfic(result);
      } else {
        history.replace("/");
      }
    });

    return () => {
      cancelRequest(`get-fanfic-${fanficId}`);
    };
  }, [fanficId]);

  return {
    fanfic,
    createDate,
    isMyFanfic,
    isLoading: !fanfic.id
  };
};
