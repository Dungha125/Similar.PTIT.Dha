import React, {useRef} from "react";
import {useContextMenu} from "../../Sponsor/ContextMenu/ContextMenuProvider";
import SelectLi from "../../Sponsor/ContextMenu/SelectLi";
import DuckIcon from "duckicon";
import {useToast} from "../../Sponsor/Toast/useToast";
import {useNavigate, useParams} from "react-router-dom";
import {useRemoveSubjectFromDepartmentMutation} from "../../services/subject";

function SubjectRow({ subject, department,onUpdate ,onSelect,index}) {
    const { branchID } = useParams();
    const [removeSubjectFromDepartment, { isLoading, isSuccess, isError }] = useRemoveSubjectFromDepartmentMutation();
    const toast = useToast();

    const handleRemove = async () => {
        try {
            await removeSubjectFromDepartment({ branchID, departmentID:department, subjectID:[subject.id] }).unwrap();
            toast.success("Đã xóa học phần khỏi khoa");
        } catch (error) {
            toast.error("Xóa học phần khỏi khoa thất bại");
        }
    };


    const tableMenu = [
        {
            actionName: "Sửa",
            icon: "document-edit",
            action: function () {
                onUpdate(subject.id)
            }
        },
        {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleRemove
        },


    ]
    const navigate=  useNavigate()
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
    return <tr onClick={onSelect} className={"bg-hover-light cursor-pointer"}>
        <td className={"px-l py-s"}>
            <div className=" is-flex gap-m align-center">
                <div className="is-flex vertical gap-s ">
                    <div className="title-s text-disable">
                        {index + 1}
                    </div>

                </div>
            </div>
        </td>

        <td className={"py-m"}>
            <div className={"title-m mb-xs"}>
                {subject.name}
            </div>
            <div className={"text-s text-disable "}>
                {subject.code}
            </div>
        </td>
        <td className={"px-l py-s"}>
            <div className=" text-mute">
                {subject.description}
            </div>
        </td>
        <td>
            <div className="is-flex jt-end  py-xs animate-DFJ">
                <div ref={buttonRef1}
                     onClick={(e) => handleOpenMenu(e)} className="btn btn-ghost">
                    <DuckIcon className={"text-l text-right"} icon={"circle "}/>
                </div>
            </div>
        </td>
    </tr>
}

export default SubjectRow;