// antd
import { App, ConfigProvider } from "antd";
import { createHashRouter, RouterProvider } from "react-router-dom";
import type { DefaultComponent } from "@loadable/component";
import { handleRoutes } from "./helper";
import Layout from "../layouts";
import Login from "../pages/login";
import Register from "../pages/register";
import zhCN from "antd/es/locale/zh_CN";
import { useEffect } from "react";
import nprogress from "nprogress";
import {
  InternalErrorElement,
  NotFoundErrorElement,
} from "../components/ErrorPage";

const pages = import.meta.glob([
  "../pages/**/*.tsx",
  "!../pages/login",
]) as Record<string, () => Promise<DefaultComponent<unknown>>>;
const layouts = handleRoutes(pages);

const router = createHashRouter([
  {
    path: "login",
    element: <Login />,
    errorElement: InternalErrorElement,
  },
  {
    path: "register",
    element: <Register />,
    errorElement: InternalErrorElement,
  },
  {
    path: "",
    element: <Layout />,
    children: layouts,
    errorElement: InternalErrorElement,
  },
  {
    path: "*",
    element: NotFoundErrorElement,
  },
]);

export default function () {
  useEffect(() => {
    nprogress.done();

    // 关闭loading
    const firstElement = document.getElementById("first");
    if (firstElement && firstElement.style?.display !== "none") {
      firstElement.style.display = "none";
    }

    return () => {
      nprogress.start();
    };
  }, []);
  return (
    <ConfigProvider locale={zhCN}>
      <App>
        <RouterProvider router={router} />
      </App>
    </ConfigProvider>
  );
}
