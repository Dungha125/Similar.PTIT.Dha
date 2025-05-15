import React from 'react';
import SubjectTable from "./SubjectTable";
import {LogoDaiNam} from "../../CoreBase/Brand";
import DuckIcon from "duckicon";

function SubjectManage(props) {
    return (
        <div className="is-relative is-overflow bg-white is-flex vertical" style={{height: "calc( 100vh)"}}>
            <div className="is-sticky overview bg-white" style={{top: "0px", zIndex: 1}}>
                <div
                    className={`is-flex header border-b jt-between align-center px-m `}>
                    <ol className={`breadcrumb  pl-x my-s `}>
                        <li className="breadcrumb-item is-center">
                            <LogoDaiNam width={32} height={32}/>
                        </li>
                        <li className="breadcrumb-item is-center active">
                            {/*<Link className={"rounded-s"} to={"/admin/user"}>*/}
                            <div className={"title-s"}> Quản lý học phần</div>
                            {/*</Link>*/}
                        </li>
                    </ol>
                    <div className="is-flex gap-m">
                        <div className="btn btn-s btn-fill ">
                            <DuckIcon className="text-l text-right" icon="pen"/>
                        </div>
                    </div>
                </div>

            </div>
            <SubjectTable/>
        </div>
    );
}

export default SubjectManage;