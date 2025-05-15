import React, {useRef, useState} from 'react';
import DuckIcon from "duckicon";
import {useDeleteDepartmentMutation} from "../../../../../services/depart";
import {useContextMenu} from "../../../../../Sponsor/ContextMenu/ContextMenuProvider";
import SelectLi from "../../../../../Sponsor/ContextMenu/SelectLi";
import {UserRole} from "../../../../RoleMap";
import PermissionWrapper from "../../../../../services/PermissionWrapper";
import {Link} from "react-router-dom";


function DepartRow({data, onUpdateDepartment, onClick, active}) {
    const [deleteDepartment] = useDeleteDepartmentMutation()
    const [menu, setMenu] = useState(false)
    const selectRef = useRef(null);
    const handleDelete = async () => {
        console.log(data.id)
        try {
            await deleteDepartment({branchID: data.branch_id, departmentID: data.id}).unwrap()
        } catch (e) {
            console.error(e)
        }
    }
    const userRole = UserRole

    return (
        <Link to={`?department=${data.id}`}
              className={` ${active === data.id ? "bg-primary-light" : "bg-light"} px-s py-xs  is-flex jt-between bg-hover-sliver align-center rounded-s cursor-pointer `}>
            <div className={""}>

                <div className=" is-flex p-s align-center">
                    <div className="is-flex  vertical gap-s animate-DFJ">

                        {/*<div className=" is-flex">*/}
                        {/*<DuckIcon className={`text-xl ${active === data.id ? "text-primary" : " text-disable"} `}*/}
                        {/*          icon={"folder"}></DuckIcon>*/}
                        <div className={`${active === data.id ? " text-primary text-semi" : "text-mute"} text-s `}>
                            {data.name}
                        </div>
                        <p className={"text-xs"}>{data.description || "Description"}</p>

                        {/*</div>*/}

                    </div>
                </div>

            </div>
            <div ref={selectRef} className={"is-relative"}>
                <div className="">
                    <div className="is-flex   jt-end px-xs animate-DFJ">
                        <PermissionWrapper permission={userRole.department.isEdit}>

                            <div onClick={() => handleDelete()} className=" btn btn-s btn-ghost px-xs">
                                <DuckIcon className={"text-l text-primary "} icon={"trash-can-blank "}/>
                            </div>
                        </PermissionWrapper>

                    </div>

                </div>

            </div>
        </Link>
    );
}

export default DepartRow;