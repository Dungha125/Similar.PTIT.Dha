import DuckIcon from "duckicon";
import React, {useEffect, useRef, useState} from "react";
import {formatTimestamp} from "../../../../services/file";
import PermissionWrapper from "../../../../services/PermissionWrapper";
import {UserRole} from "../../../RoleMap";
import Modal from "../../../../Sponsor/Slice/Modal";
import {hexToRgba} from "../../../../CoreBase/RowItem";
import {useCheckStatusLogQuery} from "../../../../services/privateCheckLog";
import { CSVLink } from "react-csv";
function getScore(value) {
    const style = (color) => {
        return {
            backgroundColor: hexToRgba(color, 0.1),
            border: `1px solid ${hexToRgba(color, 0.3)}`,
            color: color,
            borderRadius: `6px`
        }
    }
    const state = (color, value) => {
        return <div className=" size-xxl  is-center title-l animate-DFJ "
                    style={style(color)}>{value}</div>
    }
    switch (true) {
        case (value >= 1 && value <= 20):
            return state("#00755D", value); // Màu xanh lục
        case (value >= 21 && value <= 30):
            return state("#1b5df8", value); // Màu xanh lục
        case (value >= 31 && value <= 50):
            return state("#ffb000", value); // Màu xanh lục
        case (value >= 61 && value <= 80):
            return state("#F66F1A", value); // Màu xanh lục
        case (value >= 81 && value <= 100):
            return state("#ED4B60", value); // Màu xanh lục
        default:
            return state("#111111", value); // Màu xanh lục
    }
}

