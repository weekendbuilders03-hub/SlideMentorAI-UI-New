import { lazy } from "react";

const AppRoutes = [
  {
    path: "/dashboard",
    component: lazy(() => import("../pages/Dashboard/Dashboard")),
    loadable: true,
  },
  {
    path: "/upload",
    component: lazy(() => import("../pages/Upload/Upload")),
    loadable: true,
  },
];

export default AppRoutes;
