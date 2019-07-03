import { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { useAuth } from "../../../logics/util/uses/auth";

export const useHome = () => {
  const { history } = useReactRouter();
  const { isLogin, isCheked, loginCheck, loginWithGoogle } = useAuth();
  const [isPush, setPush] = useState(false);
  const login = () => {
    if (isLogin) {
      history.push("/dashboard");
    } else {
      setPush(true);
      loginWithGoogle();
    }
  };

  useEffect(() => {
    if (!isCheked) {
      loginCheck();
    } else if (isLogin && isPush) {
      history.push("/dashboard");
    }
  }, [history, isCheked, isPush, isLogin]);

  return {
    isLogin,
    isCheked,
    login,
    goToTrend: () => history.push("/trends")
  };
};
