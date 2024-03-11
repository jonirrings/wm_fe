import { api } from "./index";
import { extractResp } from "../utils/transformer";
import { IDType, Result } from "../utils/types";

type LoginResponse = {
  token: string;
  username: string;
  admin: boolean;
};
type UserProfile = {
  user_id: IDType;
  username: string;
  email: string;
  email_verified: boolean;
  bio: string;
  avatar: string;
  created_at: string;
  updated_at?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
export type RegisterPayload = {
  username: string;
  password: string;
};

const userUrls = {
  login: "/user/login",
  me: "/user/me",
  register: "/user/register",
};

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (arg) => ({
        url: userUrls.login,
        method: "POST",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["user"] : []),
    }),
    register: builder.mutation<Result<number>, RegisterPayload>({
      query: (arg) => ({
        url: userUrls.register,
        method: "POST",
        body: arg,
      }),
      invalidatesTags: (result) => (result ? ["user"] : []),
    }),
    me: builder.query<UserProfile, void>({
      query: () => userUrls.me,
      transformResponse: extractResp,
      providesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } =
  extendedApi;
