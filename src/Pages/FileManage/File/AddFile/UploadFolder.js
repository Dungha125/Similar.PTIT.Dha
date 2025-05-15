import React, {useEffect, useMemo, useRef, useState} from 'react';
import DuckSelect from "../../../../Sponsor/Select";
import {useGetDepartmentDataQuery} from "../../../../services/depart";
import FolderInput from "./UploadField";
import {useGetBranchDataQuery} from "../../../../services/branch";
import {useGetSubjectDataQuery} from "../../../../services/subject";

function UploadFolder({onCancel}) {
    const [selectedBranch, setSelectedBranch] = useState({id: 'all', name: "Chọn"});
    const [selectedDepartment, setSelectedDepartment] = useState({id: 'all', name: "Chọn"});
    const [selectedSubject, setSelectedSubject] = useState({id: '', name: "Chọn"});


    const [branchList, setBranchList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [subjectList, setSubjectList] = useState([{
        name: "all",
    }]);

    const {data: branchData} = useGetBranchDataQuery();
    const {
        data: departmentData,
        isDepartLoading,
        isDepartFetching
    } = useGetDepartmentDataQuery({branchID: selectedBranch.id})
    const {data: subjectData} = useGetSubjectDataQuery({
        branchID: selectedBranch.id,
        departmentID: selectedDepartment.id
    });
    const [fileToUpload, setFileToUpload] = useState(false);
    const [error, setError] = useState("");

    const handleChangeBranch = (item) => {
        console.log(item)
        setSelectedBranch(item);
        setError("")
        setDepartmentList([])
        setSubjectList([])
        setSelectedSubject({id: 'all', name: "Chọn"})
        setSelectedDepartment({id: 'all', name: "Chọn"})
    }
    const handleChangeDepartment = (item) => {
        setSelectedDepartment(item)
        setSubjectList([])

    };
    const handleChangeSubject = (item) => {
        setSelectedSubject(item);
    };
    const folderInputRef = useRef(null);
    const handleUploadClick = useMemo(() => (newFile) => {
        console.log(newFile)
        if (folderInputRef.current) {
            folderInputRef.current.uploadFiles();
        }
    }, []);
    const onClearFile = () => {
        setFileToUpload(null)
        if (folderInputRef.current) {
            folderInputRef.current.clearFile();
        }
        setSelectedSubject({id: 'all', name: "Chọn"})
        setSelectedDepartment({id: 'all', name: "Chọn"})
        setSelectedBranch({id: 'all', name: "Chọn"})
        onCancel()
    }
    useEffect(() => {
        if (branchData?.length) {
            setBranchList(branchData);
        }
    }, [branchData]);
    useEffect(() => {
        if (departmentData?.length) {
            setDepartmentList(departmentData)
        }
    }, [departmentData, selectedBranch]);
    // Update branch list when data changes
    useEffect(() => {
        if (subjectData?.length) {
            setSubjectList(subjectData);
        }
    }, [subjectData, selectedDepartment]);
    return (<>
            <div className="modal-body   ">
                <div className="bg-white">
                    <div className="columns gap-x ">
                        <div className="field col">
                            <div className="label">Khoa</div>
                            <DuckSelect
                                data={branchList}
                                value={selectedBranch}
                                placeholder="Khoa"
                                onSelect={(item) => (handleChangeBranch(item))} // Callback khi chọn
                                child={({item, index}) => (
                                    <div title={item.name} key={index} className="p-s">
                                        <div className="is-flex gap-m">

                                            <p className={"text-xs"}>{item.name}</p>
                                        </div>
                                    </div>
                                )}
                            />
                            {error && <div className="text-secondary">{error}</div>}
                        </div>

                        <div className="field col">
                            <div className="label">Ngành</div>
                            <DuckSelect
                                disable={(isDepartLoading || isDepartFetching) || departmentList.length === 0}
                                data={departmentList}
                                value={selectedDepartment}
                                placeholder="Chọn ngành"
                                onSelect={(item) => (handleChangeDepartment(item), setError(""))} // Callback khi chọn
                                child={({item, index}) => (
                                    <div title={item.name} key={index} className="p-s">
                                        <div className="is-flex gap-m">

                                            <p className={"text-xs"}>{item.name}</p>
                                        </div>
                                    </div>
                                )}
                            />
                            {error && <div className="text-secondary">{error}</div>}
                        </div>
                        <div className="field col">
                            <div className="label">Học phần</div>
                            <DuckSelect
                                disable={(isDepartLoading || isDepartFetching) || subjectList.length === 0}
                                data={subjectList}
                                value={selectedSubject}
                                placeholder="học phần"
                                onSelect={(item) => (handleChangeSubject(item), setError(""))} // Callback khi chọn
                                child={({item, index}) => (
                                    <div title={item.name} key={index} className="p-s">
                                        <div className="is-flex gap-m">

                                            <p className={"text-xs"}>{item.name}</p>
                                        </div>
                                    </div>
                                )}
                            />
                            {error && <div className="text-secondary">{error}</div>}
                        </div>

                    </div>
                    <div className="field">
                        <div className="label">File</div>
                        <FolderInput subject={selectedSubject.id} ref={folderInputRef}
                                     setFileToUpload={setFileToUpload}></FolderInput>
                    </div>
                </div>

            </div>
            <div className="modal-bottom  ">
                <div onClick={onClearFile} className="btn btn-fill">
                    Huỷ
                </div>
                <div onClick={() => {
                    if (selectedDepartment.id === "") {
                        setError("Chưa chọn học phần")
                        return
                    }
                    if (fileToUpload) {
                        handleUploadClick(fileToUpload)
                    }
                }
                } className={`btn ${fileToUpload ? "" : "disable"}`}>
                    Thêm
                </div>
            </div>
        </>
    )
        ;
}

export default UploadFolder;

