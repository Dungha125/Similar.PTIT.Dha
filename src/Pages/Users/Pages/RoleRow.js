import DuckIcon from "duckicon";
import React, {useEffect, useRef, useState} from "react";
import {useToast} from "../../../Sponsor/Toast/useToast";
import {useContextMenu} from "../../../Sponsor/ContextMenu/ContextMenuProvider";
import SelectLi from "../../../Sponsor/ContextMenu/SelectLi";
import {useCheckPermissionsMutation, useGetListRoleQuery} from "../../../services/role";
import {getPrettyHandlerName} from "./AddRoles";

export const RoleRow = ({role, onUpdate}) => {
    const {data: listRole, isLoading, isFetching} = useGetListRoleQuery();
    const [checkPermissions] = useCheckPermissionsMutation();
    const [roleData, setRoleData] = useState({});
    const [checkedRole,setCheckedRole] = useState({})
    const toast = useToast();
    const handleRemove = async () => {
        try {
            toast.success("Đã xóa học phần khỏi khoa");
        } catch (error) {
            toast.error("Xóa học phần khỏi khoa thất bại");
        }
    };
    const [expandedGroups, setExpandedGroups] = useState({});
    const toggleGroupExpand = (group) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };

    const tableMenu = [
        {
            actionName: "Sửa",
            icon: "document-edit",
            action: function () {
                onUpdate(role.role)
            }
        },
        {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleRemove
        },
    ]
    const buttonRef1 = useRef(null);
    const {
        showMenu,
    } = useContextMenu();
    const handleOpenMenu = (event) => {
        showMenu(buttonRef1, <div className={"select-list active"}>
            {tableMenu.map((item, index) => {
                return <SelectLi key={index} item={item}></SelectLi>
            })}
        </div>, 200, 100)
        event.stopPropagation()
    }
    const [roleName, setRoleName] = useState("");
    const [groupPermissions, setGroupPermissions] = useState({});
    useEffect(() => {
        const fetchPermissions = async () => {
            if (listRole) {
                try {
                    const routes = listRole.routes;
                    const result = await checkPermissions({
                        userID: "user123",
                        routes: { routes },
                    }).unwrap();
                    setRoleData(result.routes || {});
                } catch (error) {
                    console.error("Error checking permissions:", error);
                }
            }
        };

        fetchPermissions();
    }, [listRole]);
    useEffect(() => {
        setRoleName(role.name || "");
        const perms = {};
        (role.permissions || []).forEach((perm) => {
            perms[perm.endpoint] = {
                isAccess: perm.isAccess || false,
                isEdit: perm.isEdit || false,
                isOnlyView: perm.isOnlyView || false,
            };
        });
        setGroupPermissions(perms);

    }, [role]);
    return <>
        <tr className={"bg-light"}>
            {/*<td className={"p-s text-left"}>{index + 1}</td>*/}
            <td colSpan={6}
                className={"px-m py-s title-m text-capitalize text-black  text-left"}></td>
            {/*<td className={"p-s text-left"}>{role.data === 'p' ? "Tất cả" : "Phân quyền"}</td>*/}

        </tr>
        <tr className={"text-disable title-xs"}>
            <th className={"px-m py-s text-left "}>{roleName}</th>
            <th className={"p-s text-center"}>isAccess</th>
            <th className={"p-s text-center"}>isEdit</th>
            <th className={"p-s text-center"}>isOnlyView</th>

            <th className={"p-s text-center"}>
                <div ref={buttonRef1} onClick={(e) => handleOpenMenu(e)} className="is-flex jt-end ">
                    <div className="btn btn-ghost">
                        <DuckIcon className={"text-l text-right"} icon={"circle "}/>
                    </div>
                </div>
            </th>
        </tr>
        {Object.entries(roleData).map(([group, endpoints]) => {
            const cleanedGroup = group.replace(/^\/api\//, "");
            const currentPerm = groupPermissions[group] || {
                isAccess: false,
                isEdit: false,
                isOnlyView: false,
            };

            return (<>
                <tr key={group} className="is-flex jt-between align-center ">
                    <td className="is-flex align-center px-s">
                        <div className="px-xs text-capitalize py-xs title-m text-left">{cleanedGroup}</div>
                    </td>
                    <td className={"px-m py-xs text-s  "}>
                        <div className="is-flex jt-center  ">
                            <div>
                                <input readOnly
                                    type="checkbox"
                                    checked={currentPerm.isAccess}
                                />
                            </div>
                        </div>
                    </td>
                    <td className={"px-m py-xs text-s  "}>
                        <div className="is-flex jt-center  ">
                            <div>
                                <input readOnly
                                    type="checkbox"
                                   checked={currentPerm.isEdit}/>
                            </div>

                        </div>
                    </td>
                    <td className={"px-m py-xs text-s  "}>
                        <div className="is-flex jt-center   ">
                            <div>
                                <input readOnly
                                    type="checkbox"
                                    checked={currentPerm.isOnlyView}
                                />
                            </div>

                        </div>
                    </td>
                    <td className={"px-m py-xs text-s is-flex align-end  "}>
                            <div onClick={() => toggleGroupExpand(group)} className="btn btn-ghost btn-icon">
                                <DuckIcon
                                    icon={"down"}
                                    className={`text-l ${expandedGroups[group] && "rotate-180"}`}
                                />
                            </div>
                    </td>
                </tr>
                {expandedGroups[group] && (<tr>
                        <td colSpan={6}>
                            <div className="grid-3">
                                {endpoints.map(({path, handler, method, pass}) => (
                                    <div key={path + handler} className="col is-flex vertical p-m">
                                        <div className="title-xs text-mute unwrap">
                                            {pass ? <span className="text-secondary">[Pass]</span> :
                                                <span className="text-primary">[Block]</span>}
                                            <span>[{method}]</span> {getPrettyHandlerName(handler)}
                                        </div>
                                        <p className="text-xs text-disable">{path.replace(/^\/api\//, "")}</p>
                                    </div>
                                ))}
                            </div>

                        </td>

                    </tr>   )}
                </>


            )
        })
        }
        {/*{role.permission.map((role, index) => (*/}
        {/*    <tr className={"bg-hover-light"} key={index}>*/}
        {/*        <td className={"px-m py-xs text-s text-left"}>{role.endpoint}</td>*/}
        {/*        <td className={"px-m py-xs text-s  "}>*/}
        {/*            <div className="is-flex jt-center  ">*/}
        {/*                <div>*/}
        {/*                    {role.isAccess ?*/}
        {/*                        <input type="checkbox" defaultChecked="true"/> :*/}
        {/*                        <input type="checkbox"/>}*/}
        {/*                </div>*/}

        {/*            </div>*/}
        {/*        </td>*/}
        {/*        <td className={"px-m py-xs text-s  "}>*/}
        {/*            <div className="is-flex jt-center  ">*/}
        {/*                <div>*/}
        {/*                    {role.isEdit ?*/}
        {/*                        <input type="checkbox" defaultChecked="true"/> :*/}
        {/*                        <input type="checkbox"/>}*/}
        {/*                </div>*/}

        {/*            </div>*/}
        {/*        </td>*/}
        {/*        <td className={"px-m py-xs text-s  "}>*/}
        {/*            <div className="is-flex jt-center  ">*/}
        {/*                <div>*/}
        {/*                    {role.isOnlyView ?*/}
        {/*                        <input type="checkbox" defaultChecked="true"/> :*/}
        {/*                        <input type="checkbox"/>}*/}
        {/*                </div>*/}

        {/*            </div>*/}
        {/*        </td>*/}

        {/*        <td className={"px-m py-xs"}>*/}

        {/*        </td>*/}
        {/*    </tr>*/}
        {/*))}*/}
    </>
}