import { User } from "../../types";

type StorageKeys = "user";

interface Cache<Data> {
  data: Data;
  key: string;
  expired: number;
  deadline: number;
}

const isDeadLine = <T extends Cache<{}>>(cache: T): null | T["data"] => {
  const ms = Date.now() - cache.expired;

  if (ms >= cache.deadline) {
    localStorage.removeItem(cache.key);
    return null;
  } else {
    return cache.data;
  }
};

const getDeadLine = (key: StorageKeys): number => {
  switch (key) {
    case "user":
      return 2592000000;
    default:
      return 86400000;
  }
};

class AppLocalStorageClass {
  public setItem(key: "user", data: User): void;
  public setItem(key: StorageKeys, data: User) {
    const cache: Cache<any> = {
      key,
      data,
      expired: Date.now(),
      deadline: getDeadLine(key)
    };

    localStorage.setItem(key, JSON.stringify(cache));
  }

  public getItem(key: "user"): User | null;
  public getItem(key: StorageKeys): User | null {
    const data = localStorage.getItem(key);

    if (data) {
      switch (key) {
        case "user":
          return isDeadLine<Cache<User>>(JSON.parse(data));

        default:
          return null;
      }
    }

    return null;
  }

  public removeItem(key: StorageKeys) {
    localStorage.removeItem(key);
  }
}

export const AppLocalStorage = new AppLocalStorageClass();
