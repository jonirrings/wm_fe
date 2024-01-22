import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {apiPrefix, TOKEN} from "../utils/constants.ts";

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: apiPrefix,
        timeout: 180 * 1000,
        prepareHeaders: headers => {
            const token = localStorage.getItem(TOKEN) || '';
            headers.append('Authorization', `Bearer ${token}`);
        },
    }),
    tagTypes: [],
    endpoints: builder => ({})
});
