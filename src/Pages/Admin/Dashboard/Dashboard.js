import {
    Bar,
    BarChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';
import {useGetDashboardDataQuery} from "../../../services/dashboard";
import {useEffect, useState} from "react";
import DuckIcon from "duckicon";
import {format} from 'date-fns'


const Dashboard = () => {
    const {data, isLoading} = useGetDashboardDataQuery();
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        if (data) {
            setDashboardData(data);
        }
    }, [data]);

    if (isLoading || !dashboardData) return <div>Loading...</div>;

    const {
        processedFiles,
        totalFiles,
        totalUsers,
        averageDuration,
        averageSimilarity,
        mostCopiedFiles,
        topDuplicateFiles,
        filesPerDay,
        storageUsedGB,
        subjects,
    } = dashboardData;

    return (
        <div className="container-xxl  ">
            <div className="mt-xxl">
                <div className="columns">
                    {/* Top Cards */}
                    <div className="col-3 is-flex vertical gap-m">
                        <div className="grid-4">
                            <Card icon={"document"} title="Số file đã xử lý" value={`${processedFiles}/${totalFiles}`}/>
                            <Card icon={"user"} title="Người dùng" value={totalUsers}/>
                            <Card icon={"time-countdown"} title="Thời gian xử lý TB" value={`${Math.round(averageDuration)}s`}/>
                            <Card icon={"fork"} title="Nội dung bị trùng" value={`${Math.round(averageSimilarity)}%`}/>
                        </div>
                        <div className="grid-2">
                            <div className="col bg-white border ">
                                <TotalFilesChart rawData={filesPerDay}></TotalFilesChart>
                            </div>
                            <div className="col bg-white border ">
                                <MyRadarChart></MyRadarChart>
                            </div>
                            <div className={" col border p-m bg-white"}>
                                <SectionTitle title="Tài liệu sao chép nhiều"/>
                                <div className="is-flex vertical gap-s">
                                    {mostCopiedFiles.slice(0, 4).map((file, idx) => (
                                        <FileItem2 key={idx} filename={file.filename}
                                                   copyCount={file.copyCount}/>
                                    ))}
                                    {mostCopiedFiles.length > 4 && <ViewAll/>}
                                </div>
                            </div>
                            <div className={"col border p-m bg-white"}>
                                <SectionTitle title="Tài liệu trùng nhiều"/>
                                <div className="is-flex vertical gap-s">
                                    {topDuplicateFiles.slice(0, 4).map((file, idx) => (
                                        <FileItem key={idx} filename={file.filename}
                                                  similarityPercent={file.similarityPercent}/>
                                    ))}
                                    {topDuplicateFiles.length > 4 && <ViewAll/>}
                                </div>
                            </div>


                        </div>

                    </div>

                    {/* Duplicate Files */}
                    <div className="col is-flex vertical gap-m">
                        {/* Storage */}
                        <div className="col bg-black p-m  rounded-m shadow p-4">
                            <SectionTitle title="Lưu trữ"/>
                            <StorageBar used={storageUsedGB}/>
                        </div>
                        {/* Subjects */}
                        <div className="col bg-white border p-m overflow-y-auto">
                            <SectionTitle title="Số file theo học phần"/>
                            <SubjectList subjects={subjects}/>
                        </div>

                    </div>

                    {/* Files per Day */}
                </div>
            </div>


        </div>
    );
};

const Card = ({icon = 'document', title, value}) => (

    <div className="bg-white border   p-l   ">
        <div>
            <DuckIcon className={`text-xxl size-xl`} icon={icon}/>

        </div>
        <div className="title-xl font-bold">{value}</div>
        <div className="text-disable text-s">{title}</div>
    </div>
);

const SectionTitle = ({title}) => (
    <div className="title-xl font-bold mb-l">{title}</div>
);

const FileItem = ({filename, similarityPercent}) => (
    <div className="is-flex align-center gap-m">
        <div>
            <DuckIcon className={`size-xxl bg-light text-xxl p-l rounded-s`} icon={"document"}/>
        </div>
        <div className={"is-flex jt-between is-fill-x border-b py-s align-center"}>
            <div className="is-flex vertical gap-s">
                <span className={"title-s text-capitalize"}>{filename}</span>
                <div
                    className="text-m size-y-l mt-xs title-s size-x-xxl  rounded bg-primary-light is-center">{similarityPercent}%
                </div>
            </div>
            <DuckIcon className={`text-l`} icon={"right-direction"}/>
        </div>

    </div>
);
const FileItem2 = ({filename, copyCount}) => (
    <div className="is-flex align-center gap-m">
        <div>
            <DuckIcon className={`size-xxl bg-light text-xxl p-l } rounded-s`} icon={"document"}/>
        </div>
        <div className={"is-flex jt-between is-fill-x border-b py-s align-center"}>
            <div className="is-flex vertical gap-s">
                <span className={"title-s text-capitalize"}>{filename}</span>
                <div
                    className="text-m size-y-l title-s size-x-xl mt-xs  rounded bg-secondary-light is-center">{copyCount}
                </div>
            </div>
            <DuckIcon className={`text-l`} icon={"right-direction"}/>
        </div>

    </div>
);
const ViewAll = () => (
    <div className="text-center text-primary cursor-pointer mt-s">Xem tất cả</div>
);

