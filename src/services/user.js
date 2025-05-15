import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {base,current} from './base';

export const userApi = createApi({
    reducerPath: 'userApi',
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
        getUserInBranch: builder.query({
            query: ({branchID}) => ({
                url: `/branches/${branchID}/user`,
                method: 'GET',
            }),
            providesTags: [{type: 'User', id: 'LIST'}],
        }),
        getAllUsers: builder.query({
            query: ({ role = 'all', name = 'all', status = 'all', page = 1, pageSize = 10 }) => ({
                url: '/user',
                params: { role, fileName: name, status, page, pageSize },
            }),
        }),
        suggestUser: builder.query({
            query: ({branchID, username}) => ({
                url: `/branches/${branchID}/suggest-user`,
                method: 'GET',
                params: {username},
            }),
        }),
        assignUserToBranch: builder.mutation({
            query: ({branchID, userID}) => ({
                url: `/branches/${branchID}/user`,
                method: 'POST',
                body: JSON.stringify({branchID, userID}),
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
        }),
        unassignUserToBranch: builder.mutation({
            query: ({branchID, userID}) => ({
                url: `/branches/${branchID}/user`,
                method: 'DELETE',
                body: JSON.stringify({branchID, userID}),
            }),
            invalidatesTags: [{type: 'User', id: 'LIST'}],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserInBranchQuery,
    useSuggestUserQuery,
    useAssignUserToBranchMutation,
    useUnassignUserToBranchMutation,
} = userApi;