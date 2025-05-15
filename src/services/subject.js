import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {base,current} from "./base";

export const subjectApi = createApi({
    tagTypes: ['Subject'],
    reducerPath: 'subjectApi',
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
        getSubjectData: builder.query({
            query: ({ branchID, departmentID }) => `/subjects?branchID=${branchID}&departID=${departmentID}`,
            providesTags: (result, error, { branchID, departmentID }) => {
                return [{ type: 'Subject', id: 'LIST' }];
            },
        }),
        getSuggestSubject: builder.query({
            query: ({subject,department}) => ({
                url: `/subjects/suggest`,
                method: 'GET',
                params: {subject,department},
            }),
            invalidatesTags: [{ type: "Subject", id: "LIST" }],
        }),
        addSubject: builder.mutation({
            query: ({ post}) => ({
                url: `/subjects`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        importSubjects: builder.mutation({
            query: ({ subjects}) => ({
                url: `/subjects/import`,
                method: 'POST',
                body: subjects,
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        updateSubject: builder.mutation({
            query: ({ subjectID, ...patch}) => ({
                url: `/subjects/${subjectID}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        deleteSubject: builder.mutation({
            query: ({ subjectID}) => ({
                url: `/subjects/${subjectID}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        getUserInSubject: builder.query({
            query: ({ subjectID}) => `/subject/${subjectID}/user`,
            providesTags: [{type: 'Subject', id: 'LIST'}],
        }),
        getDepartmentInSubject: builder.query({
            query: ({ subjectID}) => `/subjects/${subjectID}/department`,
            providesTags: [{type: 'Subject', id: 'LIST'}],
        }),
        assignUserToSubject: builder.mutation({
            query: ({ subjectID, userID}) => ({
                url: `/subjects/${subjectID}/user`,
                method: 'POST',
                body: JSON.stringify({subjectID,userID}),
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        removeUserFromSubject: builder.mutation({
            query: ({ subjectID, userID}) => ({
                url: `/subjects/${subjectID}/user`,
                method: 'DELETE',
                body: JSON.stringify({subjectID,userID}),
            }),
            invalidatesTags: (_, error, {subjectID}) =>
                error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),

        assignSubjectToDepartment: builder.mutation({
            query: ({branchID, departmentID, subjectIDs}) => ({
                url: `/branches/${branchID}/department/${departmentID}/subject`,
                method: 'POST',
                body: ({departmentID, subjectIDs}),
            }),
            invalidatesTags: (_, error,{departmentID}) => {
                console.log("Invalidating Subject LIST", {error, departmentID});
                return error ? [] : [{type: 'Subject', id: 'LIST'}]
            }
        }),
        importSubjectToDepartment: builder.mutation({
            query: ({branchID, data}) => ({
                url: `/branches/${branchID}/department/import`,
                method: 'POST',
                body:  JSON.stringify(data),
            }),
            invalidatesTags: (_, error,{branchID}) => {
                console.log("Invalidating Subject LIST", {error, branchID});
                return error ? [] : [{type: 'Subject', id: 'LIST'}]
            }
        }),
        removeSubjectFromDepartment: builder.mutation({
            query: ({branchID, departmentID, subjectID}) => ({
                url: `/branches/${branchID}/department/${departmentID}/subject`,
                method: 'DELETE',
                body: JSON.stringify({departmentID, subjectID}),
            }),
            invalidatesTags: (_, error, {departmentID}) =>
                error ? [] : [{type: 'Department', id: 'LIST'},{type: 'Branch', id: 'LIST'}, {type: 'Subject', id: 'LIST'}],
        }),
    }),
});

export const {
    useGetSubjectDataQuery,
    useGetSuggestSubjectQuery,
    useAddSubjectMutation,
    useImportSubjectsMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetUserInSubjectQuery,
    useGetDepartmentInSubjectQuery,
    useAssignUserToSubjectMutation,
    useRemoveUserFromSubjectMutation,
    useAssignSubjectToDepartmentMutation,
    useImportSubjectToDepartmentMutation,
    useRemoveSubjectFromDepartmentMutation
} = subjectApi;