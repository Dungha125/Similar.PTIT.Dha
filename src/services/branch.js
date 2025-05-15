import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {base,current} from "./base";


export const branchApi = createApi({
    tagTypes: ['Branch'],
    reducerPath: 'branchApi',
    baseQuery: fetchBaseQuery({
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
        getBranchData: builder.query({
            query: () => `/branches`,
            providesTags: [{type: 'Branch', id: 'LIST'}],

        }),
        getBranchIdData: builder.query({
            query: (branchID) => `/branches/${branchID}`,
            // providesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        getBranchIdUserData: builder.query({
            query: (branchID) => `/branches/${branchID}/user`,
            // providesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        getBranchIdSuggestUserData: builder.query({
            query: (branchID) => `/branches/${branchID}/suggest-user`,
            // providesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        addBranch: builder.mutation({
            query: (post) => ({
                url: `/branch`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        addBranchIdUser: builder.mutation({
            query: ({branchID,post}) => ({
                url: `/branch/${branchID}/user`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        updateBranch: builder.mutation({
            query: ({branchID, ...patch}) => ({
                url: `/branch/${branchID}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: [{type: 'Branch', id: 'LIST'}],
        }),
        deleteBranch: builder.mutation({
            query: (branchID) => ({
                url: `/branch/${branchID}/user`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Branch', id: 'LIST'}],
        }),
    }),
});

export const {
    useGetBranchDataQuery,
    useGetBranchIdDataQuery,
    useGetBranchIdUserDataQuery,
    useGetBranchIdSuggestUserDataQuery,
    useAddBranchMutation,
    useUpdateBranchMutation,
    useDeleteBranchMutation
} = branchApi;