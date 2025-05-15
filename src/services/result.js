import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseService} from "./base";

// Tạo baseQuery riêng cho plagiarism API
const plagiarismBaseQuery = fetchBaseQuery({
    baseUrl: baseService,
    headers: {
        accept: "application/json",
    },
});

export const plagiarismApi = createApi({
    tagTypes: ['plagiarism'],
    reducerPath: "plagiarismApi",
    baseQuery: plagiarismBaseQuery,
    endpoints: (builder) => ({
        checkPlagiarism: builder.mutation({
            query: ({subjectID, fileID, fileName}) => ({
                url: `/plagiarism_checker_details/?subject_id=${subjectID}&file_id=${fileID}&file_name=${fileName}`,
                method: "POST",
            }),
            providesTags: [{type: 'plagiarism', id: 'LIST'}],
        }),
        uploadZipFile: builder.mutation({
            query: ({file,timestamp,min_similarity_percent}) => {
                const formData = new FormData();
                formData.append("file", file);
                return{
                    url: `/find_pair_similar_docs/${timestamp}&min_similarity_percent=${min_similarity_percent}`,
                    method: "POST",
                    body: formData
                }
            },
            invalidatesTags: [{type: 'plagiarism', id: 'LIST'}],
        })
    }),
});

export const {
    useCheckPlagiarismMutation,
    useUploadZipFileMutation
} = plagiarismApi;
