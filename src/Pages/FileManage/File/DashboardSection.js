import React from 'react';
import DuckIcon from "duckicon";
import PermissionWrapper from "../../../services/PermissionWrapper";

const dashboard = [
    { name: "Tổng số file", icon: "folder", value: "12,123", per: 20 },
    { name: "Dung lượng", icon: "cloud", value: "2.5GB", per: 12 },
    { name: "Số lượt kiểm tra", icon: "double-checked", value: "1,123", per: -12 },
    { name: "Số file trùng", icon: "mirror", value: "12,123", per: 21 }
];

function DashboardSection({ onUploadClick, userRole }) {
    return (
        <div className="py-xxl border-b">
            <div className="container-xl px-xl">
                <div className="is-flex jt-between align-end">
                    <div>
                        <div className="title-xxl">Quản lý Tài liệu</div>
                        <p className="text-disable">Quản lý tài liệu tra cứu trong hệ thống</p>
                    </div>
                    <PermissionWrapper permission={userRole.file.isEdit}>
                        <div onClick={onUploadClick} className="btn">
                            <DuckIcon icon="upload" className="text-l" />
                            Upload
                        </div>
                    </PermissionWrapper>
                </div>
                <div className="grid-4 mt-xxl">
                    {dashboard.map((item, index) => (
                        <div key={index} className="col bg-white is-flex p-m gap-l border vertical is-overflow">
                            <div className="is-flex align-center gap-m">
                                <div className="is-center size-xxl rounded-m bg-primary">
                                    <DuckIcon icon={item.icon} className="text-xl" />
                                </div>
                                <div className="text-s text-disable">{item.name}</div>
                            </div>
                            <div className="is-flex jt-between align-end">
                                <div className="title-xl text-bold">{item.value}</div>
                                <div className={`is-flex ${item.per > 0 ? "text-secondary" : "text-primary"} align-center`}>
                                    <DuckIcon icon={item.per > 0 ? "tri-up" : "tri-down"} className="text-l" />
                                    <div className="title-xs">{item.per}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardSection;