import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import DuckIcon from "duckicon";
import {useToast} from "../../../../Sponsor/Toast/useToast";
import {useGetPreSignUrlMutation, usePostFilesMutation} from "../../../../services/file";

const FolderInput = forwardRef(({setFileToUpload,subject}, ref) => {
    const [filePreviews, setFilePreviews] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploaded, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progressValues, setProgressValues] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const toast = useToast();
    const [postRequest] = useGetPreSignUrlMutation();
    const [response, setResponse] = useState(null);
    const [postFiles,isLoading:postFileLoading,isFetching:postFileFetching] = usePostFilesMutation(); // Khai
    const handleClearClick = () => {
        inputRef.current.value = null;
    };

    const handleChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setError(false);

        const validFiles = selectedFiles.filter(file =>
            file.type === "application/pdf" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        if (validFiles.length > 0) {
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setFilePreviews([...filePreviews, ...newPreviews]);
            setFileToUpload([...filePreviews, ...newPreviews])
            setFiles([...files, ...validFiles]);
            setUpload(false); // Reset upload state
        } else {
            setError("Please select PDF or DOCX files.");
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
        const droppedFiles = Array.from(e.dataTransfer.files);

        const validFiles = droppedFiles.filter(file =>
            file.type === "application/pdf" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        if (validFiles.length > 0) {
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setFilePreviews([...filePreviews, ...newPreviews]);
            setFileToUpload([...filePreviews, ...newPreviews])
            setFiles([...files, ...validFiles]);
        } else {
            setError("Please drop PDF or DOCX files.");
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const onXClick = (index) => {
        const newFiles = [...files];
        const newPreviews = [...filePreviews];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setFiles(newFiles);
        setFilePreviews(newPreviews);
        setFileToUpload(newPreviews)
        setUpload(false);
    };
    useImperativeHandle(ref, () => ({
        uploadFiles,clearFile
    }));
    const clearFile = () => {
        setFilePreviews([]);
        setFiles([]);
        setUpload(false);
        setProgressValues({});
    }
    const uploadFiles = async () => {
        const fileData = files.map(file => ({
            fileName: file.name,
            fileSize: file.size,
        }));

        try {
            // Gọi API để lấy danh sách URL presigned
            const result = await postRequest({
                subjectID: subject,
                files: fileData,
            }).unwrap();

            if (!result || result.length === 0) {
                toast.error("Failed to get presigned URLs");
                return;
            }

            // Danh sách các file đã upload
            const uploadedFiles = [];

            // Duyệt qua từng file và URL tương ứng để tải lên S3
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const presignedUrlData = result[i];
                console.log("file name", file.name);

                try {
                    const uploadResponse = await fetch(presignedUrlData.url, {
                        method: 'PUT', // phương thức PUT
                        body: file,
                        mode: 'cors',
                        redirect: 'follow',
                    });

                    if (!uploadResponse.ok) {
                        throw new Error(`Failed to upload ${file.name}`);
                    }

                    // Thêm thông tin file vào danh sách đã upload
                    uploadedFiles.push({
                        filename: file.name,
                        filepath: presignedUrlData.fileURL // Sử dụng fileURL từ presigned URL
                    });
                } catch (uploadError) {
                    toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
                }
            }

            // Sau khi tải lên thành công, gửi thông tin file về server
            if (uploadedFiles.length > 0) {
                console.log("uploadedFiles", uploadedFiles);
                try {
                    const res = await postFiles({subjectID:subject, files:uploadedFiles}); // Gọi API để gửi thông tin file
                    if (res) {
                        toast.success('Files uploaded and posted to server successfully!');
                    }
                } catch (err) {
                    toast.error("Failed to post files to server: " + err.message);
                }
            }

            // Cập nhật trạng thái
            setResponse(result);
            clearFile(); // Dọn dẹp file đã chọn
        } catch (err) {
            toast.error("Failed to upload file: " + err.message);
        }
    };


    return (
        <div className="field p-x">
            <div
                className={`form-folder-upload ${filePreviews.length === 0 ? "" : "has-file"} ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    accept=".doc, .docx,.pdf"
                    type="file"
                    className="input-file-upload"
                    multiple
                    onClick={handleClearClick}
                    onChange={handleChange}
                ></input>

                <label
                    htmlFor="input-file-upload"
                    className={`label-file-upload`}
                >
                    <div className={` gap-xs`}>
                        <DuckIcon className="text-xl text-sliver" icon="add"></DuckIcon>
                        {isDragging ? <p>Drop here</p> : <>
                            <p>Tải lên tài liệu</p>
                            <p className="upload-button text-center text-primary" onClick={onButtonClick}>Browse</p>
                        </>}
                    </div>
                </label>
                {filePreviews.length !== 0 && <div className={"list-file-upload is-flex vertical gap-m "}>

                    {filePreviews.map((preview, index) => (
                        <div key={index} className={`file-upload  ${loading ? 'on-upload' : ""}`}>
                            <div className="border bg-hover-light p-s is-flex align-center gap-m animate-DFJ">
                                <div className="size-xxl is-center border">
                                    <DuckIcon icon={"document"} className={"text-xxl"}></DuckIcon>
                                </div>
                                <div className="is-flex vertical align-start">
                                    <p className={"title-m"}>{files[index].name}</p>
                                    <p className={"text-s text-disable"}>{Math.floor(files[index].size / (1024 * 10.24)) / 100} MB</p>
                                    {loading &&
                                        <div className="progress-container animate-SJF">
                                            <div style={{width: `${progressValues[files[index].name] || 0}%`}}
                                                 className="progress-bar"
                                                 id="progress-bar"></div>
                                        </div>}
                                </div>
                            </div>
                            <div className="control-file-upload is-flex gap-s">
                                <div onClick={() => onXClick(index)} title={"delete it!"}
                                     className="btn btn-s rounded is-center p-s">
                                    <DuckIcon className="text-l" icon="close"></DuckIcon>
                                </div>
                            </div>
                        </div>
                    ))
                    }</div>}
                {error &&
                    <p className={"text-xs text-secondary text-left px-xs"}>{error}</p>
                }
            </div>
            {/*{filePreviews.length > 0 ? (*/}
            {/*    <div className="is-flex jt-end">*/}

            {/*        <div onClick={uploadFiles} className="btn">*/}
            {/*            {loading ? "Uploading..." : "UploadPage"}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*) : null}*/}
        </div>
    );
});

export default FolderInput;
