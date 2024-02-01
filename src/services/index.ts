import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiPrefix, TOKEN } from "../utils/constants.ts";
import { IDType, Paged, QParam, Result } from "../utils/types.ts";
import { extractResp } from "../utils/transformer.tsx";

const userUrls = {
  login: "/user/login",
  me: "/user/me",
  register: "/user/register",
};
const roomUrls = {
  list: "/rooms",
  one: "/rooms/",
};
const itemUrls = {
  list: "/items",
  one: "/items/",
};
const shelfUrls = {
  list: "/shelf",
  one: "/shelf/",
};

export type LoginPayload = {
  username: string;
  password: string;
};
export type RegisterPayload = {
  username: string;
  password: string;
};

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
  updated_at?: string;
};
export type RoomPayload = Omit<BizRoom, "room_id">;
export type ShelfPayload = Omit<BizShelf, "shelf_id">;
export type ItemPayload = Omit<BizItem, "item_id">;
export type BizRoom = {
  room_id: IDType;
  name: string;
  description?: string;
};
export type BizShelf = {
  shelf_id: IDType;
  name: string;
  layer: number;
  room_id: IDType;
};
export type BizItem = {
  item_id: IDType;
  name: string;
  sn: string;
  description?: string;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiPrefix,
    timeout: 180 * 1000,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TOKEN) || "";
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
    },
  }),
  tagTypes: ["user", "room", "shelf", "item"],
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
    readRooms: builder.query<Paged<BizRoom>, QParam>({
      query: (arg) => ({
        url: roomUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ room_id: id }) => ({
                type: "room" as const,
                id,
              })),
              "room",
            ]
          : ["room"],
    }),
    readRoom: builder.query<BizRoom, IDType>({
      query: (arg) => roomUrls.one + arg,
      transformResponse: extractResp,
      providesTags: (result, _error, arg) =>
        result ? [{ type: "room", id: arg }] : [],
    }),
    createRoom: builder.mutation<IDType, RoomPayload>({
      query: (arg) => ({
        url: roomUrls.list,
        method: "POST",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["room"] : []),
    }),
    updateRoom: builder.mutation<IDType, RoomPayload & { id: IDType }>({
      query: (arg) => ({
        url: roomUrls.one + arg.id,
        method: "PUT",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "room", id: arg.id }] : [],
    }),
    patchRoom: builder.mutation<IDType, Partial<RoomPayload> & { id: IDType }>({
      query: (arg) => ({
        url: roomUrls.one + arg.id,
        method: "PATCH",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "room", id: arg.id }] : [],
    }),
    deleteRoom: builder.mutation<IDType, IDType>({
      query: (arg) => ({
        url: roomUrls.one + arg,
        method: "DELETE",
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["room"] : []),
    }),
    readShelves: builder.query<Paged<BizShelf>, QParam>({
      query: (arg) => ({
        url: shelfUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ shelf_id: id }) => ({
                type: "shelf" as const,
                id,
              })),
              "shelf",
            ]
          : ["shelf"],
    }),
    readShelf: builder.query<BizShelf, IDType>({
      query: (arg) => shelfUrls.one + arg,
      transformResponse: extractResp,
      providesTags: (result, _error, arg) =>
        result ? [{ type: "shelf", id: arg }] : [],
    }),
    createShelf: builder.mutation<IDType, ShelfPayload>({
      query: (arg) => ({
        url: shelfUrls.list,
        method: "POST",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["shelf"] : []),
    }),
    updateShelf: builder.mutation<IDType, ShelfPayload & { id: IDType }>({
      query: (arg) => ({
        url: shelfUrls.one + arg.id,
        method: "PUT",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "shelf", id: arg.id }] : [],
    }),
    patchShelf: builder.mutation<
      IDType,
      Partial<ShelfPayload> & { id: IDType }
    >({
      query: (arg) => ({
        url: shelfUrls.one + arg.id,
        method: "PATCH",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "shelf", id: arg.id }] : [],
    }),
    deleteShelf: builder.mutation<IDType, IDType>({
      query: (arg) => ({
        url: shelfUrls.one + arg,
        method: "DELETE",
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["shelf"] : []),
    }),
    readItems: builder.query<Paged<BizItem>, QParam>({
      query: (arg) => ({
        url: itemUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ item_id: id }) => ({
                type: "item" as const,
                id,
              })),
              "item",
            ]
          : ["item"],
    }),
    readItem: builder.query<BizItem, IDType>({
      query: (arg) => itemUrls.one + arg,
      transformResponse: extractResp,
      providesTags: (result, _error, arg) =>
        result ? [{ type: "item", id: arg }] : [],
    }),
    createItem: builder.mutation<IDType, ItemPayload>({
      query: (arg) => ({
        url: itemUrls.list,
        method: "POST",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["item"] : []),
    }),
    updateItem: builder.mutation<IDType, ItemPayload & { id: IDType }>({
      query: (arg) => ({
        url: itemUrls.one + arg.id,
        method: "PUT",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "item", id: arg.id }] : [],
    }),
    patchItem: builder.mutation<IDType, Partial<ItemPayload> & { id: IDType }>({
      query: (arg) => ({
        url: itemUrls.one + arg.id,
        method: "PATCH",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result, _error, arg) =>
        result ? [{ type: "item", id: arg.id }] : [],
    }),
    deleteItem: builder.mutation<IDType, IDType>({
      query: (arg) => ({
        url: itemUrls.one + arg,
        method: "DELETE",
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["item"] : []),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useReadRoomsQuery,
  useReadRoomQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useReadShelvesQuery,
  useReadShelfQuery,
  useCreateShelfMutation,
  useUpdateShelfMutation,
  useDeleteShelfMutation,
  useReadItemsQuery,
  useReadItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = api;
