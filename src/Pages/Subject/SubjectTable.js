import React, {useEffect, useState} from 'react';
import Modal from "../../Sponsor/Slice/Modal";
import {UserRole} from "../RoleMap";
import DuckIcon from "duckicon";
import {TableSkeleton} from "../../Sponsor/Skeleton/Skeleton";
import {useSearchParams} from "react-router-dom";
import {useGetDepartmentDataQuery} from "../../services/depart";
import {useAddSubjectMutation, useGetSubjectDataQuery, useUpdateSubjectMutation} from "../../services/subject";
import {useToast} from "../../Sponsor/Toast/useToast";
import DuckSelect from "../../Sponsor/Select";
import {useGetBranchDataQuery} from "../../services/branch";
import SubjectRow from "./SubjectRow";
import ModalSlice from "../../Sponsor/Slice/ModalSlide";
import SelectSubject from "./SelectSubject";
import {useSelector} from "react-redux";
import UFO from "../../Illustation/UFO";
import ImportSubjects from "./ImportSubjects";

function SubjectTable(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedBranch, setSelectedBranch] = useState({id: searchParams.get('branch') || 'all', name: "Tất cả"});
    const [selectedDepartment, setSelectedDepartment] = useState({
        id: searchParams.get('department') || 'all',
        name: "Tất cả"
    });

    const [addSubject] = useAddSubjectMutation();
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


    const [tags, setTags] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [isClear, setIsClear] = useState(false);
    const [modal, setModal] = useState(false)
    const [modalImport, setModalImport] = useState(false)
    const [modalSlide, setModalSlide] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newSubject, setNewSubject] = useState({
        name: "",
        description: ""
    });
    const toast = useToast()


    const onSelected = (item) => {
        setModalSlide(true)
        setSelectedSubject(item)
    }
    const handleClear = () => {
        setIsClear(!isClear);
        setTags([]);
    };

    const handleRemoveTag = (id) => {
        const newTags = tags.filter((tag) => tag.id !== id);
        setTags(newTags);
    };
    const onUpdateSubject = (id) => {
        setIsUpdate(id);
        setModal(true);
        const subject = subjectList.find(subject => subject.id === id);
        setNewSubject({
            name: subject.name,
            description: subject.description
        });
    };

    const handleUpdateSubject = async () => {
        const subjectData = {
            name: newSubject.name,
            description: newSubject.description
        };
        try {
            const res = await updateSubject({...subjectData});
            if (res?.data) {
                setNewSubject({name: "", description: ""});
                toast.success("Đã cập nhật ");
                setModal(false);
                setIsUpdate(false);
            }
        } catch (e) {
            toast.error(e);
        }
    };


    // Update URL parameters and state on selection change
    const handleChangeDepartment = (item) => {
        setSelectedDepartment(item);
        setSearchParams({branch: selectedBranch.id, department: item.id});
    };
    const handleChangeBranch = (item) => {
        setSelectedBranch(item);
        setSearchParams({branch: item.id, department: 'all'});
    }
    const userRole = UserRole;
    const handleAddSubject = async () => {
        const subjectData = {
            name: newSubject.name,
            description: newSubject.description
        }
        console.log(subjectData)
        try {
            const res = await addSubject({post: subjectData}).unwrap()
            if (res) {
                setModal(false)
                handleClear()
                toast.success("Đã thêm học phần")
            }
        } catch (e) {
            console.error(e)
            toast.error("Có lỗi xảy ra")
        }
    }

    // Update department list when data changes
    useEffect(() => {
        if (departmentData?.length) {
            setDepartmentList([{
                name: "Tất cả",
                id: "all"
            }, ...departmentData]);
        }
    }, [departmentData, selectedBranch]);

    // Update branch list when data changes
    useEffect(() => {
        if (branchData?.length) {
            setBranchList([{
                name: "Tất cả",
                id: "all"
            }, ...branchData]);
            setDepartmentList([])
        }
    }, [branchData]);
    const onCancel = () => {
        setIsUpdate(false);
        setNewSubject({name: "", description: ""});
        setModal(false);
    };

    useEffect(() => {
        setSubjectList([])
        if (subjectData?.length) {
            setSubjectList(subjectData)
        }
    }, [selectedBranch.id, subjectData, selectedDepartment.id]);
    useEffect(() => {
        if (performance.navigation.type === 1) { // Kiểm tra nếu là reload (F5)
            window.location.href = "/admin/subject?branch=all&department=all";
        }
    }, []);
    return (
        <>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header  ">
                    <h3>{isUpdate ? "Chỉnh sửa" : "Thêm học phần"}</h3>
                </div>
                <div className="modal-body">
                    <div className="is-flex vertical">
                        <div className="field">
                            <div className="label">Tên học phần</div>
                            <input
                                value={newSubject.name}
                                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                                type="text"
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <div className="label">Mô tả</div>
                            <textarea
                                value={newSubject.description}
                                onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                                className="input"
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-bottom">
                    <div onClick={onCancel} className="btn btn-fill">Huỷ</div>
                    <div onClick={isUpdate ? handleUpdateSubject : handleAddSubject} className="btn">
                        {isUpdate ? "Cập nhật" : "Thêm"}
                    </div>
                </div>
            </Modal>
            <ModalSlice isOpen={modalSlide}>

                {selectedSubject && <SelectSubject onClose={() => setModalSlide(false)} subject={selectedSubject}/>}
            </ModalSlice>
            <div className=" py-xxl border-b">
                <div className="container-xl px-xl">
                    <div className="is-flex jt-between">
                        <div>
                            <div className={"title-xxl"}>Quản lý học phần</div>
                            <p className="text-disable">
                                Quản lý học phần trong hệ thống
                            </p>
                        </div>
                        {userRole.subject.isEdit && <div className={"is-flex gap-m"}>
                            <div onClick={() => setModalImport(true)} className={"btn  btn-outline "}>
                                <> <DuckIcon icon={"sign-in"} className={"text-l"}></DuckIcon>
                                    Import
                                </>
                            </div>
                            <div onClick={() => setModal(true)} className={"btn   "}>
                                <> <DuckIcon icon={"add"} className={"text-l"}></DuckIcon>
                                    Thêm học phần
                                </>
                            </div>

                        </div>
                        }
                        <ImportSubjects modal={modalImport} setModal={setModalImport}></ImportSubjects>

                    </div>
                </div>
            </div>
            <div className="container-xl  px-xl pt-xl is-flex vertical is-grow">
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
                                     className={`p-s rounded-xs ${selectedBranch === item ? "title-m text-black" : " text-mute bg-hover-light"}`}>
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
                            disable={departmentData?.length === 0}
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
                <div className="  table-section bg-white border rounded-s tableFixHead   ">
                    <table className={`table-strip-border`}>
                        <thead>
                        <tr className={"text-disable bg-light"}>
                            <th className={"px-s px-l"}>
                                <div className="text-s text-left">STT</div>
                            </th>
                            <th className={""}>
                                <div className="text-s text-left">Học phần</div>
                            </th>

                            <th className={"text-left  px-l py-s"}>

                                <div className="text-s ">Mô tả</div>
                            </th>


                            <th className={""}>
                                <div className="is-flex jt-end">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className={"text-l text-right"} icon={"context-menu-2 "}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className={" "}>
                        {subjectList.length > 0 ?
                            subjectLoading && subjectFetching ?
                                <TableSkeleton skeleton={'28px'}/> : <>
                                    {subjectList.map((item, index) =>
                                        <SubjectRow index={index} onSelect={() => onSelected(item)}
                                                    onUpdate={() => onUpdateSubject(item.id)}
                                                    subject={item} department={selectedDepartment.id}/>
                                    )}  </> : <tr>
                                <td colSpan={4}><UFO cmt={"Không có học phần nào"} size={300}/></td>
                            </tr>}
                        {}
                        </tbody>
                    </table>

                </div>
            </div>
            <div className="pb-xxl"></div>
        </>
    );
}

export default SubjectTable;