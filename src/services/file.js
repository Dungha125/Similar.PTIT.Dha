import {base,current, s3endpoint} from "./base";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Extract components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format the date string
    return `${year}-${month}-${day}`;
}

//


export const fileApi = createApi({
    tagTypes: ['File'],
    reducerPath: 'fileApi',
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
        getFilesData: builder.query({
            query: ({
                        branchID,
                        subjectID,
                        departmentID,
                        fileName,
                        uploadBy,
                        page,
                        limit
                    }) =>`/files?subjectID=${subjectID}&depart=${departmentID}&fileName=${fileName}&uploadBy=${uploadBy}&page=${page}&limit=${limit}`,
            providesTags: [{type: 'File', id: 'LIST'}],
        }),
        addFile: builder.mutation({
            query: ({subjectID, post}) => ({
                url: `/subjects/${subjectID}/files`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: [{type: 'File', id: 'LIST'}],
        }),
        getPreSignUrl: builder.mutation({
            query: ({subjectID, files}) => ({
                url: `/subjects/${subjectID}/files/presign/upload`,
                method: 'POST',
                body: files,
            }),
        }),
        postFiles: builder.mutation({
            query: ({subjectID, files}) => ({
                url: `/subjects/${subjectID}/files`,
                method: 'POST',
                body: files,
            }),
        }),
    }),
})
export const S3FileAPI = createApi({
    reducerPath: 'S3FileAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: s3endpoint,
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
        uploadFile: builder.mutation({
            query: ({url, file}) => ({
                url: url,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/pdf',
                },
                body: file,
            }),
        }),
    }),
});
export const {
    useGetFilesDataQuery,
    useAddFileMutation,
    useGetPreSignUrlMutation,
    usePostFilesMutation,
} = fileApi;