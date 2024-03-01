import { api } from "./index";
import { BatchResult, IDType, Paged, QParam } from "../utils/types";
import { extractResp } from "../utils/transformer";

const roomUrls = {
  list: "/rooms",
  one: "/rooms/",
};

export type RoomPayload = Omit<BizRoom, "room_id">;
export type BizRoom = {
  room_id: IDType;
  name: string;
  description?: string;
};
const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    readAllRooms: builder.query<BizRoom[], null>({
      query: () => ({
        url: roomUrls.list,
        params: { all: true },
      }),
      transformResponse: extractResp,
      providesTags: (result) => (result ? [{ type: "room", id: "LIST" }] : []),
    }),
    readRooms: builder.query<Paged<BizRoom>, QParam>({
      query: (arg) => ({
        url: roomUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) => (result ? [{ type: "room", id: "LIST" }] : []),
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
    deleteRooms: builder.mutation<BatchResult, IDType[]>({
      query: (arg) => ({
        url: roomUrls.list,
        method: "DELETE",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: (result) => (result ? ["item"] : []),
    }),
  }),
});

export const {
  useReadAllRoomsQuery,
  useReadRoomsQuery,
  useReadRoomQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useDeleteRoomsMutation,
} = extendedApi;
