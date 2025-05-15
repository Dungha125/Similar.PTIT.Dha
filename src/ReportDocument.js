import React from "react";
import {QRCodeSVG} from "qrcode.react";
import Brand from "./CoreBase/Brand";
import dainam from "./static/XS.png";
import "./App.scss"
function MyQR({url}) {
    return (
        <div className="">
            <QRCodeSVG value={url} size={80}/>
        </div>
    );
}

export default function PDFReport({}) {
    return (
        <div id={"pdf-content"} className="Duck">
            <div className=" bg-white is-flex vertical gap-m">
                {/* Trang 1 */}
                <section className="  rounded-l ">
                    <div className="is-flex jt-between ">
                        <div className="gap-s">
                            <p>{reportData.meta.date}</p>
                            <p className="text-xs text-disable">{reportData.meta.url}</p>
                        </div>
                        <div className="is-flex jt-end">
                            <img className={"size-y-xl"} src={dainam} alt=""/>
                        </div>
                    </div>
                    <h2 className="text-primary text-xl text-semi">Báo cáo kiểm tra tài liệu</h2>


                </section>
                <section>
                    <div className="border  grid-2  p-m text-xs">
                        <div className="gap-s">
                            <p className="title-s">Thông tin tài liệu</p>
                            <p>ID: {reportData.meta.fileId}</p>
                            <p>Tên tập tin: {reportData.meta.fileName}</p>
                            <p>Kích thước: {reportData.meta.fileSize}</p>
                        </div>
                        <div className="gap-s">
                            <p className="title-s">Thông tin kiểm tra</p>
                            <p>Ngày kiểm tra: {reportData.meta.checkTime}</p>
                            <p>Tổng số câu: {reportData.meta.totalOriginalSentences}</p>
                            <p>Tổng nội dung trùng lặp: {reportData.meta.totalDuplicatedSentences}</p>
                            <p>Số tệp tham chiếu: {reportData.meta.totalReferenceFiles}</p>
                        </div>
                        <MyQR url={reportData.meta.url}/>

                        <div className={"is-flex vertical align-end jt-end p-m"}>
                            <div className={"text-disable"}>
                                Báo cáo tạo bởi
                            </div>
                            <Brand width={"100"}/></div>
                    </div>
                </section>
                <section className="border p-m  ">
                    <h4 className="">Phân tích trùng lặp</h4>
                    <div className="is-flex align-start">
                        <div className="p-m">
                            <ProgressCircle percentage={81}/>
                        </div>
                        <div className={"is-flex vertical gap-m p-m text-xs"}>
                            <div className="title-s">
                                Tệp tham chiếu
                            </div>
                            {reportData.duplicationAnalysis.references.map((ref, index) => (
                                <div className={"is-flex gap-s"}>
                                    <h3 className={"size-xxl p-s"}>
                                        {ref.percent}%
                                    </h3>
                                    <div>
                                        <div className="title-s">
                                            Tệp tin: {ref.name}
                                        </div>
                                        <div className="text-disable">
                                            Liên kết: {ref.url}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </section>
                <section className="border p-m ">
                    <h4 className="">Phân tích lỗi chính tả</h4>
                    <div className="is-flex align-start">
                        <div className="p-m">
                            <ProgressCircle percentage={12}/>
                        </div>
                        <div className={"is-flex vertical gap-m p-m text-xs"}>
                            <div className="title-s">
                                Thống kê
                            </div>
                            <div className={"is-flex gap-s"}>
                                <div className="is-center">
                                    <div className={"is-flex gap-s"}>
                                        <h3 className={"size-xxl p-s"}>
                                            {reportData.spellingAnalysis.vietnamese}%
                                        </h3>
                                        <div className="title-s">
                                            Tiếng Việt
                                        </div>
                                    </div>
                                </div>
                                <div className="is-center">
                                    <div className={"is-flex gap-s"}>
                                        <h3 className={"size-xxl p-s"}>
                                            {reportData.spellingAnalysis.english}%
                                        </h3>
                                        <div className="title-s">
                                            Tiếng Anh
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </section>
                {/* Trang 2 */}
                <section className="border p-m is-flex vertical gap-m ">
                    <h3 className={"mb-l"}>Nội dung trùng lặp</h3>
                    {reportData.duplicatedContent.map((item, idx) => (
                        <div key={idx} className="">
                            <p className="title-s">Tài liệu {item.referenceFile}</p>
                            {item.contents.map((c, i) => (
                                <div key={i} className="text-sm py-s ">
                                    <p className={"text-s"}>"{c.text}"</p>
                                    <p className="text-xs text-disable">Trang {c.page} | {c.sourceFile}</p>
                                </div>
                            ))}
                        </div>
                    ))}

                </section>
            </div>
        </div>

    );
}
const reportData = {
    meta: {
        date: "20/05/2025",
        url: "https://similar.hine.pro",
        fileName: "profile.pdf",
        fileId: "94831ec4-adf1-4bf1-9814-e04236fe7060",
        fileSize: "595.32 x 842.04",
        checkTime: "23:48 19 tháng 3, 2025",
        totalOriginalSentences: 24,
        totalDuplicatedSentences: 34,
        totalReferenceFiles: 5,
    },
    duplicationAnalysis: {
        percent: 81,
        references: [
            {
                name: "a1.pdf",
                url: "https://similar.hine.pro",
                percent: 12,
            },
            {
                name: "a2.pdf",
                url: "https://similar.hine.pro",
                percent: 12,
            },
            {
                name: "a3.pdf",
                url: "https://similar.hine.pro",
                percent: 12,
            },
            {
                name: "a4.pdf",
                url: "https://similar.hine.pro",
                percent: 12,
            },
            {
                name: "a5.pdf",
                url: "https://similar.hine.pro",
                percent: 12,
            },
        ],
    },
    spellingAnalysis: {
        percent: 21,
        vietnamese: 12,
        english: 9,
    },
    duplicatedContent: [
        {
            referenceFile: "A1.PDF",
            contents: [
                {
                    text: "Trong y tế, CNTT cải thiện quản lý hồ sơ bệnh nhân, chẩn đoán và điều trị bệnh, mang lại dịch vụ chăm sóc sức khỏe tốt hơn.",
                    page: 1,
                    sourceFile: "profile.pdf",
                },
                {
                    text: "Trong y tế, CNTT cải thiện quản lý hồ sơ bệnh nhân, chẩn đoán và điều trị bệnh, mang lại dịch vụ chăm sóc sức khỏe tốt hơn.",
                    page: 1,
                    sourceFile: "profile.pdf",
                },
            ],
        },
        {
            referenceFile: "A2.PDF",
            contents: [
                {
                    text: "Trong y tế, CNTT cải thiện quản lý hồ sơ bệnh nhân, chẩn đoán và điều trị bệnh, mang lại dịch vụ chăm sóc sức khỏe tốt hơn.",
                    page: 1,
                    sourceFile: "profile.pdf",
                },
                {
                    text: "Trong y tế, CNTT cải thiện quản lý hồ sơ bệnh nhân, chẩn đoán và điều trị bệnh, mang lại dịch vụ chăm sóc sức khỏe tốt hơn.",
                    page: 1,
                    sourceFile: "profile.pdf",
                },
            ],
        },
    ],
};
const ProgressCircle = ({percentage}) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle ro">
            <svg width="120" height="120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="10"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke="#ff6200"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 60 60)"
                />
                <text
                    x="50%"
                    y="50%"
                    dy="0.3em"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#000"
                >
                    {`${percentage}%`}
                </text>
            </svg>
        </div>
    );
};

