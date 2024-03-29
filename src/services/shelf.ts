import { api } from "./index";
import { BatchResult, IDType, Paged, QParam } from "../utils/types";
import { extractResp } from "../utils/transformer";

const shelfUrls = {
  list: "/shelf",
  one: "/shelf/",
};

export type ShelfPayload = Omit<BizShelf, "shelf_id">;
export type BizShelf = {
  shelf_id: IDType;
  name: string;
  layer: number;
  room_id: IDType;
  created_at: string;
  updated_at?: string;
};

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    readAllShelves: builder.query<BizShelf[], null>({
      query: () => ({
        url: shelfUrls.list,
        params: { all: true },
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result && result.length
          ? result.map((r) => ({ type: "shelf", id: r.shelf_id }))
          : ["shelf"],
    }),
    readShelves: builder.query<Paged<BizShelf>, QParam & { room_id?: IDType }>({
      query: (arg) => ({
        url: shelfUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result && result.data.length
          ? result.data.map((r) => ({ type: "shelf", id: r.shelf_id }))
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
      invalidatesTags: ["shelf"],
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
      invalidatesTags: ["shelf"],
    }),
    deleteShelves: builder.mutation<BatchResult, IDType[]>({
      query: (arg) => ({
        url: shelfUrls.list,
        method: "DELETE",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["item"],
    }),
  }),
});

export const {
  useReadShelvesQuery,
  useReadShelfQuery,
  useCreateShelfMutation,
  useUpdateShelfMutation,
  useDeleteShelfMutation,
  useDeleteShelvesMutation,
} = extendedApi;
