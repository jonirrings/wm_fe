import { api } from "./index";
import { IDType, Paged, QParam } from "../utils/types";
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
};

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useReadShelvesQuery,
  useReadShelfQuery,
  useCreateShelfMutation,
  useUpdateShelfMutation,
  useDeleteShelfMutation,
} = extendedApi;
