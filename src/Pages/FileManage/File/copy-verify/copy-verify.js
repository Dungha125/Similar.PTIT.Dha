import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import DuckSelect from "../../../../Sponsor/Select";
import {useGetDepartmentDataQuery} from "../../../../services/depart";
import {useGetBranchDataQuery} from "../../../../services/branch";
import {useGetSubjectDataQuery} from "../../../../services/subject";
import {useToast} from "../../../../Sponsor/Toast/useToast";
import DuckIcon from "duckicon";
import {useUploadManager} from "./useUploadManager";
import UploadZip, {ZipInput} from "./ZipInput";
import {useUploadZipFileMutation} from "../../../../services/result";
import {ZipTable} from "./ZipTable";
import {useCreateLogMutation, useGetLogsQuery} from "../../../../services/privateCheckLog";

function CopyVerify() {
    const {data, error, isLoading} = useGetLogsQuery();
    const [folder,setFolder] = useState([])

    const handleAddFolder =(newFile)=>{
        setFolder(prevList => [ ...prevList,newFile]);
        console.log(folder)
    }

    useEffect(()=>{
        setFolder([])
        if (data?.length){
            setFolder(data)
        }
    },[data])
    return <div className="is-relative is-scroll-y bg-light" style={{height: "calc( 100vh )"}}>
        <div className="container-l   ">
            <div className=" mt-xxl ">
                <div className="col rounded-l  p-xxl bg-white ">
                    <div className="   ">
                        <div className="   ">
                            <CopyVerifyUpload handleAddFolder={handleAddFolder}/>
                        </div>
                    </div>
                </div>
                <div className="mt-xxl">

                    <div className=" p-xxl bg-white rounded-l min-y-100 bg-white">
                        <div className="  ">
                            <ZipTable data={folder}></ZipTable>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    </div>
}

function CopyVerifyUpload({handleAddFolder}) {

    const [fileToUpload, setFileToUpload] = useState(false);
    const [error, setError] = useState("");
    const [min_similarity_percent,setMin_similarity_percent]=useState(2)
    const [fileUpload] = useUploadZipFileMutation()
    const [createData] = useCreateLogMutation()
    const toast = useToast();
    const folderInputRef = useRef(null);
    const handleUploadClick = useMemo(() => async (newFile) => {
        console.log(newFile)
        const timestamp = Date.now();
        handleAddFolder({
            folder_name: newFile.name,
            total_file: 10,
            duration: 315.26,
            concat:newFile.name+timestamp,
            create_at: timestamp,
            status: false
        })
        try {
            const result = await fileUpload({
                file: newFile,
                timestamp:newFile.name+timestamp,
                min_similarity_percent:min_similarity_percent*10
            }).unwrap()
            if (!result || result.length === 0) {
                toast.error("Failed to upload file");
                return;
            }
            try {
                const res = await createData({ folder_name: newFile.name, concat:newFile.name+timestamp })
                if (!res ) {
                    toast.error("Failed to upload file");
                    return;
                }
            }catch (e){
                toast.error(`Create File Failed ${newFile.name}: ${e.message}`);
            }

            toast.success("UploadPage File thành công");
        } catch (e) {
            toast.error(`Failed to upload ${newFile.name}: ${e.message}`);
        }
    },  [min_similarity_percent, fileUpload, createData, toast, handleAddFolder]);
    const onClearFile = () => {
        setFileToUpload(null)
        if (folderInputRef.current) {
            folderInputRef.current.clearFile();
        }
    }
    return (<>

            <div className="bg-white ">
                    <ZipInput ref={folderInputRef} min_similarity_percent={min_similarity_percent} setMin_similarity_percent={setMin_similarity_percent}
                              setFileToUpload={setFileToUpload}></ZipInput>
            </div>
            <div className=" mt-xxl  is-flex  jt-center gap-s">
                <div onClick={onClearFile} className="btn btn-fill">
                    Huỷ
                </div>
                <div onClick={() => {
                    if (fileToUpload) {
                        onClearFile()
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

export default CopyVerify;
