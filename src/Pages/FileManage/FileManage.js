import React, {useEffect, useRef, useState} from 'react';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {LogoDaiNam} from "../../CoreBase/Brand";
import Tabs from "../../CoreBase/TabItem";

function FileManage(props) {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const tabs = [
        {tabId: 0, tabName: "Tài nguyên", link: "resource"},
        {tabId: 1, tabName: "Kiểm tra", link: "checked"},
        {tabId: 2, tabName: "Kiểm tra tệp", link: "copy-verify"}
    ];
    function changeTab(value) {
        setTab(value);
        navigate(`/admin/document/${tabs[value].link}`);
    }

    const [isRefVisible, setIsRefVisible] = useState(true); // Trạng thái hiển thị của ref
    const [lastScrollPosition, setLastScrollPosition] = useState(0); // Lưu vị trí cuộn cuối cùng
    const scrollableRef = useRef(null); // Ref cho phần tử cuộn

    const upToTop = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    const location = useLocation();
    useEffect(() => {
        const element = scrollableRef.current;

        // Hàm xử lý khi cuộn
        const handleScroll = () => {
            const scrollTop = element.scrollTop;
            const scrollDirection = scrollTop > lastScrollPosition ? 'down' : 'up';

            // Lưu vị trí cuộn hiện tại để so sánh lần sau
            setLastScrollPosition(scrollTop);

            // Nếu cuộn xuống và vượt qua ngưỡng 150px, ẩn ref
            if (scrollDirection === 'down' && scrollTop > 150) {
                setIsRefVisible(false);
            }
            // Nếu cuộn lên và nhỏ hơn 50px hoặc lên đầu trang, hiển thị ref
            else if (scrollDirection === 'up' && scrollTop <= 50) {
                setIsRefVisible(true);
            }
        };

        // Lắng nghe sự kiện cuộn
        element.addEventListener('scroll', handleScroll);

        // Cleanup event listener khi component bị unmount
        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]); // Thêm lastScrollPosition vào dependencies

    return (
        <div ref={scrollableRef} className="is-relative is-scroll-y bg-white" style={{height: "calc(100vh)"}}>
            {/* Phần ref sẽ ẩn/hiện tùy thuộc vào state isRefVisible */}
            <div
                className="overview bg-white"
                style={{
                    top: "0px",
                    zIndex: 1,
                    transform: isRefVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.2s ease-in-out',
                    position: 'sticky'
                }}
            >
                <div className={`is-flex header jt-between align-center px-m`}>
                    <ol className={`breadcrumb pl-x my-s`}>
                        <li className="breadcrumb-item is-center">
                            <LogoDaiNam width={32} height={32}/>
                        </li>
                        <li className="breadcrumb-item is-center">
                            <div className={"title-s"}>Quản lý Tài liệu</div>
                        </li>
                        <li className="breadcrumb-item is-center active">
                            <div className={"title-s"}> {tabs[tab].tabName}</div>
                        </li>
                    </ol>
                    <div className="is-flex gap-m"></div>
                </div>
            </div>

            <div className="is-sticky border-b is-flex bg-white pl-m align-center" style={{top: isRefVisible ? "48px" : "0px", zIndex: 1, transition: 'top 0.3s ease-in-out'}}>
                <div className={`dkd ${!isRefVisible ? "active" : ""}`} onClick={upToTop}>
                    <LogoDaiNam width={28} height={28}/>
                </div>
                <Tabs tabs={tabs} activeTab={tab} handleClick={changeTab}/>
            </div>

            <Outlet/>
        </div>
    );
}

export default FileManage;