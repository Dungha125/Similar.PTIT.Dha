import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from "../../../Sponsor/Slice/Modal";
import UploadFolder from "./AddFile/UploadFolder";
import { useGetBranchDataQuery } from "../../../services/branch";
import { useGetDepartmentDataQuery } from "../../../services/depart";
import { useGetSubjectDataQuery } from "../../../services/subject";
import { useGetFilesDataQuery } from "../../../services/file";
import { UserRole } from "../../RoleMap";
import PermissionWrapper from "../../../services/PermissionWrapper";
import DashboardSection from "./DashboardSection";
import FilterSection from "./FilterSection";
import FileTableSection from "./FileTableSection";

function mergeSubjectNames(fileData, subjectList) {
    if (!fileData?.files || !Array.isArray(subjectList)) {
        return { files: [], totalPage: 0 };
    }
    const subjectMap = new Map(subjectList.map(sub => [String(sub.id), sub.name]));
    return {
        ...fileData,
        files: fileData.files.map(file => ({
            ...file,
            subject_name: subjectMap.get(String(file.subject_id)) || "Unknown"
        }))
    };
}
function ResourceInFile() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedBranch, setSelectedBranch] = useState({ id: searchParams.get('branch') || 'all', name: "Tất cả" });
    const [selectedDepartment, setSelectedDepartment] = useState({ id: searchParams.get('department') || 'all', name: "Tất cả" });
    const [selectedSubject, setSelectedSubject] = useState({ id: searchParams.get('subject') || 'all', name: "Tất cả" });
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [modal, setModal] = useState(false);

    const { data: branchData } = useGetBranchDataQuery();
    const { data: departmentData } = useGetDepartmentDataQuery({ branchID: selectedBranch.id !== 'all' ? selectedBranch.id : undefined });
    const { data: subjectData } = useGetSubjectDataQuery({
        branchID: selectedBranch.id !== 'all' ? selectedBranch.id : "all",
        departmentID: selectedDepartment.id !== 'all' ? selectedDepartment.id : "all"
    });
    const { data: fileData, isLoading: filesLoading, isFetching: fileFetching } = useGetFilesDataQuery({
        branchID: selectedBranch.id !== 'all' ? selectedBranch.id : "all",
        subjectID: selectedSubject.id !== 'all' ? selectedSubject.id : "all",
        departmentID: selectedDepartment.id !== 'all' ? selectedDepartment.id : "all",
        fileName: "all",
        uploadBy: "all",
        page,
        limit: 12,
    });

    const [branchList, setBranchList] = useState([{ id: "all", name: "Tất cả" }]);
    const [departmentList, setDepartmentList] = useState([{ id: "all", name: "Tất cả" }]);
    const [subjectList, setSubjectList] = useState([{ id: "all", name: "Tất cả" }]);
    const [fileList, setFileList] = useState({ files: [], totalPage: 0 });

    // Update branch list
    useEffect(() => {
        if (branchData?.length) {
            setBranchList([{ id: "all", name: "Tất cả" }, ...branchData]);
        }
    }, [branchData]);

    // Update department list
    useEffect(() => {
        if (selectedBranch.id === 'all') {
            setDepartmentList([{ id: "all", name: "Tất cả" }]);
            setSelectedDepartment({ id: "all", name: "Tất cả" });
        } else if (departmentData?.length) {
            setDepartmentList([{ id: "all", name: "Tất cả" }, ...departmentData]);
        } else {
            setDepartmentList([{ id: "all", name: "Tất cả" }]);
        }
    }, [departmentData, selectedBranch]);

    // Update subject list
    useEffect(() => {
        if (selectedDepartment.id === 'all' || selectedBranch.id === 'all') {
            setSubjectList([{ id: "all", name: "Tất cả" }]);
            setSelectedSubject({ id: "all", name: "Tất cả" });
        } else if (subjectData?.length) {
            setSubjectList([{ id: "all", name: "Tất cả" }, ...subjectData]);
        } else {
            setSubjectList([{ id: "all", name: "Tất cả" }]);
        }
    }, [subjectData, selectedDepartment, selectedBranch]);

    // Update file list
    useEffect(() => {
        if (fileData?.files) {
            setFileList(mergeSubjectNames(fileData, subjectList));
        } else {
            setFileList({ files: [], totalPage: 0 });
        }
    }, [fileData, subjectList]);

    const handleChangeBranch = (item) => {
        setSelectedBranch(item);
        setSelectedDepartment({ id: "all", name: "Tất cả" });
        setSelectedSubject({ id: "all", name: "Tất cả" });
        setDepartmentList([{ id: "all", name: "Tất cả" }]);
        setSubjectList([{ id: "all", name: "Tất cả" }]);
        setPage(1);
        setSearchParams({ branch: item.id, department: "all", subject: "all", page: 1 });
    };

    const handleChangeDepartment = (item) => {
        setSelectedDepartment(item);
        setSelectedSubject({ id: "all", name: "Tất cả" });
        setSubjectList([{ id: "all", name: "Tất cả" }]);
        setPage(1);
        setSearchParams({ branch: selectedBranch.id, department: item.id, subject: "all", page: 1 });
    };

    const handleChangeSubject = (item) => {
        setSelectedSubject(item);
        setPage(1);
        setSearchParams({ branch: selectedBranch.id, department: selectedDepartment.id, subject: item.id, page: 1 });
    };

    const handleSetPage = (newPage) => {
        setPage(newPage);
        setSearchParams({ branch: selectedBranch.id, department: selectedDepartment.id, subject: selectedSubject.id, page: newPage });
    };

    return (
        <div className="is-flex vertical gap-m">
            <Modal isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header">
                    <h3>Tải lên file</h3>
                </div>
                <UploadFolder onCancel={() => setModal(false)} />
            </Modal>
            <DashboardSection onUploadClick={() => setModal(true)} userRole={UserRole} />
            <div className="container-xl px-xl min-y-100">
                <PermissionWrapper permission={UserRole.file.isAccess}>
                    <FilterSection
                        branchList={branchList}
                        departmentList={departmentList}
                        subjectList={subjectList}
                        selectedBranch={selectedBranch}
                        selectedDepartment={selectedDepartment}
                        selectedSubject={selectedSubject}
                        onChangeBranch={handleChangeBranch}
                        onChangeDepartment={handleChangeDepartment}
                        onChangeSubject={handleChangeSubject}
                    />
                    <FileTableSection
                        fileList={fileList}
                        filesLoading={filesLoading}
                        fileFetching={fileFetching}
                        currentPage={page}
                        handleSetPage={handleSetPage}
                    />
                </PermissionWrapper>
            </div>
        </div>
    );
}

export default ResourceInFile;