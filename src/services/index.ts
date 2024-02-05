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
  tagTypes: ["user", "room", "shelf", "item"],
  endpoints: (_builder) => ({}),
});
