import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BrandLogo} from "../CoreBase/Brand";
import DuckIcon from "duckicon";
import {logout} from "../redux/Auth/authSlice";
import {useToast} from "../Sponsor/Toast/useToast";
import {useContextMenu} from "../Sponsor/ContextMenu/ContextMenuProvider";
import ContextContainer from "../Sponsor/ContextMenu/ContextMenuContainer";
import {Link, NavLink, Outlet} from "react-router-dom";
import {TabItem} from "../CoreBase/TabItem";
import {UserRole} from "./RoleMap";
import axios from "axios";
import {base} from "../services/base";

const MenuItem = [
    {
        "name": "Tổng quan",
        "link": "dashboard",
        "icon": "poll"
    },
    {
        "name": "Kiểm tra tài liệu",
        "link": "upload",
        "icon": "line-chart"
    },
    {
        "name": "Tài Liệu",
        "link": "document",
        "icon": "document"
    },
    {
        "name": "Khoa",
        "link": "branch",
        "icon": "issue-2"
    },
    {
        "name": "Học phần",
        "link": "subject",
        "icon": "book-2"
    },

    {
        "name": "Người dùng",
        "link": "user",
        "icon": "user"
    },
    {
        "name": "Cài đặt",
        "link": "setting",
        "icon": "setting"
    }
]


