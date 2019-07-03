import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Alert } from "./components/modules/alerts";
import { pages } from "./components/pages";
import "./index.scss";
import {
  AppActions,
  AppReducer,
  AppStore,
  AppStoreType
} from "./logics/reducer";
import { Clutch, useClutch } from "./logics/util/uses/clutch";
import * as serviceWorker from "./serviceWorker";

export interface AppContextType {
  clutch: Clutch<AppStoreType, AppActions>;
}

export const AppContext = React.createContext<AppContextType>({
  clutch: {} as Clutch<AppStoreType, AppActions>
});

const App: React.FC = () => {
  const clutch = useClutch(AppReducer, AppStore);

  return (
    <AppContext.Provider value={{ clutch }}>
      <BrowserRouter>
        <Switch>
          {pages.map((page, i) => (
            <Route
              exact={true}
              key={`PAGES_No.${i}`}
              path={page.path}
              component={page.component}
            />
          ))}
        </Switch>
      </BrowserRouter>

      <Alert />
    </AppContext.Provider>
  );
};

render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
