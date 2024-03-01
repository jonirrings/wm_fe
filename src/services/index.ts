import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix, TOKEN } from "../utils/constants";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiPrefix,
    timeout: 10 * 1000,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TOKEN) || "";
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
    },
  }),
  keepUnusedDataFor: 5,
  //todo: websocket required to notify server side change
  tagTypes: ["user", "room", "shelf", "item", "stock"],
  endpoints: (_builder) => ({}),
});