export const ZipTable = ({data}) => {
    const [modal, setModal] = useState(false);
    const [csv,setCsv] = useState([])
    useEffect(()=>{
     if (modal)
         setCsv([
             ["File 1","Tổng số câu", "File 2", "Tổng số câu", "Độ trùng lặp", "Số câu trùng"],
             ...modal.result.pairs.map((pair) => [
                 pair.files[0].name,
                 pair.files[0].total_sentences,
                 pair.files[1].name,
                 pair.files[1].total_sentences,
                 pair.similarity,
                 pair.matching_sentences,
             ]),
         ])
    },[modal])
    return <div className="table-section border">
        <Modal isOpen={modal} onClose={() => setModal(false)} size={"l"}>
            {modal &&
                <>
                    <div className="modal-header">
                        <div className="is-flex jt-between is-fill-x">
                            <h3>{modal.folder_name}</h3>
                            <div onClick={() => setModal(false)}
                                 className="bg-sliver size-l is-center  rounded cursor-pointer">
                                <DuckIcon className={"text-l"} icon={"close"}/>
                            </div>

                        </div>
                        <div className="grid-4 is-fill-x">
                            <div className="col">
                                <div className="text-disable text-xs">
                                    Tổng số file
                                </div>
                                <div className="title-l">
                                    {modal.total_file}
                                </div>
                            </div>
                            <div className="col">
                                <div className="text-disable text-xs">
                                    Thời gian xử lý
                                </div>
                                <div className="title-l">
                                    {modal.duration}
                                </div>
                            </div>
                            <div className="col">
                                <div className="text-disable text-xs">
                                    Thời gian tạo
                                </div>
                                <div className="title-l">
                                    {formatTimestamp(modal.create_at)}
                                </div>
                            </div>
                            <div className="col">
                                <div className="text-disable text-xs">
                                    Tải xuống file CSV
                                </div>

                                <CSVLink data={csv} filename={modal?.folder_name}>

                                <div onClick={() => {
                                    console.log(csv)
                                }} className="btn btn-fill is- btn-s" title={"tải xuống file CSV"}>
                                    <DuckIcon icon={"download"} className={"text-l"}></DuckIcon>
                                </div>
                                </CSVLink>

                            </div>
                        </div>

                    </div>
                    <div className="modal-body   ">
                        <div className="table-section bg-white border rounded-x">
                            <table className="table-strip-border rounded-x">
                                <thead>
                                <tr className="bg-light text-disable">
                                    <th className="px-l py-xs">
                                        <div className="text-s">Trùng lặp(%)</div>
                                    </th>

                                    <th className=" px-m  py-xs">
                                        <div className={"is-flex jt-between  "}>
                                            <div className="text-left text-s">File</div>

                                            <div className="text-left text-s">Số câu</div>

                                        </div>
                                    </th>
                                    <th className="text-center py-xs">
                                        <div className="text-s">Số câu trùng</div>
                                    </th>

                                </tr>
                                </thead>
                                <tbody>
                                {modal.result.pairs.map((item, index) => {
                                    return <tr key={index} className={"bg-hover-light"}>
                                        <td className={""}>
                                            <div className="is-flex vertical align-center">
                                                <div className={"is-flex jt-between  "}>
                                                    {getScore((item.similarity).toFixed(0))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={"p-m"}>
                                            <div className="is-flex vertical gap-m">
                                                <div className={"is-flex jt-between  "}>
                                                    <div className="title-s">
                                                        {item.files[0].name}
                                                    </div>
                                                    <div className="text-xs text-disable">
                                                        {item.files[0].total_sentences}
                                                    </div>
                                                </div>
                                                <div className={"is-flex jt-between  "}>
                                                    <div className="title-s">
                                                        {item.files[1].name}
                                                    </div>
                                                    <div className="text-xs text-disable">
                                                        {item.files[1].total_sentences}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={"is-flex vertical align-center p-l"}>
                                                <div className="rounded-s is-center size-x-xxl py-xs ">
                                                    <div className="title-m text-center">
                                                        {item.matching_sentences}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white">

                        </div>
                    </div>
                </>}
        </Modal>
        <table className="table-strip-border">
            <thead>
            <tr className="bg-light text-disable">
                <th className="text-center py-xs">
                    <div className="text-s">STT</div>
                </th>
                <th className="text-left px-l py-xs">
                    <div className="text-s">Tệp</div>
                </th>
                <th className="px-l py-xs">
                    <div className="text-left text-s">Thời gian xử lý</div>
                </th>

                <th className="px-l py-xs">
                    <div className="text-s">Thời gian</div>
                </th>
                <th className={""}>
                    <div className="is-flex jt-center px-l ">
                        <DuckIcon className={"text-l text-right"} icon={"context-menu-2 "}/>
                    </div>
                </th>
            </tr>
            </thead>
            <tbody>
            {data.map((log, index) => (
                <ZipRow setModal={setModal} data={log} index={index}></ZipRow>
            ))}
            </tbody>
        </table>
    </div>
}
const estimateTime = 30000; // 10 giây
const maxWaitTime = 1 * 60; // 2 phút
const ZipRow = ({
                    data, index, setModal
                }) => {
    const uploadedAt = new Date(data.uploaded_at).getTime();
    const now = Date.now();
    const isTimeout = now - uploadedAt > maxWaitTime;

    // // Query API để lấy trạng thái file
    const {data: statusData} = useCheckStatusLogQuery({logID: data.concat}, {
        pollingInterval: isTimeout ? 0 : estimateTime, // Chỉ tiếp tục gọi API nếu chưa quá 2 phút
        skip: data.status || isTimeout, // Bỏ qua nếu đã hoàn thành hoặc quá thời gian
    });
    const status = statusData?.status || data.status;

    const ref = useRef(null);
    const userRole = UserRole
    return <tr key={index} className="bg-hover-light">
        <td className="px-l text-center py-xs">{index}</td>
        <td className="px-l py-xs ">
            <div className="is-flex vertical gap-s ">
                <div className="title-m text-mute">
                    {data.folder_name}
                </div>
                <div className=" text-xs text-disable ">
                    {data.total_file} file
                </div>
            </div>
        </td>
        <td className="px-l py-xs text-s">
            {status ? (
                <div className={""}>
                    {data.duration}s
                </div>
            ) : isTimeout ? (
                <div className={`btn btn-danger btn-s`}>Retry</div>
            ) : (
                <div className={`btn btn-ghost loading`}>a</div>
            )}

        </td>
        <td className="px-l py-xs title-s">
            {status ? (
                <div className={"text-center"}>
                    {formatTimestamp(data.create_at)}
                </div>
            ) : isTimeout ? (
                <div className={`btn btn-danger btn-s`}>Retry</div>
            ) : (
                <div className={`btn btn-ghost loading`}>a</div>
            )}

        </td>
        <td>

            <div className="is-flex jt-center align-center px-l py-xs animate-DFJ">
                <PermissionWrapper permission={userRole.department.isAccess}>

                    {status ? (
                        <div ref={ref} onClick={() => setModal(data)} className="btn btn-fill btn-s">
                            <div className=" title-xs">View</div>
                        </div>
                    ) : isTimeout ? (
                        <div className={`btn btn-danger btn-s`}>Retry</div>
                    ) : (
                        <div className={`btn btn-ghost loading`}>a</div>
                    )}
                </PermissionWrapper>

            </div>
        </td>
    </tr>
}