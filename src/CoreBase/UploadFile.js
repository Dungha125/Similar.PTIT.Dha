import React, {useEffect, useState} from 'react';
import DuckIcon from "duckicon";
import FileInput from "./FileInput";
import RowItem from "./RowItem";
import {useGetFileByUserQuery} from "../services/fileChecker";
import {useSelector} from "react-redux";

function UploadFile(props) {
    const [FileList, setFileList] = useState([]);
    const { data: FileData, isLoading, isFetching } = useGetFileByUserQuery();
    const {userInfo} = useSelector((state) => state.auth);
    const handleAddFile = (newFile) => {
        setFileList(prevList => [newFile, ...prevList]); // Thêm file mới vào đầu danh sách
    };

    useEffect(() => {
        if (FileData?.length) {
            // Chỉ cập nhật FileList từ FileData nếu FileList chưa có dữ liệu
            // Điều này tránh ghi đè file vừa upload
            if (FileList.length === 0) {
                setFileList([...FileData].reverse()); // Đảo ngược để mới nhất lên đầu
            }
        } else {
            setFileList([]);
        }
    }, [FileData]); // Cập nhật khi FileData thay đổi

    return (
        <div className={"p-m"}>
            <div className="mb-xxl">
                <div className="is-flex jt-between align-center text-center">
                    <div className="is-block is-fill-x ">
                        <div className={"h-l text-semi"}>Chào <span className={"text-capitalize text-bold"}>{userInfo.username}</span>,</div>
                        <div className={"h-m text-semi"}>Hôm nay bạn muốn kiểm tra gì? </div>
                    </div>
                </div>
                <div className="mt-xxl">
                    <FileInput handleAdd={handleAddFile}></FileInput>
                </div>
            </div>
            <div className="section border bg-white">
                <div className="is-block p-m ">
                    <h4>Lịch sử kiểm tra</h4>
                </div>
                <div className="table-section    tableFixHead y-half ">
                    <table className="table-strip-border">
                        <thead className="text-disable bg-light">
                        <tr className={"bg-blur-white"}>
                            <th className="px-s px-l">
                                <div className="text-s text-left">File</div>
                            </th>
                            <th className="text-center px-l py-s">
                                <div className="text-s">Độ tương đồng(%)</div>
                            </th>
                            <th className="p-s">
                                <div className="text-s">Trạng thái</div>
                            </th>
                            <th className="p-s">
                                <div className="text-s">Thời gian xử lý</div>
                            </th>
                            <th colSpan={2} className="p-s">
                                <div className="is-flex jt-end px-l">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className="text-l text-right" icon="context-menu-2" />
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {FileList.map((item, index) => {
                            return <RowItem key={item.id || index} data={item}></RowItem>;
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UploadFile;