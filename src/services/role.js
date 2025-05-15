import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {base,current} from "./base";


export const roleApi = createApi({
    reducerPath: 'roleApi',
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
        getRole: builder.query({
            query: () => ({
                url: '/role',
                method: 'GET',
            }),
            providesTags: [{type: 'Role', id: 'LIST'}],
        }),
        getListRole: builder.query({
            query: () => ({
                url: '/list',
                method: 'GET',
            }),
            providesTags: [{type: 'Role', id: 'LIST'}],
        }),
        checkPermissions: builder.mutation({
            query: ({ userID, routes }) => ({
                url: '/check-permissions',
                method: 'POST',
                body: {
                    userID,
                    routes,
                },
            }),
            invalidatesTags: [{ type: 'Permission', id: 'LIST' }],
        }),
        addRole: builder.mutation({
            query: ({roleData}) => ({
                url: '/role',
                method: 'POST',
                body: roleData,
            }),
            invalidatesTags: [{type: 'Role', id: 'LIST'}],
        }),
        updateRole: builder.mutation({
            query: ({roleData}) => ({
                url: '/role',
                method: 'PATCH',
                body: roleData,
            }),
            invalidatesTags: [{type: 'Role', id: 'LIST'}],
        }),
        assignUserToRole: builder.mutation({
            query: ({userID, role}) => ({
                url: '/role/assign',
                method: 'POST',
                body: JSON.stringify({role,userID }),
            }),
            invalidatesTags: [{type: 'Role', id: 'LIST'}],
        }),
        removeUserFromRole: builder.mutation({
            query: ({userID, role}) => ({
                url: '/role/remove',
                method: 'POST',
                body: JSON.stringify({role,userID }),
            }),
            invalidatesTags: [{type: 'Role', id: 'LIST'}],
        }),
    }),
});

export const {
    useGetRoleQuery,
    useGetListRoleQuery,
    useAddRoleMutation,
    useUpdateRoleMutation,
    useCheckPermissionsMutation,
    useAssignUserToRoleMutation,
    useRemoveUserFromRoleMutation,
}= roleApi;