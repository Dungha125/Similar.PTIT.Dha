import React, {useEffect, useRef, useState} from 'react';
import {LogoDaiNam} from "../../CoreBase/Brand";
import DuckIcon from "duckicon";
import Tabs from "../../CoreBase/TabItem";
import DepartmentInSubject from "./SelectSubjectViewer/DepartmentInSubject";
import UserInSubject from "./SelectSubjectViewer/UserInSubject";
import SettingInSubject from "./SelectSubjectViewer/SettingInSubject";

function SelectSubject({subject,onClose}) {
    const scrollableRef = useRef(null); // Tạo một ref cho phần tử cuộn
    const [scrollPosition, setScrollPosition] = useState(false); // Lưu vị trí cuộn
    const [tab, setTab] = useState(0);
    const tabs = [
        {tabId: 1, tabName: "Khoa", link: "department"},
        // {tabId: 2, tabName: "Giảng viên", link: "teacher"},
        {tabId: 0, tabName: "Tài liệu", link: "document"},
        {tabId: 3, tabName: "Cài đặt", link: "setting"}
    ];

    function changeTab(value) {
        setTab(value);
    }
    const upToTop = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    useEffect(() => {
        const element = scrollableRef.current;
        // Hàm xử lý khi cuộn
        const handleScroll = () => {
            const scrollTop = element.scrollTop;
            setScrollPosition(scrollTop > 150);
        };

        // Lắng nghe sự kiện cuộn
        element.addEventListener('scroll', handleScroll);

        // Cleanup event listener khi component bị unmount
        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, []);
    if(!subject) return <div>Loading</div>;
    return (
        <>
            <div className="modal-header p-m">
                <div className="is-flex gap-m ">
                    <div onClick={onClose} className="bg-sliver size-l is-center  rounded cursor-pointer">
                        <DuckIcon className={"text-l"} icon={"close"}/>
                    </div>
                    <h4> Chi tiết </h4>
                </div>


            </div>
            <div className="modal-body bg-white">
                    <div className="p-m ">
                        <h2>{subject?.name} </h2>
                        <p>{subject?.description}</p>
                    </div>

                    <div ref={scrollableRef} className="is-sticky overview " style={{top: "0px", zIndex: 1}}>
                        <div className="border-b is-flex pl-m align-center">
                            <div className={`dkd ${scrollPosition ? "active" : ""}`} onClick={upToTop}>
                                <LogoDaiNam width={28} height={28}/>
                            </div>
                            <Tabs tabs={tabs} activeTab={tab} handleClick={changeTab}/>
                        </div>
                    </div>
                <div className="p-l bg-white">

                    {tab === 0 && <DepartmentInSubject subject={subject}/>}
                    {tab === 1 && <UserInSubject subject={subject}/>}
                        {/*{tab === 2 && <FileInSubject subject={subject}/>}*/}
                        {tab === 2 && <SettingInSubject subject={subject}/>}
                    </div>

            </div>

        </>
    );
}

export default SelectSubject;