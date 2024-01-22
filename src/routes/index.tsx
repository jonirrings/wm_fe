import {App} from 'antd';
import {HashRouter as Router} from 'react-router-dom';

import type { RouteObject } from "react-router-dom";
import type { DefaultComponent } from "@loadable/component";
import { handleRoutes } from "./helper";
import { useRoutes } from "react-router-dom";
import Layout from '../layouts';
import Login from '../pages/login';
import NotFound from '../pages/NotFound';

const pages = import.meta.glob('../pages/**/*.tsx') as Record<string, () => Promise<DefaultComponent<unknown>>>;
const layouts = handleRoutes(pages);

const routes: RouteObject[] = [
  {
    path: "login",
    element: <Login />
  },
  {
    path: "",
    element: <Layout />,
    children: layouts
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

// antd
import {ConfigProvider} from "antd";
import zhCN from 'antd/es/locale/zh_CN';

function Routes() {
    return (<Router>
        <ConfigProvider locale={zhCN}>
            <App>
                {useRoutes(routes)}
            </App>
        </ConfigProvider>
    </Router>);
}

export default Routes;
