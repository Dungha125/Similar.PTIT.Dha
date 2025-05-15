import React, {useEffect, useState} from 'react';
import PDFH from "../PDFViewer/PDFH.tsx";
import {convertToIHighlights} from "../PDFViewer/type.tsx";
import {Menu} from "../Menu.tsx";
import {Link, useParams} from "react-router-dom";
import {useGetCheckerFilesFileIdQuery, useGetPreSignDownloadCheckerFileUrlMutation} from "../services/fileChecker";
import {Dainam} from "../Illustation/dainam";
import Skeleton from "../Sponsor/Skeleton/Skeleton";
import {BrandLogo} from "./Brand";
import {formatTimestamp} from "../services/file";
import DuckIcon from "duckicon";
import PDFReport from "../ReportDocument";
import html2pdf from 'html2pdf.js';
import TagsInput from "../Sponsor/Tags/TagsInput";
import Modal from "../Sponsor/Slice/Modal";

function Documentation() {

    const [listHighlights, setListHighlights] = useState([]);

    const [style, setStyle] = useState([
        {style: 0, color: 0},
        {style: 0, color: 1},
        {style: 0, color: 2},
        {style: 0, color: 3},
        {style: 0, color: 4}
    ]);
    const [expandItem, setExpandItem] = useState(true);

    const {fileID} = useParams(); // Lấy fileID từ URL
    const [pdfFile, setPdfFile] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Lấy thông tin file từ fileID
    const {data: fileInfo, isLoading: isLoadingFileInfo} = useGetCheckerFilesFileIdQuery(fileID, {
        skip: !fileID, // Chỉ gọi API nếu có fileID
    });


    const [selectedZoom, setSelectedZoom] = useState(100);


    const handleChangeZoom = (value) => {
        console.log("clicked");
        const currentZoom = parseInt(selectedZoom);
        if (value === 1 && currentZoom < 175) {
            setSelectedZoom(currentZoom + 25);
        } else if (value === -1 && currentZoom > 50) {
            setSelectedZoom(currentZoom - 25);
        }
    }
    const [getPreSignedUrl] = useGetPreSignDownloadCheckerFileUrlMutation();

    useEffect(() => {
        if (!fileInfo) return; // Chờ có thông tin file trước
        const subjectId = fileInfo.file.subject_id
        const fileName = fileInfo.file.filename
        setIsDownloading(true); // Bắt đầu tải
        setListHighlights(convertToIHighlights(fileInfo))
        console.log(listHighlights)
        getPreSignedUrl({subjectId, fileName})
            .unwrap()
            .then(async (res) => {
                console.log("Presigned URL:", res.url);

                // Tải file PDF
                const response = await fetch(res.url);
                if (!response.ok) throw new Error("Failed to fetch PDF");

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                setPdfFile(blobUrl);
            })
            .catch((error) => {
                console.error("Error fetching PDF:", error);
            })
            .finally(() => {
                setIsDownloading(false);
            });
    }, [fileInfo]); // Chạy khi fileInfo có dữ liệu
    const [modal, setModal] = useState(false)
    const onCanCel = () => {
        setModal(false)
    }
    if (!fileInfo) return <div></div>
    return (
        <div className={"p-m bg-document"}>
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header  ">
                    <h3 className={"text-center is-fill-x"}>Tính năng chưa hỗ trợ</h3>

                    <div className=" bg-light p-m is-fill-x rounded-s">
                        <p className={"text-m text-center"}> Tính năng này sẽ được cập nhật vào phiên bản sắp tới </p>
                    </div>
                </div>

                <div className="modal-bottom  ">
                    <div className="is-fill-x is-center">
                        <div onClick={onCanCel} className="btn ">
                            Đã hiểu
                        </div>
                    </div>

                </div>
            </Modal>
            <div className=" is-fill-x is-flex ">
                <Link to={"/"} className=" px-m pb-m ">
                    <BrandLogo/>
                </Link>
                <div className="is-flex px-m pb-m align-center is-fill-x jt-between">
                    <div className=" is-flex vertical gap-s">
                        <div className="title-m is-flex text-capitalize">
                            {fileInfo.file.filename}
                            <div className="ml-s bg-primary rounded-xs is-center size-x-xl  title-xs">
                                PDF
                            </div>
                        </div>
                        <div className="is-flex gap-l">
                            <div className="text-xs text-mute-2 ">
                                Tổng số % trùng lặp: {fileInfo.file.total_similarity_percent}
                            </div>
                            <div className="text-xs text-mute-2  is-flex align-center gap-s">
                        <span>
                             <DuckIcon className={"text-s"} icon={"double-checked"}></DuckIcon>
                        </span>
                                Đã kiểm
                                tra : {formatTimestamp(fileInfo.data.create_at)}
                            </div>

                        </div>

                    </div>
                    <div className={"is-flex gap-s"}>
                        <div className="btn btn-primary  text-white">
                            <DuckIcon className={"text-l mr-s"} icon={`upload`}></DuckIcon>
                            Chia sẻ
                        </div>
                        <div onClick={() => {
                            const element = document.getElementById('pdf-content')
                            if (!element) return
                            const opt = {
                                margin:       0.5,
                                filename:     'bao_cao.pdf',
                                image:        { type: 'jpeg', quality: 0.98 },
                                html2canvas:  { scale: 2 }, // 👈 nét hơn
                                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
                            };

                            html2pdf().set(opt).from(element).save();
                        }} className="btn btn-fill">
                            <DuckIcon className={"text-l mr-s"} icon={`download`}></DuckIcon>
                            Xuất báo cáo
                        </div>
                    </div>
                </div>


            </div>
            <div className="is-flex vertical is-calc2 is-overflow">
                <div className="columns is-grow gap-m">
                    {/*<div className={`sidebar rounded-x is-relative border-r ${expandItem ? "" : "hide"}`}*/}
                    {/*     style={{maxWidth: "660px"}}>*/}

                    {!fileInfo ?
                        <Skeleton height={"100%"}></Skeleton> :
                        <Menu setStyle={setStyle} style={style} styles={style}
                              list={fileInfo.data.data_result}></Menu>}

                    {/*</div>*/}
                    <div
                        className="col-4 is-calc2 bg-light border is-overflow  is-flex align-center vertical animate-DFJ">
                        <div className="border-b p-m is-fill-x  is-flex jt-between ">
                            <div className="is-flex gap-m align-center">
                                <div className="btn btn-ghost btn-s  gap-s  ">
                                    <DuckIcon className={"text-xl"} icon={`open`}></DuckIcon>
                                </div>
                                <DuckIcon className={"text-xl"} icon={`zoom`}></DuckIcon>
                            </div>
                            <div className="is-flex align-center gap-s">
                                <div onClick={(e) => selectedZoom !== 50 && handleChangeZoom(-1)}
                                     className={`btn btn-s  btn-ghost ${selectedZoom === 50 && 'disable'}`}>
                                    <DuckIcon className={"text-l"} icon={`subtract`}></DuckIcon>
                                </div>
                                <div className={"border rounded-s"}>
                                    <div className={"btn btn-ghost btn-s"}>
                                        <div className="size-x-xl text-center">
                                            {selectedZoom}%
                                        </div>
                                    </div>
                                </div>
                                <div onClick={(e) => handleChangeZoom(1)}
                                     className={`btn btn-ghost btn-s ${selectedZoom === 175 && 'disable'}`}>
                                    <DuckIcon className={"text-l"} icon={`add`}></DuckIcon>
                                </div>


                            </div>

                            <div className="is-flex   gap-s ">
                                <div onClick={(e) => handleChangeZoom(1)} title={"chỉnh sửa với AI"} onClick={(e) => handleChangeZoom(1)}
                                     className={`btn-ghost btn btn-s  btn-primary`}>
                                    <DuckIcon icon={"setting"} className={"text-l"}></DuckIcon>
                                    <div className=" ml-s ">
                                        Cài đặt
                                    </div>
                                </div>
                                <div  title={"chỉnh sửa với AI"} onClick={(e) => handleChangeZoom(1)}
                                     className={`btn-ghost btn btn-s  btn-primary`}>
                                    <div>
                                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M23.0472 7.99398C23.3429 7.06502 24.6574 7.06502 24.953 7.99398L28.5173 19.1929C28.6136 19.4954 28.8479 19.7343 29.1485 19.8364L40.0851 23.5532C40.9894 23.8605 40.9894 25.1395 40.0851 25.4468L29.1485 29.1636C28.8479 29.2657 28.6136 29.5046 28.5173 29.8071L24.953 41.006C24.6574 41.935 23.3429 41.935 23.0472 41.006L19.4829 29.8071C19.3866 29.5046 19.1524 29.2657 18.8518 29.1636L7.91518 25.4468C7.01088 25.1395 7.01088 23.8605 7.91519 23.5532L18.8518 19.8364C19.1524 19.7343 19.3866 19.4954 19.4829 19.1929L23.0472 7.99398Z"
                                                fill="#D55708"/>
                                            <path
                                                d="M36.5224 4.54309C36.6677 4.07356 37.3323 4.07355 37.4776 4.54309L38.9053 9.1554C38.9522 9.30694 39.0683 9.42723 39.218 9.47956L43.6492 11.028C44.096 11.1841 44.096 11.8159 43.6492 11.972L39.218 13.5204C39.0683 13.5728 38.9522 13.6931 38.9053 13.8446L37.4776 18.4569C37.3323 18.9264 36.6677 18.9264 36.5224 18.4569L35.0947 13.8446C35.0478 13.6931 34.9317 13.5728 34.782 13.5204L30.3508 11.972C29.904 11.8159 29.904 11.1841 30.3508 11.028L34.782 9.47956C34.9317 9.42723 35.0478 9.30694 35.0947 9.1554L36.5224 4.54309Z"
                                                fill="#D55708"/>
                                        </svg>


                                    </div>
                                    <div onClick={() => setModal(true)} className=" ml-s ">
                                        Tự động chỉnh sửa
                                    </div>
                                </div>
                                <div title={"Tự động chỉnh sửa"} onClick={(e) => handleChangeZoom(1)}
                                     className={`btn btn-s  btn-primary `}>
                                    <div>
                                        <svg width="16" height="16" viewBox="0 0 26 26" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14.4757 9.99252L2.99951 21.4688L5.52386 23.9931L17.0001 12.5169L14.4757 9.99252Z"
                                                stroke="white" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"/>
                                            <path
                                                d="M14.4719 10L11.6011 12.8708L14.1254 15.3952L16.9962 12.5244L14.4719 10Z"
                                                stroke="white" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"/>
                                            <path
                                                d="M22.41 4.59L21.73 6.6L23 8.3L20.88 8.27L19.65 10L19.03 7.97L17 7.35L18.73 6.12L18.7 4L20.4 5.27L22.41 4.59Z"
                                                stroke="white" stroke-width="1.5" stroke-miterlimit="10"
                                                stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M11.5 8L12.5 4" stroke="white" stroke-width="1.5"
                                                  stroke-miterlimit="10" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                            <path d="M10 5.5L14 6.5" stroke="white" stroke-width="1.5"
                                                  stroke-miterlimit="10" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                            <path d="M19 15.5L23 14.5" stroke="white" stroke-width="1.5"
                                                  stroke-miterlimit="10" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                            <path d="M20.5 13L21.5 17" stroke="white" stroke-width="1.5"
                                                  stroke-miterlimit="10" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                        </svg>


                                    </div>
                                    <div onClick={() => setModal(true)} className=" ml-s text-white">
                                        Viết lại với Ai
                                    </div>

                                </div>

                            </div>
                        </div>

                        {isLoadingFileInfo || isDownloading ? (
                            <div className={"size-y-720 is-center"}>
                                <div className={"rotate-animate"}><Dainam/></div>
                            </div>
                        ) : pdfFile ? (
                            <>

                                <div className=" is-overflow bg-white">
                                    <PDFH cusStyle={style} ListHighlights={listHighlights} pdfFile={pdfFile}/>
                                </div>
                            </>

                        ) : (
                            <p>Không có file để hiển thị</p>
                        )}
                    </div>
                    <div className={"none-appear"}>
                        <PDFReport></PDFReport>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Documentation;
