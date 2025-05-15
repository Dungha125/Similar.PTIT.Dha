import {base,current} from "./base";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const checkerFileApi = createApi({
    tagTypes: ["FileChecker"], // 🔥 PHẢI KHAI BÁO tagTypes Ở ĐÂY
    reducerPath: 'fileCheckerApi',
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
        createCheckerSubjectIdFiles: builder.mutation({
            query: ({subjectID, files}) => ({
                url: `/checker/subjects/${subjectID}/files`,
                method: 'POST',
                body: files,
            }),
            invalidatesTags: [{type: 'FileChecker', id: 'LIST'}],
        }),
        deleteCheckerSubjectIDFilesFileID: builder.mutation({
            query: ({branchID, subjectID, fileID}) => ({
                url: `/checker/${subjectID}/files/${fileID}`,
                method: 'DELETE',
            }),
            // invalidatesTags: (_, error, {subjectID}) =>
            //     error ? [] : [{type: 'Subject', id: 'LIST'}],
        }),
        createCheckerFilesFileIdResult: builder.mutation({
            query: ({fileID, post}) => ({
                url: `/checker/files/${fileID}/result`,
                method: 'POST',
                body: post,
            }),
        }),
        updateCheckerFilesFileIdResult: builder.mutation({
            query: ({fileID, patch}) => ({
                url: `/checker/files/${fileID}/result`,
                method: 'PATCH',
                body: patch,
            }),
        }),
        deleteCheckerFilesFileIdResult: builder.mutation({
            query: ({fileID}) => ({
                url: `/checker/files/${fileID}/result`,
                method: 'DELETE',
            }),
        }),
        getCheckerFiles: builder.query({
            query: () => ({
                url: `/checker/files`,
            }),
        }),
        getCheckerFilesFileId: builder.query({
            query: (fileID) => ({
                url: `/checker/files/${fileID}`,
            }),
        }),
        createCheckerSubjectIdFilesUpload: builder.mutation({
            query: ({subjectID, post}) => ({
                url: `/checker/${subjectID}/checker-file/upload`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{ type: "FileChecker", id: "LIST" }],
        }),
        createCheckerSubjectIdFilesGet: builder.mutation({
            query: ({subjectID, post}) => ({
                url: `/checker/${subjectID}/files/get`,
                method: 'POST',
                body: post,
            }),
        }),
        getPreSignCheckerUrl: builder.mutation({
            query: ({subjectID, files}) => ({
                url: `/subjects/${subjectID}/checker-file/presign/upload`,
                method: 'POST',
                body: files, // ✅ Đóng files vào một object
            }),
            invalidatesTags: [{ type: "FileChecker", id: "LIST" }],
        }),
        getPreSignDownloadCheckerFileUrl:builder.mutation({
            query: ({subjectId, fileName}) => ({
                url: `/subjects/${subjectId}/checker-file/presign/download/${fileName}`,
                method: 'POST',
            }),
            // invalidatesTags: [{ type: "FileChecker", id: "LIST" }],
        }),
        getFileByUser:builder.query({
            query : ()=>({
                url: `/checker/files/get-all`,
            }),
            providesTags: [{ type: "FileChecker", id: "LIST" }],
        }),
        getFileStatus:builder.query({
            query : ({fileID})=>({
                url: `/checker/files/${fileID}/result`,
            }),
            invalidatesTags: [{ type: "FileChecker", id: "LIST" }],
        })
    }),
})
export const {
    useCreateCheckerSubjectIdFilesMutation,
    useDeleteCheckerSubjectIDFilesFileIDMutation,
    useCreateCheckerFilesFileIdResultMutation,
    useUpdateCheckerFilesFileIdResultMutation,
    useDeleteCheckerFilesFileIdResultMutation,
    useGetCheckerFilesQuery,
    useGetCheckerFilesFileIdQuery,
    useCreateCheckerSubjectIdFilesUploadMutation,
    useCreateCheckerSubjectIdFilesGetMutation,
    useGetPreSignCheckerUrlMutation,
    useGetPreSignDownloadCheckerFileUrlMutation,
    useGetFileByUserQuery,
    useGetFileStatusQuery
} = checkerFileApi;