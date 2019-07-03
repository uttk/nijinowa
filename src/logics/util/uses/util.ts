import { useContext } from "react";
import { AppContext } from "../../../index";
import { alerts } from "../alerts";

export const useUtil = () => {
  const { clutch } = useContext(AppContext);

  return {
    alerts,
    isLoading: clutch.isLoading(),
    getLoadingStatus: clutch.isLoading,
    listenRequest: clutch.listenRequest,
    cancelRequest: clutch.cancelRequest
  };
};
