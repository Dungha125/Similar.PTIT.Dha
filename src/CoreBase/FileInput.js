import React, { useRef, useState } from "react";
import DuckIcon from "duckicon";
import { useCreateCheckerSubjectIdFilesMutation, useGetPreSignCheckerUrlMutation } from "../services/fileChecker";
import { useToast } from "../Sponsor/Toast/useToast";
import { useCheckPlagiarismMutation } from "../services/result";

const FileInput = ({ bigSize, smallSize, handleAdd }) => {
    const [filePreview, setFilePreview] = useState();
    const [file, setFile] = useState([]);
    const [uploaded, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const [postRequest] = useGetPreSignCheckerUrlMutation();
    const [postCheckerFiles] = useCreateCheckerSubjectIdFilesMutation();
    const toast = useToast();
    const [checkPlagiarism] = useCheckPlagiarismMutation();

    const handleClearClick = () => {
        inputRef.current.value = null;
    };

    const handleChange = (e) => {
        console.log("handleChange triggered");
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            console.log("Không có file nào được chọn");
            return;
        }

        console.log("Selected file:", selectedFile);
        setError(false);

        if (
            selectedFile.type === "application/pdf" ||
            selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            setFilePreview(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
            setUpload(false);

            setTimeout(() => {
                inputRef.current.value = null;
            }, 0);
        } else {
            setError("Please select a PDF or DOCX file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setError(false);
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (
            droppedFile &&
            (droppedFile.type === "application/pdf" ||
                droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setFilePreview(URL.createObjectURL(droppedFile));
            setFile(droppedFile);
        } else {
            setError("Please drop a PDF or DOCX file.");
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const onXClick = () => {
        setLoading(false);
        setUpload(false);
        setProgressValue(0);
        setFilePreview(undefined);
        setFile(undefined);
        setError(false);
    };

    const uploadFile = async () => {
        if (!file) {
            setError("No file selected for upload.");
            return;
        }
        console.log("postRequest function:", file);
        setLoading(true);
        setProgressValue(0);

        const newFile = {
            filename: file.name,
            filesize: file.size,
        };

        try {
            console.log("Calling postRequest...");
            const result = await postRequest({
                subjectID: "23bc6d5f-b05e-4d1f-95d6-1e5f3e8a8f11",
                files: [newFile],
            }).unwrap();
            console.log("Mutation result:", result);

            if (!result || result.length === 0) {
                toast.error("Failed to get presigned URLs");
                setLoading(false);
                return;
            }

            const presignedUrlData = result[0];

            try {
                console.log("Uploading file to S3...");
                await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("PUT", presignedUrlData.url, true);
                    xhr.setRequestHeader("Content-Type", file.type);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = (event.loaded / event.total) * 100;
                            setProgressValue(Math.round(percentComplete));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve();
                        } else {
                            reject(new Error(`Failed to upload ${file.name}`));
                        }
                    };

                    xhr.onerror = () => reject(new Error("Network error during upload"));
                    xhr.send(file);
                });

                console.log("File uploaded successfully!");

                const uploadedFiles = [
                    {
                        filename: newFile.filename,
                        filepath: presignedUrlData.fileURL,
                    },
                ];

                console.log("uploadedFiles", uploadedFiles);
                const res = await postCheckerFiles({
                    subjectID: "23bc6d5f-b05e-4d1f-95d6-1e5f3e8a8f11",
                    files: uploadedFiles,
                });

                if (res && Array.isArray(res.data)) {
                    console.log("UploadPage Success:", res.data);

                    // Lấy thông tin file vừa upload từ res.data
                    const uploadedFileInfo = res.data[0]; // File vừa upload

                    setLoading(false);
                    setFilePreview(undefined);
                    setUpload(false);
                    setProgressValue(0);
                    setFile(undefined);
                    setError(false);
                    toast.success("Files uploaded successfully!");

                    // Gọi handleAdd với thông tin đầy đủ của file vừa upload
                    handleAdd(uploadedFileInfo);

                    setTimeout(async () => {
                        await Promise.all(
                            res.data.map(async (file) => {
                                try {
                                    const plagiarismRes = await checkPlagiarism({
                                        subjectID: file.subject_id,
                                        fileID: file.id,
                                        fileName: file.filename,
                                    }).unwrap();

                                    console.log(`Plagiarism Check Result for ${file.filename}:`, plagiarismRes);
                                    toast.success(`Plagiarism check completed for ${file.filename}`);
                                } catch (plagiarismErr) {
                                    console.error(`Error checking plagiarism for ${file.filename}:`, plagiarismErr);
                                    toast.error(`Failed to check plagiarism for ${file.filename}`);
                                }
                            })
                        );
                    }, 2000);
                }
            } catch (uploadError) {
                console.error("UploadPage Error:", uploadError);
                toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            setUpload(false);
            setProgressValue(0);
            setError(false);
            toast.error("Failed to upload file: " + error.message);
        }
    };

    return (
        <div className="field gapy-s bg-white ">
            <style>
                {`
                    .progress-container {
                        width: 100%;
                        height: 8px;
                        background-color: #e0e0e0;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-top: 8px;
                    }
                    .progress-bar {
                        height: 100%;
                        background: linear-gradient(90deg, #FF7925, #F66F1A);
                        transition: width 0.3s ease-in-out;
                    }
                    .file-upload.on-upload {
                        opacity: 0.9;
                        transition: opacity 0.3s ease;
                    }
                    .file-upload.on-upload .border {
                        transform: scale(1.02);
                        transition: transform 0.3s ease;
                    }
                `}
            </style>
            <div
                className={`form-file-upload ${filePreview === undefined ? "" : "has-file"} ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    accept=".doc,.docx,.pdf"
                    type="file"
                    className="input-file-upload"
                    multiple={false}
                    onClick={handleClearClick}
                    onChange={handleChange}
                />
                {filePreview === undefined ? (
                    <>
                        <label
                            htmlFor="input-file-upload"
                            className={`${bigSize ? "label-file-upload-l" : ""} label-file-upload ${smallSize ? "label-file-upload-s" : ""}`}
                        >
                            <div className={`${smallSize ? "is-flex align-center" : ""} gap-xs`}>
                                <DuckIcon className="text-xl text-sliver" icon="add" />
                                {isDragging ? (
                                    <p>Drop here</p>
                                ) : (
                                    <>
                                        <p>Chọn tài liệu để kiểm tra</p>
                                        <p className="upload-button text-primary" onClick={onButtonClick}>
                                            Chọn tệp tin
                                        </p>
                                    </>
                                )}
                            </div>
                        </label>
                        <div className="is-flex jt-between p-s">
                            <p className="text-xs text-disable">Hỗ trợ file/*.pdf</p>
                            <p className="text-xs text-disable">Dung lượng tối đa 12MB</p>
                        </div>
                    </>
                ) : (
                    <div className={`file-upload ${loading ? "on-upload" : ""}`}>
                        <div className="border bg-hover-light p-l is-flex align-center gap-m animate-DFJ">
                            <div className="size-xxl border is-center">
                                <DuckIcon icon="document" className="text-xxl" />
                            </div>
                            <div className="is-flex vertical align-start">
                                <p className="title-m">{file.name}</p>
                                <p className="text-s text-disable">
                                    {Math.floor(file.size / (1024 * 10.24)) / 100} MB
                                </p>
                                {loading && (
                                    <div className="progress-container">
                                        <div
                                            style={{ width: `${progressValue}%` }}
                                            className="progress-bar"
                                            id="progress-bar"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="control-file-upload is-flex gap-s">
                            <div
                                onClick={onButtonClick}
                                title="click to change file"
                                className="btn rounded btn-s is-center p-s"
                            >
                                <DuckIcon className="text-l text-light" icon="rotate" />
                            </div>
                            <div
                                onClick={onXClick}
                                title="delete it!"
                                className="btn btn-s rounded is-center p-s"
                            >
                                <DuckIcon className="text-l" icon="close" />
                            </div>
                        </div>
                    </div>
                )}
                {error && <p className="text-xs text-secondary text-left px-xs">{error}</p>}
            </div>
            {filePreview !== undefined ? (
                <div className="is-flex jt-end">
                    <div onClick={uploadFile} className="btn">
                        {loading ? `Uploading ${progressValue}%` : "Upload"}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FileInput;