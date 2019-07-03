import React from "react";
import { RouteComponentProps } from "react-router";
import { Dashboard } from "./Dashboard";
import { FanficEdit } from "./FanficEdit";
import { FanficPreview } from "./FanficPreview";
import { FanficsDashboard } from "./FanficsDashboard";
import { FanficTrends } from "./FanficTrends";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { UserProfile } from "./UserProfile";
import { UserProfileEditDashboard } from "./UserProfileEditDashboard";

export interface PageList {
  component: React.FC<RouteComponentProps>;
  path: string | string[] | undefined;
}

export const pages: PageList[] = [
  {
    component: Home,
    path: "/"
  },
  {
    component: Dashboard,
    path: "/dashboard"
  },
  {
    component: FanficsDashboard,
    path: "/dashboard/fanfics"
  },
  {
    component: FanficPreview,
    path: "/fanfic/:id"
  },
  {
    component: FanficEdit,
    path: "/fanfic/:id/edit"
  },
  {
    component: UserProfile,
    path: "/user/:id"
  },
  {
    component: UserProfileEditDashboard,
    path: "/dashboard/user-edit"
  },
  {
    component: FanficTrends,
    path: "/trends"
  }
];

pages.push({
  component: NotFound,
  path: "*"
});
