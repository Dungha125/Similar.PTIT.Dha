import React, {useEffect, useRef, useState} from 'react';
import DuckIcon from "duckicon";
import {formatTimeAgo} from "../services/Logic/Logic";
import {useDeleteCheckerFilesFileIdResultMutation, useGetFileStatusQuery} from "../services/fileChecker";
import {useCheckPlagiarismMutation} from "../services/result";
import {useToast} from "../Sponsor/Toast/useToast";
import Skeleton from "../Sponsor/Skeleton/Skeleton";
import {DialogConfirm} from "../Sponsor/Slice/Dialog";
const estimateTime = 10000; // 10 giây
const maxWaitTime = 2 * 60 * 1000; // 2 phút
export const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export function getBackgroundColor(value) {
    const style = (color)=> {
        return{
            backgroundColor: hexToRgba(color, 0.1),
            border: `1px solid ${hexToRgba(color, 0.3)}`,
            color: color,
            borderRadius:`6px`
        }
    }

    const state = (color,value) => {
        return <div className=" size-x-xl  is-center title-xs animate-DFJ "
                    style={style(color)}>{value}</div>
    }
    switch (true) {
        case (value >= 1 && value <= 20):
            return state("#00755D", value); // Màu xanh lục
        case (value >= 21 && value <= 30):
            return state("#1b5df8", value); // Màu xanh lục
        case (value >= 31 && value <= 50):
            return state("#ffb30c", value); // Màu xanh lục
        case (value >= 61 && value <= 80):
            return state("#F66F1A", value); // Màu xanh lục
        case (value >= 81 && value <= 100):
            return state("#ED4B60", value); // Màu xanh lục
        default:
            return state("#111111", value); // Màu xanh lục
    }
}
function RowItem({data}) {
    const [item, setItem] = useState(data);
    const [estimatedProcess, setEstimatedProcess] = useState(data.file_value || 0);
    const [error, setError] = useState(null);
    const toast = useToast();
    const buttonRef1 = useRef(null);
    const uploadedAt = new Date(data.uploaded_at).getTime();
    const now = Date.now();
    const isTimeout = now - uploadedAt > maxWaitTime;
    const [checkPlagiarism] = useCheckPlagiarismMutation();
    const [deleteFile] =useDeleteCheckerFilesFileIdResultMutation()
    const onRetry = async () => {
        try {
            const plagiarismRes = await checkPlagiarism({
                subjectID: item.subject_id,
                fileID: item.id,
                fileName: item.filename,
            }).unwrap();
            console.log(`Plagiarism Check Result for ${item.filename}:`, plagiarismRes);
            toast.success(`Plagiarism check completed for ${item.filename}`);
        } catch (plagiarismErr) {
            console.error(`Error checking plagiarism for ${item.filename}:`, plagiarismErr);
            toast.error(`Failed to check plagiarism for ${item.filename}`);
        }
    }
    const [dialogConfirm, setDialogConfirm] = useState(false);

    const handleRemove = async (id) => {
        setDialogConfirm(false);
       try {
           const res = await deleteFile({fileID:id}).unwrap();
           toast.success("Xoá thành công")
       } catch (Error) {
           toast.error("Xoá thất bại")
       }

    }
    // Query API để lấy trạng thái file
    const {data: statusData, refetch} = useGetFileStatusQuery({fileID: item.id}, {
        pollingInterval: isTimeout ? 0 : estimateTime, // Chỉ tiếp tục gọi API nếu chưa quá 2 phút
        skip: item.status || isTimeout, // Bỏ qua nếu đã hoàn thành hoặc quá thời gian
    });



    const status = statusData?.status || item.status;

    useEffect(() => {
        if (!status && !isTimeout) {
            const interval = setInterval(() => {
                setEstimatedProcess((prevValue) => {
                    if (prevValue >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevValue + 5;
                });
            }, estimateTime / 20);

            return () => clearInterval(interval);
        }
    }, [status, isTimeout]);

    useEffect(() => {
        if (status) {
            setItem((prevItem) => ({...prevItem, status: true}));
        } else if (!isTimeout) {
            refetch(); // Gọi API nếu chưa quá 2 phút
        }
    }, [status, isTimeout, refetch]);



    return (
        <>
            <DialogConfirm isOpen={dialogConfirm} onClose={() => setDialogConfirm(false)}
                           title={"Xác nhận"}
                           content={"Chắc chưa, \n Thao tác này không thể hoàn tác ?"}
                           onConfirm={() => handleRemove(null)}>
            </DialogConfirm>
            <tr className={"bg-hover-light animate-SJF"}>
                <td className={"px-l py-s"}>
                    <div className="is-flex gap-m align-center">
                        <DuckIcon
                            className={`size-xxl file-bg text-xxl p-l ${item.filetype === "pdf" ? "text-primary bg-primary-light" : " "} rounded-s`}
                            icon={item.filetype === "docx" ? "document" : "license"}/>
                        <div className="is-flex vertical gap-s animate-DFJ">
                            <div className="title-s text-mute">
                                {item.filename}
                            </div>
                            <div className="text-xs text-disable">
                                {formatTimeAgo(data.uploaded_at)}
                            </div>
                        </div>
                    </div>
                </td>

                <td className={"px-l py-s"}>
                    <div className="is-flex jt-center">
                        {status ? (
                            getBackgroundColor(item.total_similarity_percent)
                        ) : isTimeout ? (
                            <div className="text-danger">Error</div>
                        ) : (
                            <Skeleton width={80} height={24}></Skeleton>
                        )}
                    </div>
                </td>

                <td>
                    <div className="is-flex jt-center">
                        {status ? (
                            <div className={`is-center vertical `}><p className={"title-s"}>Hoàn
                                thành</p>
                            </div>
                        ) : isTimeout ? (
                            <div className="text-danger">Thất bại</div>
                        ) : (
                            <Skeleton width={80} height={24}></Skeleton>
                        )}
                    </div>
                </td>
                <td>
                    <div className="is-flex jt-end">
                        {status ? (
                            <div className={`  text-mute text-xs`}>
                                <p>{item.duration}</p></div>
                        ) : isTimeout ? (
                            <div className="text-primary">Failed</div>
                        ) : (
                            <Skeleton width={80} height={24}>

                            </Skeleton>
                        )}
                    </div>
                </td>
                <td colSpan={2}>

                    <div className="is-flex jt-end px-l py-s animate-DFJ gap-s">

                        {status ? (
                            <>
                                <div onClick={()=> setDialogConfirm(true)} className={`btn  btn-ghost btn-primary btn-s`}>
                                    <DuckIcon className="text-l text-right " icon="trash-can-blank"/>
                                </div>
                                <a href={`/document/${item.id}`}>
                                    <div className={`btn btn-fill btn-s`}>View</div>
                                </a>
                            </>

                        ) : isTimeout ? (
                            <>
                                <div title={"retry"} onClick={onRetry} className={`btn  btn-ghost btn-secondary btn-s`}>
                                    <DuckIcon className="text-l text-right " icon="rotate"/> Retry
                                </div>
                            </>

                        ) : (
                            <div className={"text-xs text-disable"}>In Process</div>
                        )}
                    </div>
                </td>
            </tr>
        </>
    );
}

export default RowItem;