const StorageBar = ({used}) => {
    const maxStorageGB = 4; // Cứng theo UI
    const percent = (used / maxStorageGB) * 100;

    return (<div>
            <div className={"is-flex gap-m mt-m"}>
                <DuckIcon className={`size-xxl bg-light text-xl  rounded-s`} icon={"document"}/>
                <div>
                    <div className="mb-m">{`${used.toFixed(2)}GB / ${maxStorageGB}GB`}</div>
                    <div className="is-fill-x size-y-s bg-mute rounded ">
                        <div
                            className="size-y-s rounded bg-primary"
                            style={{width: `${percent * 10000}%`}}
                        ></div>
                    </div>
                </div>

            </div>
            <div className={"text-center p-m"}>
                <div className="title-m">
                    Ước lượng sử dụng
                </div>
                <span>
                    Dung lượng sẽ hết sau 4 tháng nữa
                </span>
            </div>
            <div className="btn bg-white is-fill-x">
                Quản lý dung lượng lưu trữ
            </div>
        </div>

    );
};

const SubjectList = ({subjects}) => {
    //get max file count
    const maxFileCount = Math.max(...subjects.map(subject => parseInt(subject.fileCount)));
    console.log(maxFileCount)
    return <div className="is-flex vertical gap-s mt-l">
        {subjects.map((subject, idx) => (
            <div key={idx} className="is-relative    p-s   ">
                <div className={"is-relative is-flex align-center jt-between px-s "} style={{zIndex: 11}}>
                    <div className={"title-s"}>{subject.name}</div>
                    <div className="text-black text-xs ">{subject.fileCount}</div>
                </div>
                <div className={"bg-primary-light rounded-xs is-fill-y is-absolute"}
                         style={{width: `${parseInt(subject.fileCount)/maxFileCount*100}%`, zIndex: 0, top: 0}}></div>
            </div>
        ))}
    </div>
};

const TotalFilesChart = ({rawData}) => {
    const data = rawData.map(item => ({
        name: format(new Date(item.date), 'dd-MM'), // format thành 13-10 kiểu vậy
        total: item.total,
    }))
    return (
        <div className=" p-m">
            <SectionTitle title="Tổng số file"/>
            <div className="is-flex align-end py-m jt-between">
                <div>
                    <p className="text-muted-foreground text-s">Hôm nay</p>
                    <p className="title-xxl font-bold text-primary">1.425</p>
                </div>

                <div className={"is-flex"}>
                <div
                        className="text-m size-y-l title-s size-x-xxl text-primary rounded bg-primary-light is-center">{12}%
                    </div>
                    <div className="pr-s"/>
                    so với tháng trước
                </div>

            </div>
            <div className={"is-fill-x"} style={{height: "250px"}}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                            stroke="#888888"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                            stroke="#888888"
                            tickFormatter={(value) => `${value}`}
                        />
                        <Bar
                            dataKey="total"
                            radius={[8, 8, 0, 0]}
                            fill="#F66F1A"
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
};
const data = [
    { subject: 'Copy/Paste', value: 80 },
    { subject: 'Ngữ nghĩa', value: 60 },
    { subject: 'Advertisement', value: 70 },
    { subject: 'Services', value: 65 },
    { subject: 'Channel', value: 50 },
    { subject: 'Quality', value: 45 },
    { subject: 'Durability', value: 30 },
    { subject: 'Appearance', value: 60 },
];
function MyRadarChart() {
    return (
        <div className={"p-m"}>
            <SectionTitle title="Tổng số file"/>
            <div className="is-flex align-end py-m jt-between">
                <div>
                    <p className="text-muted-foreground text-s">Hôm nay</p>
                    <p className="title-xxl font-bold text-primary">1.425</p>
                </div>



            </div>
            <div style={{height: "250px"}} className="is-fill-x ">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid/>
                        <PolarAngleAxis dataKey="subject"/>
                        <PolarRadiusAxis angle={30} domain={[0, 100]}/>
                        <Radar name="Dạng trùng" dataKey="value" stroke="#F66F1A" fill="#ffceac" fillOpacity={0.4}/>
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

    );
}

export default Dashboard;

