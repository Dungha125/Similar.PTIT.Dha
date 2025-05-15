import React, {useEffect, useRef, useState} from 'react';
import {formatTimestamp, useGetFilesDataQuery} from '../../../services/file';
import DuckIcon from 'duckicon';
import {useContextMenu} from '../../../Sponsor/ContextMenu/ContextMenuProvider';
import SelectLi from '../../../Sponsor/ContextMenu/SelectLi';
import {useToast} from '../../../Sponsor/Toast/useToast';

function FileInSubject({subject}) {
    const {data: fileData, isFetching, isLoading} = useGetFilesDataQuery({
        subjectID: subject.id, page: 1,
        limit: 12, departmentID: "all", fileName: "all",
        uploadBy: "all",
    });
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (fileData?.files) {
            setFileList(fileData.files);
        } else {
            setFileList([]);
        }
    }, [subject, fileData]);


    if (!subject?.id) return null;
    return (
        <div>
            <div className="is-fill-y mt-xl">
                <div className="table-section bg-white border">
                    <table className="table-strip-border">
                        <thead className={"text-disable bg-light"}>
                        <tr>
                            <th className={"p-s"}>Stt</th>
                            <th className={"text-left p-s"}>Filename</th>
                            <th className={"text-left p-s"}>Size</th>
                            <th className={"text-left p-s"}>CreateAt</th>
                            <th className={"p-s"}>
                                <div className="is-flex jt-end">
                                    <div className="btn btn-ghost">
                                        <DuckIcon className={"text-l text-right"} icon={"context-menu-2"}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {fileList.map((item, index) => {
                            return <FileInSubjectRow key={index} index={index} data={item} subjectID={subject.id}/>;
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const FileInSubjectRow = ({index, data, subjectID}) => {
    const buttonRef1 = useRef(null);
    const toast = useToast();
    const {showMenu} = useContextMenu();

    const handleRemove = async () => {
        try {
            // Implement remove file logic here
            toast.success("File removed successfully");
        } catch (error) {
            toast.error("Failed to remove file");
        }
    };
    const tableMenu = [
        {
            actionName: "Remove",
            icon: "trash-can-blank",
            action: handleRemove
        },
    ];
    const handleOpenMenu = (event) => {
        showMenu(buttonRef1, <div className={"select-list active"}>{tableMenu.map((item, index) => <SelectLi key={index}
                                                                                                             item={item}/>)}</div>, 200, 100);
        event.stopPropagation();
    };
    return (
        <tr className={"bg-hover-light "}>
            <td className={""}>
                <div className="is-flex jt-center">
                    <div className="text-xs text-disable">
                        {index+1}
                    </div>
                </div>
            </td>


            <td className={"px-l py-xs"}>
                <div className=" is-flex gap-m align-center">
                    <DuckIcon
                        className={`size-l text-l p-xs ${data.filetype === "pdf" ? "text-primary bg-primary-light" : "text-secondary bg-secondary-light"} rounded-s`}
                        icon={data.filetype === "docx" ? "document" : "license"}/>
                    <div className="is-flex vertical gap-s animate-DFJ">
                        <div className="title-s text-mute">
                            {data.filename}
                        </div>

                    </div>
                </div>

            </td>
            <td className={""}>
                <div className="is-flex jt-center">
                    <div className="text-xs text-disable">
                        {data.filesize}MB
                    </div>
                </div>
            </td>


            <td className={""}>
                <div className="is-flex jt-center">
                    <div className={`title-s`}> {formatTimestamp(data.uploaded_at)} </div>
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
};

export default FileInSubject;