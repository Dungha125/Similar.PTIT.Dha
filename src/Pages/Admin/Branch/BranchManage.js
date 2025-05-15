import React, {useCallback, useEffect, useRef, useState} from 'react';
import Tabs from "../../../CoreBase/TabItem";
import DuckIcon from "duckicon";
import {Link, Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {LogoDaiNam} from "../../../CoreBase/Brand";
import {useContextMenu} from "../../../Sponsor/ContextMenu/ContextMenuProvider";
import {useGetBranchDataQuery} from "../../../services/branch";
import _ from "lodash";

function BranchManage({title}) {
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const {branchID} = useParams(); // lấy branchID từ URL
    const tabs = [
        {tabId: 0, tabName: "Khoa", link: "department"},
        {tabId: 1, tabName: "Giảng viên", link: "teacher"},
        {tabId: 2, tabName: "Cài đặt", link: "setting"}
    ];
    const [curentBranch, setCurentBranch] = useState(null);
    const [branchList, setBranchList] = useState([]);
    const {data: branchData, error, isLoading, isFetching} = useGetBranchDataQuery();
    useEffect(() => {
        if (branchData?.length) {
            setBranchList(branchData);

            // Nếu curentBranch chưa có hoặc branchID thay đổi, cập nhật lại
            const branch = branchData.find(branch => branch.id === branchID);
            if (branch) {
                setCurentBranch(branch);
            }
        }
    }, [branchData, branchID]);
    useEffect(() => {
        // Cập nhật tab dựa vào URL
        switch (location.pathname) {
            case `/admin/branch/${branchID}`:
            case `/admin/branch/${branchID}/department`:
                setTab(0);
                break;
            case `/admin/branch/${branchID}/teacher`:
                setTab(1);
                break;
            case `/admin/branch/${branchID}/setting`:
                setTab(2);
                break;
            default:
                setTab(0);
        }
    }, [location.pathname, branchID]);

    function changeTab(value) {
        setTab(value);
        navigate(`/admin/branch/${branchID}/${tabs[value].link}`);
    }


    const [isRefVisible, setIsRefVisible] = useState(true); // Trạng thái hiển thị của ref
    const [lastScrollPosition, setLastScrollPosition] = useState(0); // Lưu vị trí cuộn cuối cùng
    const scrollableRef = useRef(null); // Ref cho phần tử cuộn

    const upToTop = () => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    // Hàm xử lý khi cuộn với debounce
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

    const buttonRef1 = useRef(null);
    const tableMenu = [
        {
            actionName: "Xem",
            icon: "eye",
            action: function () {
                console.log("eye")
            }
        },
        {
            actionName: "Sửa",
            icon: "document-edit",
            action: function () {
                console.log("edit")
            }
        },
    ]
    const {
        showMenu,
    } = useContextMenu();
    return (
        <div ref={scrollableRef} className="is-relative is-scroll-y bg-white" style={{height: "calc(100vh)"}}>

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
                <div
                    className={`is-flex header border-b jt-between align-center px-m `}>
                    <ol className={`breadcrumb  pl-x my-s `}>
                        <li className="breadcrumb-item is-center">
                            <LogoDaiNam width={32} height={32}/>
                        </li>
                        <li className="breadcrumb-item is-center">
                            <Link className={"rounded-s"} to={"/admin/branch"}>
                                <div className={"title-s"}> Quản lý khoa</div>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <div className="is-flex align-center gap-s">

                                <div className={"title-s"}> {curentBranch?.name} </div>
                                <div ref={buttonRef1}
                                     onClick={() => showMenu(buttonRef1, <div className={"select-list active"}>
                                         <h5 className={"p-s"}>Chọn khoa</h5>
                                         {branchList.map((item, index) => {
                                             return <div>
                                                 <Link to={`/admin/branch/${item.id}`}
                                                       onClick={() => setCurentBranch(item)}
                                                       className="select-item bg-hover-light p-s is-flex jt-between gap-m text-mute">
                                                     <div className="is-flex gap-m">
                                                         <DuckIcon icon={"folder"} className={"text-xl "}/>
                                                         <div>
                                                             <p className={"title-s"}>
                                                                 {item.name}
                                                             </p>
                                                             <p className={"text-xs text-disable"}>
                                                                 {item.branch_code}
                                                             </p>
                                                         </div>
                                                     </div>
                                                     {item.name === curentBranch.name && <DuckIcon icon={"checked"}/>}
                                                 </Link>
                                             </div>
                                         })}
                                     </div>, 280, 150)} className="btn btn-fill btn-s">
                                    <DuckIcon className={"title-s"} icon={"up-down"}/>
                                </div>
                            </div>
                        </li>
                    </ol>
                    <div className="is-flex gap-m">
                        <div className="btn btn-s btn-fill ">
                            <DuckIcon className="text-l text-right" icon="pen"/>
                        </div>
                    </div>
                </div>

            </div>
            <div className="is-sticky border-b is-flex bg-white pl-m align-center"
                 style={{top: isRefVisible ? "48px" : "0px", zIndex: 1, transition: 'top 0.3s ease-in-out'}}>

                <div className={`dkd ${!isRefVisible ? "active" : ""}`} onClick={upToTop}>
                    <LogoDaiNam width={28} height={28}/>
                </div>
                <Tabs tabs={tabs} activeTab={tab} handleClick={changeTab}/>
            </div>
            <Outlet/> {/* Sử dụng Outlet để render các Route con */}
        </div>
    );
}

export default BranchManage;

