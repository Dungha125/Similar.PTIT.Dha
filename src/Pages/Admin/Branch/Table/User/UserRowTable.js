import React, {useRef} from 'react';
import DuckIcon from "duckicon";
import {useUnassignUserToBranchMutation} from "../../../../../services/user";
import {useParams} from "react-router-dom";
import {UserRole} from "../../../../RoleMap";
import PermissionWrapper from "../../../../../services/PermissionWrapper";


function getInitials(name) {
    // Loại bỏ khoảng trắng thừa và chia tên thành các từ
    const words = name.trim().split(/\s+/);

    // Lấy chữ cái đầu tiên của từ đầu tiên và từ cuối cùng
    const initials = words[0][0].toUpperCase();

    return initials;
}

function UserRow({data}) {
    const { branchID } = useParams();
    const [unsignUser] = useUnassignUserToBranchMutation()
    const handleDelete = async () => {
        console.log(data.id)
        try {
            await unsignUser({branchID:branchID,userID: [ data.id]}).unwrap()
        } catch (e) {
            console.error(e)
        }
    }


    const ref = useRef(null);
    const userRole= UserRole
    return (
        <tr className={"bg-hover-light "}>
            <td className={"px-l py-s"}>
                <div className=" is-flex gap-m align-center">
                    <div className="size-xl rounded is-center bg-black"                     >
                        <h5 className={"text-white"}>{getInitials(data.username)}</h5>
                    </div>
                    <div className="is-flex vertical gap-s ">
                        <div className="title-s text-mute">
                            {data.username}
                        </div>
                        <div className=" text-xs text-disable ">
                            {data.email}
                        </div>
                    </div>
                </div>

            </td>

            <td className={"px-l py-xs"}>
                <div className=" text-xs text-disable ">
                    {data.email}
                </div>
                {/*<div className="is-flex align-center gap-m ">*/}
                {/*    <div*/}
                {/*        className={` size-s rounded animate-DFJ  */}
                {/*        ${item.status === "active" && "bg-primary"} */}
                {/*        ${item.status === "inactive" && "bg-secondary"} */}
                {/*        ${item.status === "mute" && "bg-mute"}`}>*/}

                {/*    </div>*/}
                {/*    <p className={"text-capitalize text-disable title-s"}>*/}
                {/*        {item.status}*/}
                {/*    </p>*/}
                {/*</div>*/}
            </td>


            <td>

                <div className="is-flex jt-end px-l py-xs animate-DFJ">
                    <PermissionWrapper permission={userRole.department.isEdit}>
                        <div ref={ref} onClick={() => handleDelete()} className="btn btn-ghost">
                            <DuckIcon className={"text-xl text-black text-right"} icon={"trash-can-blank"}/>
                        </div>
                    </PermissionWrapper>
                </div>
            </td>
        </tr>
    );
}

export default UserRow;