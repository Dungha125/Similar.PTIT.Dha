import React from 'react';
import DuckIcon from "duckicon";
import FileRow from "./ViewFile/FileRowTable";
import Pagination from "../../../Sponsor/Pagination";
import { TableSkeleton, PaginationSkeleton } from "../../../Sponsor/Skeleton/Skeleton";

function FileTableSection({ fileList, filesLoading, fileFetching, currentPage, handleSetPage }) {
    return (
        <div className="table-section bg-white border rounded-s">
            <table className="table-strip-border">
                <thead className="text-disable text-semi bg-light">
                <tr>
                    <th className="px-s px-l">
                        <div className="text-s text-left">File</div>
                    </th>
                    <th className="text-left px-l py-s">
                        <div className="text-s">Học phần</div>
                    </th>
                    <th className="p-s">
                        <div className="text-s">Ngày tạo</div>
                    </th>
                    <th className="p-s">
                        <div className="text-s">Tải lên bởi</div>
                    </th>
                    <th>
                        <div className="is-flex jt-end px-l">
                            <div className="btn btn-ghost">
                                <DuckIcon className="text-l text-right" icon="context-menu-2" />
                            </div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {fileFetching || filesLoading ? (
                    <TableSkeleton skeleton="28px" />
                ) : (
                    fileList.files?.map((item, index) => (
                        <FileRow key={index} data={item} />
                    ))
                )}
                </tbody>
            </table>
            <div className="px-l py-xs">
                {fileFetching || filesLoading ? (
                    <PaginationSkeleton skeleton="28px" />
                ) : (
                    <Pagination
                        currentPage={currentPage}
                        handleSetPage={handleSetPage}
                        limit={12}
                        total={fileList.totalPage}
                    />
                )}
            </div>
        </div>
    );
}

export default FileTableSection;