import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

interface DateCache {
  [key: number]: string;
}

const dateCache: DateCache = {};

export const formatDate = (
  unix: number,
  format: string = "YYYY年MM月DD日 HH時mm分"
): string => {
  const cache = dateCache[unix];

  if (cache) {
    return cache;
  }

  const date = dayjs(unix);

  if (date.isValid() && unix) {
    dateCache[unix] = date.format(format);
    return dateCache[unix];
  }

  return "";
};
