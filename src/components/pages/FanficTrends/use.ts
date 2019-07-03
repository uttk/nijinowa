import { useEffect, useRef, useState } from "react";
import { useFanfic } from "../../../logics/util/uses/fanfic";
import { Fanfic } from "../../../types";

export const useFanficTrends = () => {
  const [trends, setTrends] = useState<Fanfic[]>([]);
  const { getFanficTrends } = useFanfic();
  const ref = useRef({ page: 0, trends, loading: false }).current;

  useEffect(() => {
    const loadFanfic = () => {
      if (ref.loading) {
        return;
      }

      ref.loading = true;
      setTrends(ref.trends.concat());

      getFanficTrends(50, ref.page).then(result => {
        ref.loading = false;

        if (result) {
          ref.page += 1;
          ref.trends = ref.trends.concat(result);
          setTrends(ref.trends);

          if (result.length === 0) {
            return window.removeEventListener("scroll", onScroll);
          }
        }
      });
    };

    const onScroll = () => {
      const y = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const displayHieght = window.innerHeight;
      const hitLine = (scrollHeight - displayHieght) * 0.5;

      if (y > hitLine) {
        loadFanfic();
      }
    };

    loadFanfic();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { trends, loading: ref.loading };
};
