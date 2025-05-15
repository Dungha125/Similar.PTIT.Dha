import React, { useEffect, useState } from "react";
import {useAddRoleMutation, useGetListRoleQuery, useUpdateRoleMutation} from "../../../services/role";
import DuckIcon from "duckicon";
import { useToast } from "../../../Sponsor/Toast/useToast";

export const AddRoles = ({ isUpdate = null, onCancel, onClose, setIsUpdate }) => {
    const { data: listRole, isLoading, isFetching } = useGetListRoleQuery();
    const [addRole] = useAddRoleMutation();
    const [updateRole] = useUpdateRoleMutation();

    const [roleData, setRoleData] = useState({});
    const [expandedGroups, setExpandedGroups] = useState({});
    const [groupPermissions, setGroupPermissions] = useState({});
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const toast = useToast();

    useEffect(() => {
        if (listRole) {
            setRoleData(listRole.routes || {});
        }
    }, [listRole]);

    // Khi có isUpdate thì map data cũ vào form
    useEffect(() => {
        if (isUpdate) {
            setRoleName(isUpdate.name || "");
            setRoleDescription(isUpdate.description || "");
            const perms = {};
            (isUpdate.permission || []).forEach((perm) => {
                perms[perm.endpoint] = {
                    isAccess: perm.isAccess || false,
                    isEdit: perm.isEdit || false,
                    isOnlyView: perm.isOnlyView || false,
                };
            });
            setGroupPermissions(perms);
        } else {
            resetForm();
        }
    }, [isUpdate]);

    const resetForm = () => {
        setRoleName("");
        setRoleDescription("");
        setGroupPermissions({});
        setExpandedGroups({});
        setIsUpdate?.(null);
    };

    const toggleGroupExpand = (group) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };

    const setPermissionForGroup = (group, type) => {
        setGroupPermissions((prev) => ({
            ...prev,
            [group]: {
                isAccess: type === "isAccess",
                isEdit: type === "isEdit",
                isOnlyView: type === "isOnlyView",
            },
        }));
    };

    const handleSubmit = async () => {
        const permissions = Object.entries(groupPermissions).map(([group, perms]) => ({
            endpoint: group,
            ...perms,
        }));

        const result = {
            name: roleName,
            description: roleDescription,
            permission: permissions,
        };

        try {
            let res;
            if (isUpdate?.id) {
                res = await updateRole({ id: isUpdate.id, roleData: result }).unwrap();
            } else {
                res = await addRole({ roleData: result }).unwrap();
            }

            if (res) {
                toast.success(isUpdate ? "Đã cập nhật vai trò" : "Đã thêm vai trò");
                resetForm();
                onClose?.(res);
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra");
        }
    };


    return (
        <>
            <div className="modal-header is-sticky bg-white" style={{ top: 0, zIndex: 100 }}>
                <div className="is-flex is-fill-x jt-between">
                    <h3>{isUpdate ? "Cập nhật quyền" : "Thêm quyền"}</h3>
                    <div className="is-flex gap-m">
                        <div
                            onClick={() => {
                                resetForm();
                                onCancel?.();
                            }}
                            className="btn btn-fill"
                        >
                            Huỷ
                        </div>
                        <div className={`btn ${!roleName.trim() ? "disable" : ""}`} onClick={handleSubmit}>
                            {isUpdate ? "Cập nhật" : "Thêm"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-body">
                <div className="is-flex vertical">
                    <div className="p-l">
                        <h2>Vai trò</h2>
                        <div>Set up roles with permissions for each group of people.</div>
                    </div>

                    <div className="field">
                        <div className="label">Tên vai trò</div>
                        <input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </div>

                    <div className="field">
                        <div className="label">Mô tả</div>
                        <textarea
                            rows={3}
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                        />
                    </div>

                    <div className="section p-l">
                        <div className="pt-xl pb-l">
                            <h2>Quyền</h2>
                            <div>Set up permissions for each API group.</div>
                        </div>

                        {!isLoading &&
                            !isFetching &&
                            roleData &&
                            Object.entries(roleData).map(([group, endpoints]) => {
                                const cleanedGroup = group.replace(/^\/api\//, "");
                                const currentPerm = groupPermissions[group] || {
                                    isAccess: false,
                                    isEdit: false,
                                    isOnlyView: false,
                                };

                                return (
                                    <div className="mb-s px-s border gap-x" key={group}>
                                        <div className="is-flex jt-between align-center">
                                            <div className="is-flex align-center px-s">
                                                <div onClick={() => toggleGroupExpand(group)} className="btn btn-ghost btn-icon">
                                                    <DuckIcon
                                                        icon={"down"}
                                                        className={`text-l ${expandedGroups[group] && "rotate-180"}`}
                                                    />
                                                </div>
                                                <div className="title-m text-capitalize pl-s">{cleanedGroup}</div>
                                            </div>

                                            <div className="field p-s">
                                                <div className="grid-3 gap-m">
                                                    <label className="form-radio col">
                                                        <input
                                                            type="radio"
                                                            name={`perm-${group}`}
                                                            checked={currentPerm.isOnlyView}
                                                            onChange={() => setPermissionForGroup(group, "isOnlyView")}
                                                        />
                                                        <span>Only View</span>
                                                    </label>

                                                    <label className="form-radio col">
                                                        <input
                                                            type="radio"
                                                            name={`perm-${group}`}
                                                            checked={currentPerm.isEdit}
                                                            onChange={() => setPermissionForGroup(group, "isEdit")}
                                                        />
                                                        <span>Can Edit</span>
                                                    </label>

                                                    <label className="form-radio col">
                                                        <input
                                                            type="radio"
                                                            name={`perm-${group}`}
                                                            checked={currentPerm.isAccess}
                                                            onChange={() => setPermissionForGroup(group, "isAccess")}
                                                        />
                                                        <span>Access All</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {expandedGroups[group] && (
                                            <>
                                                <div className="divider bg-sliver"></div>
                                                <div className="grid-2">
                                                    {endpoints.map(({ path, handler, method }) => (
                                                        <div key={path + handler} className="col is-flex vertical p-m">
                                                            <div className="title-s unwrap">
                                                                {method} {getPrettyHandlerName(handler)}
                                                            </div>
                                                            <p className="text-xs text-disable">{path.replace(/^\/api\//, "")}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export const getPrettyHandlerName = (handler) => {
    if (!handler) return "";
    const parts = handler.split(".");
    const raw = parts[parts.length - 1].replace(/-.*$/, "");
    return raw.replace(/([a-z])([A-Z])/g, "$1 $2");
};
