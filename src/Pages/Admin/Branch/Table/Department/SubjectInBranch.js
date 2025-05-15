import React, {useEffect, useState} from 'react';
import {
    useAssignSubjectToDepartmentMutation,
    useGetSubjectDataQuery,
    useGetSuggestSubjectQuery
} from "../../../../../services/subject";
import DuckIcon from "duckicon";
import {TableSkeleton} from "../../../../../Sponsor/Skeleton/Skeleton";
import {UserRole} from "../../../../RoleMap";
import Modal from "../../../../../Sponsor/Slice/Modal";
import {useToast} from "../../../../../Sponsor/Toast/useToast";
import TagsInput from "../../../../../Sponsor/Tags/TagsInput";
import SubjectDepartmentRow from "./SubjectDepartmentRow";
import {useParams, useSearchParams} from "react-router-dom";
import UFO from "../../../../../Illustation/UFO";
import PermissionWrapper from "../../../../../services/PermissionWrapper";
import ImportSubjects from "../../../../Subject/ImportSubjects";
import ImportSubjectsToDepartment from "./ImportSubjectsToDepartment";

function SubjectInBranch({department,onUpdateDepartment}) {
    const {branchID} = useParams()
    const [searchParams] = useSearchParams();
    const urlDepartment = searchParams.get("department");
    const [subjectList, setSubjectList] = useState([]);
    const [allSubjectList, setAllSubjectList] = useState([]);
    const [assignSubject] = useAssignSubjectToDepartmentMutation()
    const {refetch} = useGetSubjectDataQuery({branchID, urlDepartment});
    const {
        data: subjectData,
        isLoading: subjectLoading,
        isFetching: subjectFetching
    } = useGetSubjectDataQuery({branchID: branchID, departmentID: urlDepartment});

    const {
        data: allSubjectData,
        isLoading: allSubjectLoading,
        isFetching: allSubjectFetching
    } = useGetSubjectDataQuery({branchID: "all", departmentID: "all"});
    console.log(department )
    useEffect(() => {
        if (allSubjectData?.length) {
            const uniqueSubjects = allSubjectData.filter((subject, index, self) =>
                index === self.findIndex((s) => s.id === subject.id)
            );
            setAllSubjectList(uniqueSubjects);
        }
    }, [allSubjectData]);

    useEffect(() => {

        if (subjectData?.length) {
            setSubjectList(subjectData)
        } else {
            setSubjectList([])
        }
    }, [branchID, subjectData, urlDepartment]);

    const [modal, setModal] = useState(false)

    const toast = useToast()

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const rtkQuery = useGetSuggestSubjectQuery(
        {subject: inputValue,department: urlDepartment},
        {skip: inputValue.length < 2}
    );
    const [isClear, setIsClear] = useState(false);

    const handleClear = () => {
        setIsClear(!isClear);
        setTags([]);
        setInputValue("")
    };
    const onCanCel = () => {
        setModal(false)
        handleClear()
    }
    const handleRemoveTag = (id) => {
        const newTags = tags.filter((tag) => tag.id !== id);
        setTags(newTags);
    };


    const handleInputValueChange = (value) => {
        console.log('value', value)
        setInputValue(value);
    }

    const renderActionName = (item) => item.name;
    const handleItemAction = (item) => {
        if (!tags.some((t) => t.id === item.id)) {
            setTags([...tags, {id: item.id, name: item.name}]);
            toast.success(`${item.name} added!`);
        }
        setInputValue(''); // Reset input field
    };
    const userRole = UserRole
    const handleAssignSubject = async () => {
        const data = tags.map(item => item.id)
        setModal(false)
        setTags([]);
        try {
            const res = await assignSubject({
                branchID: branchID,
                departmentID: urlDepartment,
                subjectIDs: data
            }).unwrap()
            refetch({forceRefetch: true});
            if (res) {

                console.log(data)
                toast.success(`Đã thêm ${data.length} học phần`)
            }
        } catch (e) {
            console.error(e)
            toast.error("Có lỗi xảy ra")
        }
    }


    if (!department?.name) {
        return <UFO cmt={"Chọn 1 Ngành để xem danh sách học phần"} size={300}/>
    }

    return (
        <>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header  ">
                    <h3>Thêm học phần</h3>

                    <div className=" bg-light p-m is-fill-x rounded-s">
                        <p className={"text-s"}> Bạn có thể thêm các học phần vào khoa </p>
                    </div>
                </div>
                <div className="modal-body   ">
                    <div className="is-flex vertical">
                        <div className="field">

                            <TagsInput
                                data={allSubjectList}
                                // data={inputValue?.length <2 ? [] : rtkQuery.data}
                                onInputValueChange={handleInputValueChange}
                                inputValue={inputValue}
                                isLoading={rtkQuery.isLoading || rtkQuery.isFetching}
                                renderActionName={renderActionName}
                                handleItemAction={handleItemAction}
                                onClear={isClear}
                                children={
                                    tags?.length ?
                                        <ShowTags tags={tags} onRemoveTag={handleRemoveTag}/> : null
                                }
                            />
                        </div>

                    </div>

                </div>

                <div className="modal-bottom  ">
                    <div onClick={onCanCel} className="btn btn-fill">
                        Huỷ
                    </div>
                    <div onClick={handleAssignSubject} className="btn ">
                        Thêm
                    </div>
                </div>
            </Modal>
            <div className="is-flex p-m  gap-l jt-between align-center ">
                <div className="is-block  gap-s animate-DFJ">

                    {/*<div className=" is-flex">*/}
                    {/*<DuckIcon className={`text-xl ${active === data.id ? "text-primary" : " text-disable"} `}*/}
                    {/*          icon={"folder"}></DuckIcon>*/}
                    <div className={` title-l `}>
                        {department?.name || "Name"}
                    </div>
                    <p className={"text-xs"}>{department?.description || "Description"}</p>

                    {/*</div>*/}
                </div>
                <div className="is-flex gap-s">

                    <PermissionWrapper permission={userRole.department.isEdit}>


                        <div onClick={() => setModal(true)} className={"btn btn-fill  "}>
                            <> <DuckIcon icon={"add"} className={"text-l"}></DuckIcon>
                                Thêm học phần
                            </>

                        </div>

                    </PermissionWrapper>
                    <div onClick={() => onUpdateDepartment(department.id)} className=" btn  btn-fill px-xs">
                        <DuckIcon className={"text-l  "} icon={"document-edit"}/> Chỉnh sửa
                    </div>
                </div>

            </div>

            <div className=" border bg-white  is-overflow ">


                <div className="is-flex  pb-l p-l   jt-between align-center">
                    <div className={"title-m"}>Học phần</div>


                </div>
                <div className=" table-section px-m bg-white rounded-s tableFixHead y-half ">
                    <table className={`table-strip-border`}>
                        <thead className={"text-disable "}>
                        <tr className={"bg-white border-b"}>
                            <th className={"px-s px-l"}>
                                <div className="text-s text-left">Khoa</div>
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
                        <tbody>
                        {subjectLoading || subjectFetching ?
                            <TableSkeleton skeleton={'28px'}/> : <>
                                {subjectList.map((item, index) =>
                                    <SubjectDepartmentRow key={index} subject={item} department={urlDepartment}/>
                                )}  </>}

                        </tbody>
                    </table>

                    {subjectList.length === 0 && <UFO size={300}/>}

                </div>
            </div>


        </>

    );
}

export default SubjectInBranch;

const ShowTags = ({
                      tags, onRemoveTag
                  }) => {
    return (
        <>
            {tags.map((tag, index) => (
                <span onClick={() => onRemoveTag(tag.id)} className="tag pr-x my-s mx-xs" key={index}>
                    {tag.name}
                    <div
                        className="bg-hover-primary-light pr-xs rounded"

                        style={{marginLeft: '5px'}}
                    >
                        <DuckIcon icon="close"/>
                    </div>
                </span>
            ))}
        </>

    );
};

