import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {base,current} from "./base";


export const dashboardApi= createApi({
    tagTypes:['Dashboard'],
    reducerPath:'dashboardApi',
    baseQuery:fetchBaseQuery({
        baseUrl: `${base}/api`,
        credentials: 'include',
        responseHandler: (response) => {
            if (response.status === 401) {
                localStorage.removeItem('identity');
                window.location.href = `${current}/login`;
            }
            return response.json();
        },
    }),
    endpoints: (builder) => ({
        getDashboardData: builder.query({
            query: () => `/dashboard`,
            providesTags: [{type: 'Dashboard', id: 'LIST'}],
        }),
    })
})
export const {
    useGetDashboardDataQuery,
}= dashboardApi;
