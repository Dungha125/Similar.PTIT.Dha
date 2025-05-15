import React, {useEffect, useRef, useState} from 'react';
import DuckIcon from "duckicon";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {LogoDaiNam} from "../../CoreBase/Brand";
import Tabs from "../../CoreBase/TabItem";

function UserManage(props) {
    const navigate = useNavigate();

    const [scrollPosition, setScrollPosition] = useState(false); // Lưu vị trí cuộn
    const scrollableRef = useRef(null); // Tạo một ref cho phần tử cuộn

    const upToTop = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    const tabs = [
        {tabId: 0, tabName: "Người dùng", link: ""},
        {tabId: 1, tabName: "Quyền", link: "role"},
    ];
    const [tab, setTab] = useState(0);
    const location = useLocation();
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
    useEffect(() => {
        // Cập nhật tab dựa vào URL
        switch (location.pathname) {
            case `/admin/user`:
            case `/admin/user/`:
                setTab(0);
                break;
            case `/admin/user/role`:
                setTab(1);
                break;
            default:
                setTab(0);
        }
    }, [location.pathname]);

    function changeTab(value) {
        setTab(value);
        navigate(`/admin/user/${tabs[value].link}`);
    }

    return (
        <div ref={scrollableRef} className=" bg-light is-scroll-y " style={{height: "calc( 100vh)"}}>
            <div className="is-sticky overview bg-white" style={{top: "0px", zIndex: 1}}>
                <div
                    className={`is-flex header jt-between align-center px-m ${scrollPosition ? "scrolled" : ""}`}>
                    <ol className={`breadcrumb  pl-x my-s `}>
                        <li className="breadcrumb-item is-center">
                            <LogoDaiNam width={32} height={32}/>
                        </li>
                        <li className="breadcrumb-item is-center ">
                            {/*<Link className={"rounded-s"} to={"/admin/user"}>*/}
                            <div className={"title-s"}> Quản lý người dùng</div>
                            {/*</Link>*/}
                        </li>
                        <li className="breadcrumb-item is-center active">
                            {/*<Link className={"rounded-s"} to={"/admin/user"}>*/}
                            <div className={"title-s"}> {tabs[tab].tabName}</div>
                            {/*</Link>*/}
                        </li>

                    </ol>
                    <div className="is-flex gap-m">
                        <div className="btn btn-s btn-fill ">
                            <DuckIcon className="text-l text-right" icon="pen"/>
                        </div>
                    </div>
                </div>
                <div className="border-b is-flex pl-m align-center">
                    <div className={`dkd ${scrollPosition?"active":""}`} onClick={upToTop}>
                        <LogoDaiNam width={28} height={28}/>
                    </div>
                    <Tabs tabs={tabs} activeTab={tab} handleClick={changeTab}/>
                </div>
            </div>
            <div className="  ">
                <Outlet/>
            </div>

        </div>
    );
}

export default UserManage;