function Admin(props) {
    const [currentID, setCurrentID] = useState()
    const [expandItem, setExpandItem] = useState(true)
    const [expandMenu, setExpandMenu] = useState(true)
    const [projectMenu, setProject] = useState(false)
    const dispatch = useDispatch();
    const toast = useToast()
    const {menus, currentMenuIndex, hideMenu} = useContextMenu();
    const {userInfo} = useSelector((state) => state.auth);
    const handleClick = (value) => {
        if (value !== 0) {
            const element = document.getElementById(`item${value}`);
            if (element.classList.contains("expand")) {
                element.classList.remove("expand")
            } else element.classList.add("expand")
        } else {
            setExpandItem(!expandItem)
            setExpandMenu(!expandMenu)
        }
    }
    const [visible, setVisible] = useState(null);
    const [offSet, setOffSet] = useState(0)
    let elmWidth = 0
    let elmHeight = 0;
    const osStyle = {
        opacity: visible ? 1 : 0,
        width: visible ? elmWidth : 50,
        transform: `translate(0,${offSet}px)`,
        transitionDuration: '200ms'
    }
    const handleLogout = async () => {
        try {
            await axios.post(`${base}/auth/logout`); // gọi BE clear jwt cookie
            dispatch(logout()); // rồi mới dispatch redux clear localStorage
            toast.success('Logout Successfully!');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed!');
        }
    };
    const sub = useRef(null)
    useEffect(() => {
        const elm = sub.current
        if (elm) {
            if (visible != null) {
                elmWidth = visible.current.clientWidth
                elmHeight = visible.current.clientHeight
                setOffSet(visible.offsetTop)
                elm.style.transform = `translate(0,${offSet}px)`
                elm.style.height = `${elmHeight}px`;
                elm.style.width = `${elmWidth}px`
            } else {
                elm.style.opacity = 0;
            }
        }
    }, [visible])
    const onHover = ref => {
        if (ref) {
            setVisible(ref)
            setOffSet(ref.current.offsetTop)
        } else
            setVisible(null)
    }
    return (
        <div className="container-full is-full-y is-overflow  columns gap-x  is-sticky p-s bg-mute  "
             style={{gap: 0, padding: 0}} id={"dashboard"}>
            <div  className={` sidebar    rounded-x p-x font-text  ${expandMenu ? "" : "hide"}`} id="sidebar">
                <div className={`sidebar-header`}>
                    <div className="sidebar-brand">
                        <BrandLogo/>
                    </div>
                </div>
                <div className={`sidebar-main  mt-xxl `}>
                    <div onClick={() => setExpandMenu(!expandMenu)} className="sidebar-mobile-collapse">
                        <DuckIcon className={" text-l"} icon={expandMenu ? "close" : "menu"}/>
                    </div>
                    <div className="sidebar-items ">
                        <div ref={sub} className="side-sub" id="subSide"
                             style={osStyle}></div>
                        {
                            MenuItem.map((item, index) => {
                                    return <div className={"item"} key={index}>
                                        <TabItem onHover={onHover}>
                                            <NavLink to={`/admin/${item.link}`} className="sidebar-btn ">
                                                <DuckIcon className="sidebar-icon text-l mx-s" icon={item.icon}/>
                                                <div className="item-text ">
                                                    {item.name}
                                                </div>
                                            </NavLink>
                                        </TabItem>
                                    </div>
                                }
                            )
                        }
                    </div>
                    <div className="sidebar-items p-x ">
                        <div onClick={() => {
                            handleLogout()
                        }} onMouseEnter={() => expandItem ? setProject(true) : {}}
                             onMouseLeave={() => setProject(false)}
                             className={`item ${projectMenu ? "show" : ""} pl-s align-center bg-black cursor-pointer expand-vertical active bg-hover-black m-s rounded-m`}>
                            <div className={`item-collapse  p-x`}>
                                <p className={"text-white pl-s py-s"}>Account</p>
                                <div className="px-xs sidebar-btn columns align-center  rounded-s bg-hover-mute  ">
                                    <div className="sidebar-icon ratio-1-1 size-xl">
                                        <DuckIcon icon={"setting"} className={"text-l"}></DuckIcon>
                                    </div>
                                    <div className="  col pl-s ">
                                        <div className={"jt-between  is-fill-x is-flex"}>
                                            <h6 className={"text-capitalize text-white"}>Cài đặt tài khoản</h6>
                                            <DuckIcon icon={"checked "} className={"text-white"}></DuckIcon>
                                        </div>
                                    </div>


                                </div>
                                <div onClick={(e) => (e.stopPropagation(), handleLogout(e))}
                                     className="sidebar-btn px-xs columns align-center rounded-s  bg-hover-mute  ">
                                    <div className="sidebar-icon ratio-1-1 size-xl">
                                        <DuckIcon icon={"sign-out"} className={"text-white"}></DuckIcon>
                                    </div>
                                    <div className="text-white  col pl-s">
                                        <div className={"jt-between is-fill-x is-flex"}>
                                            <h6 className={"text-capitalize"}>Log Out</h6>
                                        </div>
                                    </div>

                                </div>
                                <div className="divider my-s"></div>


                            </div>

                            <div className="sidebar-btn  is-center ">
                                <img alt={"project"} className={"sidebar-icon ratio-1-1  size-xl rounded-s"}
                                     src={"https://i.imgur.com/33V0Db0.png"}/>
                                <div className="pr-x  item-text is-fill-x  ">
                                    <div className="pl-m is-flex">
                                        <div className={" jt-between is-fill-x  align-center jt-center"}>
                                            <h6 className={"text-capitalize text-white "}>{userInfo.username}</h6>
                                            <p className={"text-xs text-disable"}>{userInfo.username}</p>
                                        </div>
                                        <DuckIcon className={`${projectMenu ? "rotate-180" : ""} text-white`}
                                                  icon={"up-down"}></DuckIcon>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>


                </div>
                <div className="sidebar-bottom" style={{border: "0px"}}>

                    <a onClick={() => handleClick(0)} className="cursor-pointer">
                        <DuckIcon className={" text-xl"} icon={expandMenu ? "open" : "open "}/>
                    </a>
                </div>

            </div>
            <div className="col-5 bg-white is-relative rounded-s is-overflow "
                 style={{height: "calc( 100vh-16px )", overflowY: "auto"}}>
                <Outlet/>
            </div>
            <ContextContainer menus={menus} currentMenuIndex={currentMenuIndex} hideMenu={hideMenu}/>

        </div>

    )
        ;
}

export default Admin;