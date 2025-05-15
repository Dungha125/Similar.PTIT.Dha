import React, {useEffect, useRef, useState} from 'react';
import DuckSelect from "../../../Sponsor/Select";
import DuckIcon from "duckicon";
import {formatTimestamp} from "../../../services/file";
import {useSearchParams} from "react-router-dom";
import {useGetAllUsersQuery} from "../../../services/user";
import {useGetSubjectDataQuery, useUpdateSubjectMutation} from "../../../services/subject";
import {useGetBranchDataQuery} from "../../../services/branch";
import {useGetDepartmentDataQuery} from "../../../services/depart";
import {useContextMenu} from "../../../Sponsor/ContextMenu/ContextMenuProvider";
import {UserRole} from "../../RoleMap";
import SelectLi from "../../../Sponsor/ContextMenu/SelectLi";
import PermissionWrapper from "../../../services/PermissionWrapper";

function UserInUser(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedBranch, setSelectedBranch] = useState({id: searchParams.get('branch') || 'all', name: "Tất cả"});
    const [selectedDepartment, setSelectedDepartment] = useState({
        id: searchParams.get('department') || 'all',
        name: "Tất cả"
    });
    const {data: userData, isFetching: userFetching, isLoading: userLoading} = useGetAllUsersQuery({
        role: 'all',
        name: 'all',
        status: 'all',
        page: 1,
        pageSize: 100
    });

    const [updateSubject] = useUpdateSubjectMutation();

    const [branchList, setBranchList] = useState([]);
    const {data: branchData, isLoading, isFetching} = useGetBranchDataQuery();

    const [departmentList, setDepartmentList] = useState([]);
    const {data: departmentData} = useGetDepartmentDataQuery({branchID: selectedBranch.id});

    const [subjectList, setSubjectList] = useState([]);
    const {
        data: subjectData,
        isLoading: subjectLoading,
        isFetching: subjectFetching
    } = useGetSubjectDataQuery({branchID: selectedBranch.id, departmentID: selectedDepartment.id});

    const [userList, setUserList] = useState([])
    useEffect(() => {
        if (userData?.users) {
            setUserList(userData)
        }
    }, [userData])
    // Update department list when data changes
    useEffect(() => {
        if (departmentData?.length) {
            setDepartmentList([{
                name: "Tất cả",
                id: "all"
            }, ...departmentData]);
        }
    }, [departmentData,selectedBranch.id]);

    // Update branch list when data changes
    useEffect(() => {
        if (branchData?.length) {
            setBranchList([{
                name: "Tất cả",
                id: "all"
            }, ...branchData]);
        }
    }, [branchData]);

    useEffect(() => {
        setSubjectList([])
        if (subjectData?.length) {
            setSubjectList(subjectData)
        }
    }, [selectedBranch.id, subjectData, selectedDepartment.id]);

    // Update URL parameters and state on selection change
    const handleChangeDepartment = (item) => {
        setSelectedDepartment(item);
        setSearchParams({branch: selectedBranch.id, department: item.id});
    };
    const handleChangeBranch = (item) => {
        setSelectedBranch(item);
        setSearchParams({branch: item.id, department: selectedDepartment.id});
    }
    const userRole = UserRole;
    const handleRemove = async () => {
        console.log("remove")
    }
    const tableMenu = [
        userRole.user.editUser && {
            actionName: "Xóa",
            icon: "pencil",
            action: handleRemove
        },
        userRole.user.deleteUser && {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleRemove
        },


    ]
    const buttonRef1 = useRef(null);
    const {
        showMenu,
    } = useContextMenu();
    return (<>
            <div className=" py-xxl border-b">
                <div className="container-xl px-xl px-xl">
                    <div className="is-flex jt-between">
                        <div>
                            <div className={"title-xxl"}>Quản lý Người dùng</div>
                            <p className="text-disable">
                                Quản lý người dùng trong hệ thống
                            </p>
                        </div>
                        <PermissionWrapper permission={userRole.user.isEdit}>
                        <div className="btn">
                            <DuckIcon icon={"add"} className={"text-l"}/>
                            <span>Thêm</span>
                        </div>
                        </PermissionWrapper>
                    </div>
                </div>
            </div>
            <div className="container-xl px-xl pt-xl">
                <div className="columns gap-m py-m">
                    <div className="col-3">
                        <input type="search" placeholder="Tìm kiếm học phần" className="is-fill-x"/>
                    </div>

                    <div className="col-2">
                        <DuckSelect
                            data={branchList}
                            value={selectedBranch}
                            placeholder="học phần"
                            onSelect={(item) => handleChangeBranch(item)}
                            child={({item}) => (
                                <div title={item.name} key={item.id}
                                     className={`p-s  rounded-xs ${selectedBranch === item ? "title-m text-black" : " text-mute bg-hover-light"}`}>
                                    <div className={`is-flex gap-m `}>
                                        <p className={"text-s"}>{item.name}</p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div className="col-2">
                        <DuckSelect
                            data={departmentList}
                            value={selectedDepartment}
                            placeholder="Khoa"
                            onSelect={(item) => handleChangeDepartment(item)}
                            child={({item}) => (
                                <div title={item.name} key={item.id}
                                     className={`p-s rounded-xs ${selectedDepartment === item ? "title-m text-black" : " text-mute "}`}>
                                    <div className="is-flex gap-m">

                                        <p className={"text-s"}>{item.name}</p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="table-section bg-white border">
                    <table className={"table-strip-border"}>
                        <thead className={"text-black bg-light"}>
                        <tr>
                            <th>ID</th>
                            <th className={"p-s text-left"}>Username</th>
                            <th className={"p-s text-center"}>Status</th>
                            <th className={"p-s text-left"}>Created At</th>
                            <th className={"p-s text-center"}>Type</th>
                            <th className={"p-s text-left"}>Role</th>
                            <th className={"p-s text-left"}>Data</th>
                            <th className={"p-s text-left"}>
                                <div className="is-flex jt-end">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className={"text-l text-right"} icon={"context-menu-2 "}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {userList.users?.map((user, index) => (
                            <tr key={user.id}>
                                <td className={"p-s text-center"}>{index + 1}</td>
                                <td className={"p-s"}>
                                    <div>
                                        <div className="title-m text-capitalize">
                                            {user.username}
                                        </div>
                                        <div className="text-s text-mute">
                                            {user.email}
                                        </div>
                                    </div>
                                </td>
                                <td className={"p-s text-center"}>{user.id}</td>
                                <td className={"p-s"}>{formatTimestamp(user.created_at)}</td>
                                <td className={"p-s text-center"}>{user.ptype}</td>
                                <td className={"p-s text-left title-m text-capitalize"}>{user.role}</td>
                                {/*if user.role= teacher > find in subject where user.data === subject.id*/}
                                <td className={"p-s text-left title-m text-capitalize"}>
                                    {user.role === 'teacher' ? subjectList.find(subject => subject.id === user.data)?.name : user.data}
                                </td>
                                <td className={"p-s"}>
                                    <div className="is-flex jt-end animate-DFJ">
                                        <div ref={buttonRef1}
                                             onClick={() => showMenu(buttonRef1, <div className={"select-list active"}>
                                                 {tableMenu.map((item, index) => {
                                                     return <SelectLi key={index} item={item}></SelectLi>
                                                 })}
                                             </div>, 200, 100)} className="btn btn-ghost">
                                            <DuckIcon className={"text-l text-right"} icon={"circle "}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default UserInUser;

const UserInUserRow = ({})