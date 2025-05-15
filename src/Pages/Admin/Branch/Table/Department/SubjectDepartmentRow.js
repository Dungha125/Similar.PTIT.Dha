import React, {useRef} from "react";
import {useContextMenu} from "../../../../../Sponsor/ContextMenu/ContextMenuProvider";
import SelectLi from "../../../../../Sponsor/ContextMenu/SelectLi";
import DuckIcon from "duckicon";
import {useToast} from "../../../../../Sponsor/Toast/useToast";
import {useParams} from "react-router-dom";
import {UserRole} from "../../../../RoleMap";
import {useRemoveSubjectFromDepartmentMutation} from "../../../../../services/subject";

function SubjectDepartmentRow({ subject, department }) {
    const { branchID } = useParams();
    const [removeSubjectFromDepartment, { isLoading, isSuccess, isError }] = useRemoveSubjectFromDepartmentMutation();
    const toast = useToast();

    const handleRemove = async () => {
        try {
            await removeSubjectFromDepartment({ branchID, departmentID:department, subjectID:[subject.id] }).unwrap();
            toast.success("Đã xóa học phần khỏi Nhóm ngành");
        } catch (error) {
            toast.error("Xóa học phần khỏi Nhóm ngành thất bại");
        }
    };
    const userRole = UserRole;

    const tableMenu = [
        userRole.department.editDepartment && {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleRemove
        },


    ]
    const buttonRef1 = useRef(null);
    const {
        showMenu,
    } = useContextMenu();
    return <tr>
        <td className={"px-l py-s"}>
            <div className=" is-flex gap-m align-center">
                <div className="is-flex vertical gap-s ">
                    <div className="title-s text-mute">
                        {subject.name}
                    </div>

                </div>
            </div>
        </td>
        <td className={"px-l py-s"}>
            <div className=" is-flex gap-m align-center">

                <div className="is-flex vertical gap-s ">
                    <div className=" text-mute">
                        {subject.description}
                    </div>

                </div>
            </div>
        </td>
        <td>
            <div className="is-flex jt-end  py-xs animate-DFJ">
                <div ref={buttonRef1}
                     onClick={handleRemove} className="btn btn-primary btn-ghost">
                    <DuckIcon className={"text-l text-primary text-right"} icon={"trash-can-blank "}/>
                </div>
            </div>
        </td>
    </tr>
}

export default SubjectDepartmentRow;