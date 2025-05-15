import React, {useEffect, useRef, useState} from 'react';
import DuckIcon from "duckicon";
import {formatTimestamp} from "../../../../services/file";
import SelectLi from "../../../../Sponsor/ContextMenu/SelectLi";
import {useContextMenu} from "../../../../Sponsor/ContextMenu/ContextMenuProvider";
import {useGetSubjectDataQuery} from "../../../../services/subject";
import {useParams} from "react-router-dom";

function findDepartmentById(subjects, id) {
    if (subjects.length === 0) return null;
    return subjects.find(subjects => subjects.id === id).name;
}

function FileRow({data, department}) {
    const {branchID} = useParams()
    const [item, setItem] = useState(data)
    const [subjectList, setSubjectList] = useState([]);



    const buttonRef1 = useRef(null);
    const handleDelete = async () => {
        console.log(data.id)
    }
    const tableMenu = [
        {
            actionName: "Xem",
            icon: "eye",
            action: function () {
                console.log("eye")
            }
        },
        {
            actionName: "Sửa",
            icon: "document-edit",
            action: function () {
                console.log("edit")
            }
        },
        {
            actionName: "Xóa",
            icon: "trash-can-blank",
            action: handleDelete
        },


    ]
    const {
        showMenu,
    } = useContextMenu();
    return (
        <tr className={"bg-hover-light "}>
            <td className={"px-l py-s"}>
                <div className=" is-flex gap-m align-center">
                    <DuckIcon
                        className={`size-xxl text-l p-xs text-primary bg-primary-light rounded-s`}
                        icon={item.filetype === "docx" ? "document" : "license"}/>
                    <div className="is-flex vertical  animate-DFJ">
                        <div className={"title-m mb-xs text-capitalize"}>
                            {item.filename}
                        </div>
                        <div className={"text-s text-disable "}>
                            {item.file_size} MB
                        </div>

                    </div>
                </div>

            </td>

            <td className={"px-l py-xs"}>
                <div className="is-flex ">
                    {item.subject_name}
                </div>
            </td>

            <td className={""}>
                <div className="is-flex jt-center">
                    <div className={`title-s`}> {formatTimestamp(item.uploaded_at)} </div>
                </div>
            </td>
            <td className={""}>
                <div className="is-flex jt-center">
                    <div className={`title-s`}>  {item.uploaded_by_username} </div>
                </div>
            </td>
            <td>
                <div className="is-flex jt-end px-l py-xs animate-DFJ">
                    <div ref={buttonRef1}
                         onClick={() => showMenu(buttonRef1, <div className={"select-list active"}>
                             {tableMenu.map((item, index) => {
                                 return <SelectLi key={index} item={item}></SelectLi>
                             })}
                         </div>, 200, 100)} className="btn btn-ghost">
                        <DuckIcon className={"text-l text-right"} icon={"circle "}/>
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default FileRow;