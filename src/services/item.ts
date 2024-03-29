import { api } from "./index";
import { BatchResult, IDType, Paged, QParam } from "../utils/types";
import { extractResp } from "../utils/transformer";

const itemUrls = {
  list: "/items",
  one: "/items/",
};

export type ItemPayload = Omit<BizItem, "item_id">;

export type BizItem = {
  item_id: IDType;
  name: string;
  sn: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    readAllItems: builder.query<BizItem[], null>({
      query: () => ({
        url: itemUrls.list,
        params: { all: true },
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result && result.length
          ? result.map((r) => ({ type: "item", id: r.item_id }))
          : ["item"],
    }),
    readItems: builder.query<Paged<BizItem>, QParam>({
      query: (arg) => ({
        url: itemUrls.list,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: (result) =>
        result && result.data.length
          ? result.data.map((r) => ({ type: "item", id: r.item_id }))
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
      invalidatesTags: ["item"],
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
      invalidatesTags: ["item"],
    }),
    deleteItems: builder.mutation<BatchResult, IDType[]>({
      query: (arg) => ({
        url: itemUrls.list,
        method: "DELETE",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["item"],
    }),
  }),
});

export const {
  useReadItemsQuery,
  useReadItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useDeleteItemsMutation,
} = extendedApi;
