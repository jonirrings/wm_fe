import { api } from "./index";
import { IDType, Paged, QParam, Result } from "../utils/types";
import { extractResp } from "../utils/transformer";

const stockUrls = {
  stock: "/stock",
  deposit: "/stock/deposit",
  withdraw: "/stock/withdraw",
  transfer: "/stock/transfer",
  convert: "/stock/convert",
};

type BizItemsInRoom = {
  item_id: IDType;
  room_id: IDType;
  count: number;
  children: BizItemsOnShelf[];
};

type BizItemsOnShelf = {
  item_id: IDType;
  shelf_id: IDType;
  count: number;
};
type BizTransferPayload = {
  shelf_from: IDType;
  shelf_to: IDType;
  item_id: IDType;
  count: number;
};
type BizConvertPayload = {
  from: BizItemsOnShelf[];
  into: BizItemsOnShelf[];
};

const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStock: builder.query<Paged<BizItemsInRoom>, QParam>({
      query: (arg) => ({
        url: stockUrls.stock,
        params: arg,
      }),
      transformResponse: extractResp,
      providesTags: ["stock"],
    }),
    incStock: builder.mutation<Result<null>, BizItemsOnShelf>({
      query: (arg) => ({
        url: stockUrls.deposit,
        method: "POST",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["stock"],
    }),
    decStock: builder.mutation<Result<null>, BizItemsOnShelf>({
      query: (arg) => ({
        url: stockUrls.withdraw,
        method: "DELETE",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["stock"],
    }),
    transStock: builder.mutation<Result<null>, BizTransferPayload>({
      query: (arg) => ({
        url: stockUrls.withdraw,
        method: "PATCH",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["stock"],
    }),
    convStock: builder.mutation<Result<null>, BizConvertPayload>({
      query: (arg) => ({
        url: stockUrls.convert,
        method: "PATCH",
        body: arg,
      }),
      transformResponse: extractResp,
      invalidatesTags: ["stock"],
    }),
  }),
});
export const {
  useGetStockQuery,
  useIncStockMutation,
  useDecStockMutation,
  useTransStockMutation,
  useConvStockMutation,
} = extendedApi;
