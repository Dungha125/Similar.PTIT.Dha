import {useGetBranchDataQuery} from "../../../services/branch";
import React, {useEffect, useState} from "react";
import DuckIcon from "duckicon";
import {useNavigate} from "react-router-dom";
import Skeleton from "../../../Sponsor/Skeleton/Skeleton";
import {UserRole} from "../../RoleMap";
import PermissionWrapper from "../../../services/PermissionWrapper";

export const SelectBranch = () => {
    const [branchList, setBranchList] = useState([]);
    const {data: branchData, error, isLoading, isFetching} = useGetBranchDataQuery();
    const userRole = UserRole;
    useEffect(() => {
        if (branchData?.length) {
            setBranchList(branchData);
        }
    }, [branchData]);
    const navivate = useNavigate()
    const handleSelectBranch = (item) => {
        navivate(`/admin/branch/${item.id}`)
    }
    if (isLoading || isFetching) {
        return <div className="is-flex is-fill-y">
            <DuckIcon icon={"loading"} className={"text-xl text-primary"}></DuckIcon>
        </div>
    }

    return <div className="  is-full-y bg-white">
        <div className=" py-xxl border-b">
            <div className="container-xl px-xl">
                <div className="is-flex jt-between">
                    <div>
                        <div className={"title-xxl"}>Khoa</div>
                        <p className="text-disable">
                            Quản lý khoa trong hệ thống
                        </p>
                    </div>
                    <PermissionWrapper permission={userRole.branch.isEdit}>
                        <div className={"btn"}>
                            <> <DuckIcon icon={"add"} className={"text-l"}></DuckIcon>
                                Thêm khoa
                            </>
                        </div>
                    </PermissionWrapper>
                </div>
            </div>
        </div>
        <div className="container-xl px-xl ">
            <div className="is-flex is-grow vertical jt-between mt-xl">
                <PermissionWrapper permission={userRole.branch.isAccess}>
                    <>
                        <div className="columns gap-m py-m">
                            <div className="col-3">
                                <input type="search" placeholder="Tìm kiếm" className="is-fill-x"/>
                            </div>

                        </div>
                        <div className="is-grid grid-3 grid-m-2 ">
                            {!(isLoading || isFetching) && branchList.length ? branchList.map((item, index) => {
                                    return <div
                                        className={`bg-white border cursor-pointer text-black  rounded-m `}
                                        key={index}>
                                        <div className="p-l">
                                            <div className="is-flex jt-between  ">
                                                <div className="is-flex  align-center gap-m">
                                                    {/*<div className="is-center size-xxl bg-primary-light  rounded-s">*/}
                                                    {/*    <DuckIcon icon={"license"} className={"text-xxl "}/>*/}
                                                    {/*</div>*/}
                                                    <div>
                                                        <div className="title-l text-black">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs text-semi">
                                                            {item.branch_code}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="text-s text-disable pt-m size-y-xxl">
                                                {item.description}
                                            </div>
                                        </div>


                                        <div className="px-m pb-m jt-end is-flex mt-l">
                                            <div onClick={() => handleSelectBranch(item)}
                                                 className="btn btn-fill is-fill-x btn-primary">
                                                Quản lý
                                            </div>
                                        </div>

                                    </div>
                                }
                            ) : <Skeleton height={29}></Skeleton>}
                        </div>
                    </>
                </PermissionWrapper>

            </div>

        </div>
    </div>
}