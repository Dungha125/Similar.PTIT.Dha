import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {base,current} from "./base";


export const privateCheckLogApi = createApi({
    tagTypes: ['privateCheckLog'],
    reducerPath: 'privateCheckLog',
    baseQuery: fetchBaseQuery({
        baseUrl: `${base}/api`,
        credentials: 'include',
        responseHandler: (response) => {
            if (response.status === 401) {
                localStorage.removeItem('identity');
                window.location.href = `${current}/login`;
            }
            return response.json();
        }
    }),
    endpoints: (builder) => ({
        privateCheck: builder.mutation({
            query: (data) => ({
                url: "/private-check/",
                method: "POST",
                body: data,
            }),
        }),
        getLogs: builder.query({
            query: () => "/private-check/logs",
        }),
        checkStatusLog :builder.query({
            query:({logID})=>({
                url: `/private-check/${logID}/result`,
            }),
            providesTags: [{type: 'privateCheckLog', id: 'LIST'}],
        }),
        createLog: builder.mutation({
            query: (body) => ({
                url: "private-check/",
                method: "POST",
                body,
            }),
        })
    })
})
export const {
    useGetLogsQuery,
    usePrivateCheckMutation,
    useCheckStatusLogQuery,
    useCreateLogMutation
} = privateCheckLogApi