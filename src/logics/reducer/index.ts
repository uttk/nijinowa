import * as Auth from "./auth";
import * as Fanfic from "./fanfic";
import * as Contents from "./fanfic_contents";
import * as Users from "./users";

export type AppActions =
  | Auth.Action
  | Fanfic.Action
  | Users.Action
  | Contents.Action;

export interface AppStoreType {
  auth: Auth.StoreType;
  users: Users.StoreType;
  fanfic: Fanfic.StoreType;
  contents: Contents.StoreType;
}

export const AppStore: AppStoreType = {
  auth: Auth.Store,
  users: Users.Store,
  fanfic: Fanfic.Store,
  contents: Contents.Store
};

export const AppReducer = async (
  state = AppStore,
  action: AppActions
): Promise<AppStoreType> => {
  const results = await Promise.all([
    Auth.reducer(state.auth, action as Auth.Action, state),
    Users.reducer(state.users, action as Users.Action, state),
    Fanfic.reducer(state.fanfic, action as Fanfic.Action, state),
    Contents.reducer(state.contents, action as Contents.Action, state)
  ]);

  return {
    ...state,
    auth: results[0],
    users: results[1],
    fanfic: results[2],
    contents: results[3]
  };
};
