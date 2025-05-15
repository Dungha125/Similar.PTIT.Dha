import React, {useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {UserRole} from "../../../../RoleMap";
import DuckIcon from "duckicon";
import Modal from "../../../../../Sponsor/Slice/Modal";
import {useToast} from "../../../../../Sponsor/Toast/useToast";
import DepartRow from "./DepartRow";
import {TableSkeleton} from "../../../../../Sponsor/Skeleton/Skeleton";
import {
    useAddDepartmentMutation,
    useGetDepartmentDataQuery,
    useUpdateDepartmentMutation
} from "../../../../../services/depart";
import SubjectInBranch from "./SubjectInBranch";
import UFO from "../../../../../Illustation/UFO";
import PermissionWrapper from "../../../../../services/PermissionWrapper";
import ImportSubjectsToDepartment from "./ImportSubjectsToDepartment";

function DepartManage(props) {
    const {branchID} = useParams();
    const [searchParams] = useSearchParams();
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [departmentList, setDepartmentList] = useState([]);
    const {data, isLoading, isFetching} = useGetDepartmentDataQuery({branchID: branchID});
    const [addDepartment] = useAddDepartmentMutation();
    const [updateDepartment] = useUpdateDepartmentMutation();

    const toast = useToast();
    const [modal, setModal] = useState(false);
    const [newDepartment, setNewDepartment] = useState({
        name: "",
        description: ""
    });
    const [isUpdate, setIsUpdate] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (data?.length) {
            setDepartmentList(data);
            const urlDepartment = searchParams.get("department");
            if (!urlDepartment) {
                navigate(`?department=${data[0].id}`, {replace: true});
            }
            setSelectedDepartment(urlDepartment || data[0].id);
        } else {
            setDepartmentList([]);
            setSelectedDepartment(null);
        }
    }, [branchID, data, searchParams, navigate]);

    // const onDepartmentChange = (value) => {
    //     navigate(`?department=${value}`);
    //     setSelectedDepartment(value);
    // };

    const handleAddDepartment = async () => {
        const departmentData = {
            name: newDepartment.name,
            description: newDepartment.description
        };
        try {
            const res = await addDepartment({branchID: branchID, post: departmentData});
            if (res?.data) {
                setNewDepartment({name: "", description: ""});
                setModal(false);
                toast.success("Đã thêm Khoa");
            }
        } catch (e) {
            toast.error(e);
        }
    };

    const onUpdateDepartment = (id) => {
        setIsUpdate(id);
        setModal(true);
        const department = departmentList.find(department => department.id === id);
        setNewDepartment({
            name: department.name,
            description: department.description
        });
    };

    const onCancel = () => {
        setIsUpdate(false);
        setNewDepartment({name: "", description: ""});
        setModal(false);
    };
    const [modalImport, setModalImport] = useState(false)

    const userRole = UserRole

    const handleUpdateDepartment = async () => {
        const departmentData = {
            name: newDepartment.name,
            description: newDepartment.description
        };
        try {
            const res = await updateDepartment({branchID: branchID, departmentID: isUpdate, ...departmentData});
            if (res?.data) {
                setNewDepartment({name: "", description: ""});
                toast.success("Đã cập nhật học phần");
                setModal(false);
                setIsUpdate(false);
            }
        } catch (e) {
            toast.error(e);
        }
    };

    return (
        <>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header">
                    <h3>{isUpdate ? "Chỉnh sửa ngành" : "Thêm ngành"}</h3>
                </div>
                <div className="modal-body">
                    <div className="is-flex vertical">
                        <div className="field">
                            <div className="label">Tên ngành</div>
                            <input
                                value={newDepartment.name}
                                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                                type="text"
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <div className="label">Mô tả</div>
                            <textarea
                                value={newDepartment.description}
                                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                                className="input"
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-bottom">
                    <div onClick={onCancel} className="btn btn-fill">Huỷ</div>
                    <div onClick={isUpdate ? handleUpdateDepartment : handleAddDepartment} className="btn">
                        {isUpdate ? "Cập nhật" : "Thêm"}
                    </div>
                </div>
            </Modal>
            <div className={"bg-light is-fill-y is-overflow is-flex vertical"}>
                <div className=" py-xxl bg-white border-b">
                    <div className="container-xl px-xl">
                        <div className="is-flex align-end jt-between">
                            <div>
                                <div className={"title-xxl"}>Các nhóm ngành</div>
                                <p className="text-disable">
                                    Quản lý các nhóm ngành
                                </p>
                            </div>
                            <PermissionWrapper permission={userRole.department.isEdit}>
                                <div className={"is-flex gap-m"}>
                                    <div onClick={() => setModalImport(true)} className={"btn  btn-outline "}>
                                        <> <DuckIcon icon={"sign-in"} className={"text-l"}></DuckIcon>
                                            Import
                                        </>
                                    </div>
                                </div>

                            </PermissionWrapper>
                            <ImportSubjectsToDepartment data={data} branchID={branchID} modal={modalImport}
                                                        setModal={setModalImport}></ImportSubjectsToDepartment>
                        </div>
                    </div>
                </div>
                <div className="container-xl px-xl pt-xxl  ">

                    <PermissionWrapper permission={userRole.department.isAccess}>
                        {departmentList.length === 0 ? <UFO cmt={"Không có ngành nào trong khoa"} size={400}/> : <>

                            <div className="columns   is-overflow">

                                <div className={"col  border bg-white  is-overflow "}>
                                    <div className="p-m is-flex align-center jt-between">
                                        <div className={"title-m"}>
                                            Ngành
                                        </div>
                                        <PermissionWrapper permission={userRole.department.isEdit}>
                                            <div className={"is-flex gap-m"}>
                                                <div onClick={() => setModal(true)}
                                                     className={"btn btn-primary text-white btn-s"}>
                                                    <DuckIcon icon={"add"} className={"text-l"}/>
                                                    Thêm
                                                </div>
                                            </div>

                                        </PermissionWrapper>
                                    </div>
                                    <div className="is-flex vertical px-m gap-m">
                                        {isLoading || isFetching ? (
                                            <TableSkeleton skeleton={'28px'}/>
                                        ) : (
                                            departmentList.map((item, index) => (
                                                <DepartRow
                                                    active={selectedDepartment}
                                                    onUpdateDepartment={() => onUpdateDepartment(item.id)}
                                                    key={index}
                                                    data={item}
                                                />
                                            ))
                                        )}
                                    </div>

                                </div>
                                <div className="col-2 ">
                                    <SubjectInBranch onUpdateDepartment={() => onUpdateDepartment(selectedDepartment)}
                                                     department={departmentList.find(department => department.id === selectedDepartment)}/>
                                </div>
                            </div>
                        </>}
                    </PermissionWrapper>
                </div>
            </div>
        </>
    );
}

export default DepartManage;
