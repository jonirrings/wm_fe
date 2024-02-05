// antd
import { App, ConfigProvider } from "antd";
import type { RouteObject } from "react-router-dom";
import { HashRouter, useRoutes } from "react-router-dom";
import type { DefaultComponent } from "@loadable/component";
import { handleRoutes } from "./helper";
import Layout from "../layouts";
import Login from "../pages/login";
import Register from "../pages/register";
import NotFound from "../pages/NotFound";
import zhCN from "antd/es/locale/zh_CN";

const pages = import.meta.glob("../pages/**/*") as Record<
  string,
  () => Promise<DefaultComponent<unknown>>
>;
const layouts = handleRoutes(pages);

const routes: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "",
    element: <Layout />,
    children: layouts,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

function Core() {
  return useRoutes(routes);
}

function Routes() {
  return (
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <App>
          <Core />
        </App>
      </ConfigProvider>
    </HashRouter>
  );
}

export default Routes;
