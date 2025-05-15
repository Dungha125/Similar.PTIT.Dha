import React, {useEffect, useRef, useState} from 'react';
import {
    useAssignUserToSubjectMutation,
    useGetDepartmentInSubjectQuery,
    useRemoveSubjectFromDepartmentMutation
} from '../../../services/subject';
import DuckIcon from 'duckicon';
import {useContextMenu} from '../../../Sponsor/ContextMenu/ContextMenuProvider';
import SelectLi from '../../../Sponsor/ContextMenu/SelectLi';
import {useToast} from '../../../Sponsor/Toast/useToast';
import Modal from '../../../Sponsor/Slice/Modal';
import TagsInput from '../../../Sponsor/Tags/TagsInput';
import {useSuggestUserQuery} from '../../../services/user';
import {useGetBranchDataQuery} from "../../../services/branch";
import {UserRole} from "../../RoleMap";

function DepartmentInSubject({ subject }) {
    const { data: departmentData, isFetching, isLoading } = useGetDepartmentInSubjectQuery({ subjectID: subject.id });
    const [departmentList, setDepartmentList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState([]);
    const rtkQuery = useSuggestUserQuery({ subjectID: subject.id }, { skip: inputValue.length < 2 });
    const [assignUser] = useAssignUserToSubjectMutation();
    const onTagsChange = (updatedTags) => {
        setTags(updatedTags);
    };
    useEffect(() => {
        if (departmentData?.length) {
            setDepartmentList(departmentData);
        } else {
            setDepartmentList([]);
        }
    }, [subject, departmentData]);
    const {data: branchData, error} = useGetBranchDataQuery();
    const userRole = UserRole;
    const [branchList, setBranchList] = useState([]);
    useEffect(() => {
        if (branchData?.length) {
            setBranchList(branchData);
        }
    }, [branchData]);
    const toast = useToast();
    const [modal, setModal] = useState(false);
    const handleAssignUser = async () => {
        const data = tags.map(item => item.tag);
        try {
            const res = await assignUser({ subjectID: subject.id, userID: data }).unwrap();
            if (res) {
                setModal(false);
                console.log(data);
                toast.success("Đã thêm giảng viên");
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra");
        }
    };
    const handleInputValueChange = (value) => setInputValue(value);
    const renderActionName = (item) => item.username;
    const handleItemAction = (item) => {
        console.log(item);
        const newTag = { id: item.id, username: item.username };
        if (!tags.some((t) => t.id === newTag.id)) {
            setTags((prevTags) => {
                const updatedTags = [...prevTags, newTag];
                return updatedTags;
            });
            console.log(tags);
        }
        setInputValue('');
    };
    const handleRemoveTag = (id) => {
        const newTags = tags.filter((tag) => tag.id !== id);
        setTags(newTags);
    };
    const ShowTags = () => {
        return tags.map((tag, index) => (
            <span onClick={() => handleRemoveTag(tag.id)} className="tag pr-x mx-xs" key={index}>
                {tag.username}
                <div className="bg-hover-primary-light pr-xs rounded" style={{ marginLeft: '5px' }}>
                    <DuckIcon icon="close" />
                </div>
            </span>
        ));
    };
    const [isClear, setIsClear] = useState(false);
    if(!subject?.id) return null;
    return (
        <div>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header">
                    <h3>Thêm giảng viên</h3>
                    <div className="bg-light p-m is-fill-x rounded-s">
                        <p className={"text-s"}>Bạn có thể thêm các giảng viên có quyền tải lên file</p>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="is-flex vertical">
                        <div className="p-m">
                            <TagsInput
                                rtkQuery={rtkQuery}
                                onInputValueChange={handleInputValueChange}
                                inputValue={inputValue}
                                isLoading={rtkQuery.isLoading}
                                renderActionName={renderActionName}
                                handleItemAction={handleItemAction}
                                onClear={isClear}
                                children={<ShowTags />}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-bottom">
                    <div onClick={(e) => (setModal(false), e.stopPropagation())} className="btn btn-fill">
                        Huỷ
                    </div>
                    <div onClick={(e) => (handleAssignUser(), e.stopPropagation())} className="btn">
                        Thêm
                    </div>
                </div>
            </Modal>
            {/*<div className="is-flex jt-between align-center">*/}
            {/*    <div className="title-m">Danh sách khoa</div>*/}
            {/*    <div onClick={() => setModal(true)} className="is-flex align-center">*/}
            {/*        <div className="btn">Thêm khoa</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="is-fill-y mt-xl">
                <div className="table-section bg-white border">
                    <table className="table-strip-border">
                        <thead className={"text-disable bg-light"}>
                        <tr>
                            <th className={"p-s"}>STT</th>
                            <th className={"text-left p-s"}>Nhóm Ngành</th>
                            <th className={"p-s"}>
                                <div className="is-flex jt-end">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className={"text-l text-right"} icon={"context-menu-2"} />
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {departmentList.map((item, index) => {
                                return <DepartmentInSubjectRow key={index} branch={branchList.find(b => b.id === item.branch_id).name} index={index} data={item} subjectID={subject.id} />;
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const DepartmentInSubjectRow = ({ index, data, subjectID ,branch}) => {
    const buttonRef1 = useRef(null);
    const [removeDepartmentInSubject] = useRemoveSubjectFromDepartmentMutation();
    const toast = useToast();
    const { showMenu } = useContextMenu();

    const handleRemove = async () => {
        try {
            await removeDepartmentInSubject({ subjectID: [subjectID],branchID:data.branch_id, departmentID: data.id }).unwrap();
            toast.success("Đã xóa ");
        } catch (error) {
            toast.error("Thất bại");
        }
    };
    const tableMenu = [
        {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleRemove
        },
    ];
    const handleOpenMenu = (event) => {
        showMenu(buttonRef1, <div className={"select-list active"}>{tableMenu.map((item, index) => <SelectLi key={index} item={item} />)}</div>, 200, 100);
        event.stopPropagation();
    };
    return (
        <tr>
            <td className={"p-s text-center text-semi"}>{index + 1}</td>
            <td className={"p-s"}>
                <div>
                    <div className="title-m">{data.name}</div>
                    <div className="text-s text-mute">{branch}</div>
                </div>
            </td>
            <td className={"p-s"}>
                <div ref={buttonRef1} onClick={(e) => handleOpenMenu(e)} className="is-flex jt-end">
                    <div className="btn btn-ghost">
                        <DuckIcon className={"text-l text-right"} icon={"circle"} />
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default DepartmentInSubject;