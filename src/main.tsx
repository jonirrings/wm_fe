import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./routes";

// 状态管理
import { Provider } from "react-redux";
import { store } from "./stores";
// 样式
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs"; // 兼容低版本浏览器
import "uno.css";
// 时间设为中文
import dayjs from "dayjs";
import localized from "dayjs/plugin/localizedFormat";
import "dayjs/locale/zh-cn";

dayjs.extend(localized);
dayjs.locale("zh-cn");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
  {
    //@ts-ignore
    onCaughtError: (error, errorInfo) =>
      console.error(
        "React Caught error",
        error,
        error.cause,
        errorInfo.componentStack,
      ),
    onRecoverableError: (error: any, errorInfo) =>
      console.error(
        "React Recoverable error",
        error,
        error.cause,
        errorInfo.componentStack,
      ),
  },
);

root.render(
  <React.StrictMode>
    <StyleProvider
      hashPriority="high"
      transformers={[legacyLogicalPropertiesTransformer]}
    >
      <Provider store={store}>
        <Router />
      </Provider>
    </StyleProvider>
  </React.StrictMode>,
);

// 关闭loading
const firstElement = document.getElementById("first");
if (firstElement && firstElement.style?.display !== "none") {
  firstElement.style.display = "none";
}
