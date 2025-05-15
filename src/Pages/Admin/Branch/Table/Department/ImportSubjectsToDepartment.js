import React, {useEffect, useRef, useState} from "react";
import Papa from "papaparse";
import DuckIcon from "duckicon";
import {saveAs} from "file-saver";
import {useImportSubjectToDepartmentMutation} from "../../../../../services/subject";
import {useToast} from "../../../../../Sponsor/Toast/useToast";
import Modal from "../../../../../Sponsor/Slice/Modal";

const ImportSubjectsToDepartment: React.FC = ({data, branchID, modal, setModal}) => {
    const [file, setFile] = useState(null);
    const [importSubjects] = useImportSubjectToDepartmentMutation(); // RTK Query mutation
    const [err, setErr] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
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
        setErr(null)
    };
    useEffect(() => {
        if (!modal) {
            setLoading(false);
            setUpload(false);
            setProgressValue(0);
            setFilePreview(null);
            setFile(null)
            setError(false)
            setErr(null)
        }
    }, [modal])
    const handleClearClick = () => {
        inputRef.current.value = null;
        setFile(null);
        setFilePreview(null);
        // setFileToUpload(null);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0]; // Chỉ lấy file đầu tiên
        setError(false);

        if (!selectedFile) return;

        if (selectedFile.type !== "type/csv" && !selectedFile.name.endsWith(".csv")) {
            setError("Chỉ chấp nhận file .csv");
            return;
        }

        const preview = URL.createObjectURL(selectedFile);
        setFilePreview(preview);
        // setFileToUpload(selectedFile);
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

        if (droppedFile.type !== "type/csv" && !droppedFile.name.endsWith(".csv")) {
            setError("Chỉ chấp nhận file .csv");
            return;
        }

        const preview = URL.createObjectURL(droppedFile);
        setFilePreview(preview);
        // setFileToUpload(droppedFile);
        setFile(droppedFile);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };
    //



    const csvTemplate = data?.flatMap((item) => [
        {
            departmentID: item.id,
            department: item.name,
            subjectCode: "MATH101xx",
            name: "Calculus I"
        },
        {
            departmentID: item.id,
            department: item.name,
            subjectCode: "CHEM303xx",
            name: "Organic Chemistry"
        },
        {
            departmentID: item.id,
            department: item.name,
            subjectCode: "PHYS202xx",
            name: "Physics II"
        }
    ]);

    const handleDownloadCSV = () => {
        const csv = Papa.unparse(csvTemplate, {header: true, skipEmptyLines: true});
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        saveAs(blob, "import_subject_to_depart_template.csv");
    };
    const handleImport = () => {
        if (!file) {
            setErr("Chọn một file CSV trước!");
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                const groupedSubjects = result.data.reduce((acc, row) => {
                    const departmentID = String(row.departmentID || "").trim();
                    const subjectCode = String(row.subjectCode || "").trim();

                    if (!departmentID || !subjectCode) return acc;

                    if (!acc[departmentID]) {
                        acc[departmentID] = {
                            departmentID,
                            subjectCode: [],
                        };
                    }

                    acc[departmentID].subjectCode.push(subjectCode);
                    return acc;
                }, {});

                const subjects = Object.values(groupedSubjects); // Convert object về array

                try {
                    console.log(subjects)
                    const response = await importSubjects({branchID: branchID, data: subjects}).unwrap();
                    setModal(false)
                    toast.success(`Thành công `);
                } catch (error) {
                    console.log(error);
                    setErr(error);
                }
            },
            error: (err) => {
                setErr("Lỗi đọc file CSV!");
            },
        });

    };
    const onCancel = () => {
        setModal(false);
        setErr(null)
    };
    const csv = []
    return (
        <>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header  ">
                    <div className="is-flex is-fill-x jt-between">
                        <h3>Import</h3>

                        <div onClick={handleDownloadCSV} className={"btn btn-s btn-outline "}>
                            <> <DuckIcon icon={"download"} className={"text-m"}></DuckIcon>
                                <div className="title-xs">
                                    Tải file mẫu
                                </div>
                            </>
                        </div>
                    </div>

                </div>
                <div className="modal-body ">
                    <div className="field">
                        <div
                            className={`form-folder-upload ${filePreview ? "has-file" : ""}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={inputRef}
                                accept=".csv"
                                type="file"
                                className="input-file-upload"
                                onClick={handleClearClick}
                                onChange={handleChange}
                            />


                            {filePreview === null ? (
                                <>
                                    <label className="label-file-upload">
                                        <div className={"is-center vertical"}>
                                            <p>Tải lên tệp CSV hoặc thả file vào đây</p>
                                            <p className="upload-button text-primary" onClick={onButtonClick}>Chọn
                                                tệp</p>
                                        </div>
                                    </label>
                                    <div className="is-flex jt-between p-s">
                                        <p className={"text-xs text-disable"}>Hỗ trợ file/*.csv</p>
                                        <p className={"text-xs text-disable"}>Dung lượng tối đa 3MB</p>
                                    </div>
                                </>
                            ) : (
                                <div className={`file-upload ${loading ? 'on-upload' : ""}`}>
                                    {uploaded === false && <div className="loading"></div>}
                                    <div
                                        className="border bg-hover-light p-l is-flex align-center gap-m animate-DFJ">
                                        <div className="size-xxl border is-center ">
                                            <DuckIcon icon={"document"} className={"text-xxl"}></DuckIcon>
                                        </div>
                                        <div className="is-flex vertical align-start ">
                                            <p className={"title-m"}>{file?.name}</p>
                                            <p className={"text-xs text-disable"}>{Math.floor(file?.size)} Kb</p>
                                            {loading &&
                                                <div className="progress-container animate-SJF">
                                                    <div style={{width: `${progressValue}%`}}
                                                         className="progress-bar"
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
                    {err != null && <div className="px-m">
                        <div className="note bg-primary-light mb-m p-m">
                            <div className="note-content text-primary">
                                <div className="note-title"> Error</div>
                                <div className="note-info text-xs ">
                                    {JSON.stringify(err)}
                                </div>
                            </div>
                        </div>

                    </div>}
                </div>
                <div className="modal-bottom">
                    <div onClick={onCancel} className="btn btn-fill">Huỷ</div>
                    <div onClick={handleImport} className={"btn   "}>
                        <DuckIcon icon={"add"} className={"text-l"}></DuckIcon>
                        Import
                    </div>
                </div>
            </Modal>


        </>
    );
};

export default ImportSubjectsToDepartment;
