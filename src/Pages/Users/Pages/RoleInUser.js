import React, {useEffect, useState} from 'react';
import {useGetRoleQuery} from "../../../services/role";
import DuckIcon from "duckicon";
import Modal from "../../../Sponsor/Slice/Modal";
import ModalSlide from "../../../Sponsor/Slice/ModalSlide";
import {AddRoles} from "./AddRoles";
import {RoleRow} from "./RoleRow";
// Định nghĩa màu sắc cho từng method
const HttpMethodsCheckbox = ({methods}) => {
    // Hàm kiểm tra method có trong mảng hay không
    const isMethodPresent = (method) => methods.includes(method);
    return (
        <>
            <td>
                <div className="is-center">
                    <div style={{width: 40, height: 32}} className="form-check">
                        <input type="checkbox" checked={isMethodPresent('GET')} readOnly/>
                        <label className={""}></label>
                    </div>
                </div>
            </td>
            <td>
                <div className="is-center">
                    <div style={{width: 40, height: 32}} className="form-check is-center">
                        <input type="checkbox" checked={isMethodPresent('POST')} readOnly/>
                        <label className={""}></label>
                    </div>
                </div>

            </td>
            <td>
                <div className="is-center">
                    <div style={{width: 40, height: 32}} className="form-check">
                        <input type="checkbox" checked={isMethodPresent('PATCH')} readOnly/>
                        <label className={""}></label>
                    </div>
                </div>
            </td>
            <td>
                <div className="is-center">
                    <div style={{width: 40, height: 32}} className="form-check">
                        <input type="checkbox" checked={isMethodPresent('DELETE')} readOnly/>
                        <label className={""}></label>
                    </div>
                </div>
            </td>

        </>
    );
};

function RoleInUser(props) {
    const {data: roleData, isLoading: roleLoading, isFetching: roleFetching} = useGetRoleQuery();
    const [roleList, setRoleList] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    useEffect(() => {
        if (roleData) {
            setRoleList(roleData?.roles);
        }
    }, [roleData]);
    const [modal, setModal] = useState(false)
    const onCancel = () => {
        setModal(false);
    };
    const onUpdate =(role)=>{
        setIsUpdate(role)
        setModal(true);
    }
    return (
        <>
            <ModalSlide isOpen={modal}  onClose={() => setModal(false)}>
                <AddRoles
                    isUpdate={isUpdate}
                    setIsUpdate={setIsUpdate}
                    onCancel={() => setModal(false)}
                    onClose={(data) => {
                        onCancel()
                    }}
                />

            </ModalSlide>
            <div className=" py-xxl border-b">
                <div className="container-xl px-xl">
                    <div className="is-flex jt-between">
                        <div>
                            <div className={"title-xxl"}>Quyền</div>
                            <p className="text-disable">
                                Quản lý quyền của người dùng
                            </p>
                        </div>
                        <div onClick={() => setModal(true)} className="btn ">
                            <DuckIcon icon={"add"} className={"text-l"}/>
                            <span>Thêm</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xl px-xl pt-xl">
                <div className="table-section bg-white border  ">
                    <table className={"table-strip-border rounded-m "}>
                        <thead className={"text-disable"}>
                        <tr>
                            <th className={"px-m py-s  text-s text-left"}>Role</th>
                            <th className={"p-s text-left"}></th>
                            <th className={"p-s text-left"}></th>
                            <th className={"p-s text-left"}></th>
                            <th className={"p-s text-left"}>
                                <div className="is-flex jt-end">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className={"text-l text-right text-disable"}
                                                  icon={"context-menu-2 "}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {!roleFetching&& !roleLoading && roleList?.map((role, index) => {
                            return   <RoleRow  onUpdate={()=>onUpdate(role)} role={role} key={index}></RoleRow>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default RoleInUser;