import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {useToast} from "../../../../Sponsor/Toast/useToast";
import DuckIcon from "duckicon";
import {Logger} from "sass";

export const ZipInput = forwardRef(({
                                        setFileToUpload,
                                        min_similarity_percent,
                                        setMin_similarity_percent
                                    }, ref) => {
    const [filePreview, setFilePreview] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUpload] = useState(false);
    const toast = useToast();
    const [progressValue, setProgressValue] = useState(0);
    const onXClick = () => {
        setLoading(false);
        setUpload(false);
        setProgressValue(0);
        setFilePreview(null);
        setFile(null)
        setError(false)
    };
    const handleClearClick = () => {
        inputRef.current.value = null;
        setFile(null);
        setFilePreview(null);
        setFileToUpload(null);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0]; // Chỉ lấy file đầu tiên
        setError(false);

        if (!selectedFile) return;

        if (selectedFile.type !== "application/zip" && !selectedFile.name.endsWith(".zip")) {
            setError("Chỉ chấp nhận file .zip");
            return;
        }

        const preview = URL.createObjectURL(selectedFile);
        setFilePreview(preview);
        setFileToUpload(selectedFile);
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setError(false);

        const droppedFile = e.dataTransfer.files[0]; // Chỉ lấy file đầu tiên

        if (!droppedFile) return;

        if (droppedFile.type !== "application/zip" && !droppedFile.name.endsWith(".zip")) {
            setError("Chỉ chấp nhận file .zip");
            return;
        }

        const preview = URL.createObjectURL(droppedFile);
        setFilePreview(preview);
        setFileToUpload(droppedFile);
        setFile(droppedFile);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    useImperativeHandle(ref, () => ({
        clearFile
    }));

    const clearFile = () => {
        setFilePreview(null);
        setFile(null);
    };

    return (
        <>


            <div className="field p">
                <div className="label  ">
                    <div className="text-xs">
                       Tải lên tệp
                    </div>
                </div>
                <div
                    className={`form-folder-upload ${filePreview ? "has-file" : ""}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        accept=".zip"
                        type="file"
                        className="input-file-upload"
                        onClick={handleClearClick}
                        onChange={handleChange}
                    />


                    {filePreview === null ? (
                        <>
                            <label className="label-file-upload">
                                <div className={"is-center vertical"}>
                                    <p>Tải lên tệp ZIP hoặc thả file vào đây</p>
                                    <p className="upload-button text-primary" onClick={onButtonClick}>Chọn tệp</p>
                                </div>
                            </label>
                            <div className="is-flex jt-between p-s">
                                <p className={"text-xs text-disable"}>Hỗ trợ file/*.pdf</p>
                                <p className={"text-xs text-disable"}>Dung lượng tối đa 100MB</p>
                            </div>
                        </>
                    ) : (
                        <div className={`file-upload ${loading ? 'on-upload' : ""}`}>
                            {uploaded === false && <div className="loading"></div>}
                            <div className="border bg-hover-light p-l is-flex align-center gap-m animate-DFJ">
                                <div className="size-xxl border is-center ">
                                    <DuckIcon icon={"document"} className={"text-xxl"}></DuckIcon>
                                </div>
                                <div className="is-flex vertical align-start ">
                                    <p className={"title-m"}>{file?.name}</p>
                                    <p className={"text-s text-disable"}>{Math.floor(file?.size / (1024 * 10.24)) / 100} MB</p>
                                    {loading &&
                                        <div className="progress-container animate-SJF">
                                            <div style={{width: `${progressValue}%`}} className="progress-bar"
                                                 id="progress-bar"></div>
                                        </div>}
                                </div>
                            </div>
                            <div className="control-file-upload is-flex  gap-s">
                                <div onClick={onButtonClick} title={"click to change file"}
                                     className=" btn rounded  btn-s is-center   p-s  ">
                                    <DuckIcon className="text-l text-light " icon="rotate"></DuckIcon>
                                </div>
                                <div onClick={onXClick} title={"delete it!"}
                                     className="btn  btn-s  rounded is-center   p-s  ">
                                    <DuckIcon className="text-l   " icon="close"></DuckIcon>
                                </div>
                            </div>

                        </div>

                    )}

                    {error && <p className="text-xs text-secondary">{error}</p>}
                </div>
            </div>
            <div className="slider-container   field">
                <div className="label  ">
                    <div className="text-xs">
                    Ngưỡng kiểm tra
                    </div>
                </div>
                <input
                    type="range"
                    min={0}
                    max={10}
                    value={min_similarity_percent}
                    onChange={(e) => {
                        const newValue = Number(e.target.value);
                        setMin_similarity_percent(newValue); // Cập nhật state cha
                        console.log(min_similarity_percent)

                    }}
                    style={{border: "0px"}}
                    className="slider is-fill-x"
                />
                <div className="is-flex jt-between  " style={{padding: "0px 12px "}}>
                    {[...Array(11)].map((_, i) => {
                        const displayValue = i * 10 % 20 ? "'" : i * 10;
                        const isActive = i === min_similarity_percent;

                        return (
                            <div
                                key={i}
                                className={`size-x-m  text-center  text-xs ${isActive ? "text-semi text-primary" : ""}`}
                            >
                                {isActive ? i * 10 : displayValue}
                            </div>
                        );
                    })}
                </div>
                <div className=" mt-s p-s ">
                    <div className="text-xs text-disable">
                        Liệt kê tất cả các tệp có độ tương đồng cao hơn ngưỡng này
                    </div>
                </div>
            </div>

        </>
    );
});
