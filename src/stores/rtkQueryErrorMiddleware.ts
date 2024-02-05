import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { message } from "antd";
import { debounce, get } from "lodash";
import { ErrResult, RTKError, VFunc } from "../utils/types";
import { api } from "../services";
import { TOKEN } from "../utils/constants";
import { removeLocal } from "../utils/local";

const handle401 = debounce(
  function (data: ErrResult, cb: VFunc) {
    message.error(data.message);
    cb();
  },
  1000,
  { leading: true },
);
const rtkQueryErrorMiddleware: Middleware =
  (mApi: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const payload = action.payload as any;
      const meta = action.meta;
      if ("status" in payload && "data" in payload) {
        const { status } = payload;
        switch (status) {
          case 401:
            const { data } = payload as RTKError;
            handle401(data, () => {
              mApi.dispatch(api.util?.invalidateTags(["user"]));
              removeLocal(TOKEN);
              setTimeout(() => {
                window.location.href = "/";
              }, 1000);
            });
            break;
          default:
            const method = get(meta, ["baseQueryMeta", "request", "method"]);
            if (method === "GET") {
              // for initial fetch in page
              const { data } = payload as RTKError<ErrResult>;
              message.error(data.message);
            }
            console.warn("We got a rejected action!", action.error);
        }
      }
    }

    return next(action);
  };

export default rtkQueryErrorMiddleware;
