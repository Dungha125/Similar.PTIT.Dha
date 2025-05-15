import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {base,current} from "./base";

export const departmentApi = createApi({
    tagTypes: ['Department','Subject'],
    reducerPath: 'departmentApi',
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

        getDepartmentData: builder.query({
            query: ({branchID}) => `/branches/${branchID}/department`,
            providesTags: [{type: 'Department', id: 'LIST'}],
        }),

        addDepartment: builder.mutation({
            query: ({branchID, post}) => ({
                url: `/branches/${branchID}/department`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: (_, error, {departmentID}) =>
                error ? [] : [{type: 'Department', id: 'LIST'}],
        }),
        // assignSubjectToDepartment: builder.mutation({
        //     query: ({branchID, departmentID, subjectID}) => ({
        //         url: `/branch/${branchID}/department/${departmentID}/subject`,
        //         method: 'POST',
        //         body: ({departmentID, subjectID}),
        //     }),
        //     invalidatesTags: (_, error,{departmentID}) => {
        //         console.log("Invalidating Subject LIST", {error, departmentID});
        //         return error ? [] : [{type: 'Subject', id: 'LIST'}]
        //     }
        // }),


        updateDepartment: builder.mutation({
            query: ({branchID, departmentID, ...patch}) => ({
                url: `/branches/${branchID}/department/${departmentID}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_, error, {departmentID}) =>
                error ? [] : [{type: 'Department', id: 'LIST'}, {type: 'Subject', id: 'LIST'}],
        }),
        deleteDepartment: builder.mutation({
                query: ({branchID, departmentID}) => ({
                    url: `/branches/${branchID}/department/${departmentID}`,
                    method: 'DELETE',
                }),
                invalidatesTags: (_, error, {departmentID}) =>
                    error ? [] : [{type: 'Department', id: 'LIST'}],
            }
        ),

    }),
});

export const {
    useGetDepartmentDataQuery,
    useAddDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
} = departmentApi;

