import './App.scss';
import {Link, Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import Home from "./Home";
import Brand from "./CoreBase/Brand";
import React from "react";
import logo from './static/file/logo.png';
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import {useSelector} from "react-redux";
import {ContextMenuProvider} from "./Sponsor/ContextMenu/ContextMenuProvider";
import UploadPage from "./CoreBase/UploadPage";
import Documentation from "./CoreBase/Document";
import Settings from "./Pages/Admin/Branch/Settings";
import UserInBranch from "./Pages/Admin/Branch/Table/User/UserInBranch";
import DepartmentManage from "./Pages/Admin/Branch/Table/Department/DepartmentInBranch";
import ResourceInFile from "./Pages/FileManage/File/ResourceInFile";
import {SelectBranch} from "./Pages/Admin/Branch/SelectBranch";
import BranchManage from "./Pages/Admin/Branch/BranchManage";
import UserManage from "./Pages/Users/UserManage";
import SubjectManage from "./Pages/Subject/SubjectManage";
import SelectSubject from "./Pages/Subject/SelectSubject";
import UserInUser from "./Pages/Users/Pages/UserInUser";
import RoleInUser from "./Pages/Users/Pages/RoleInUser";
import FileManage from "./Pages/FileManage/FileManage";
import {UserRole} from "./Pages/RoleMap";
import ProtectedRoute from "./services/ProtectedRoute";
import CopyVerify from "./Pages/FileManage/File/copy-verify/copy-verify";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";

const LoginRoute = () => {
    const userToken = useSelector((state) => state.auth.userToken);
    return userToken ? <Outlet/> : <Navigate to="/login"/>;
};

function App() {
    const userRole = UserRole

    const location = useLocation();
    const showNavbar = ["/", "/document", "/home"].includes(location.pathname);

    return (
        <div className="App">
            <ContextMenuProvider>
                <div className="Duck">

                    {showNavbar && (
                        <div className="border-b ">
                            <Link to={"/"} className="navbar px-m">
                                <Brand/>
                            </Link>
                        </div>
                    )}

                    <Routes>
                        <Route path="/" element={<UploadPage/>}/>
                        <Route path="/document/:fileID" element={<Documentation/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route element={<LoginRoute/>}>
                            <Route path="/admin/*" element={<Admin/>}>
                                <Route index element={<Dashboard/>}/>
                                <Route  path="dashboard" element={<Dashboard/>}/>
                                <Route path="branch"
                                       element={
                                           <ProtectedRoute isAllowed={userRole.branch.isAccess}>
                                               <SelectBranch />
                                           </ProtectedRoute>
                                       }
                                />
                                <Route path="upload" element={<UploadPage/>}/>

                                <Route path="branch/:branchID"
                                       element={
                                           <ProtectedRoute isAllowed={userRole.branchDetail.isAccess}>
                                               <BranchManage />
                                           </ProtectedRoute>
                                       }
                                >
                                    <Route index element={<DepartmentManage/>}/>
                                    <Route path="department"
                                           element={
                                               <ProtectedRoute isAllowed={userRole.department.isAccess}>
                                                   <DepartmentManage />
                                               </ProtectedRoute>
                                           }
                                    />
                                    <Route path="teacher" element={<UserInBranch/>}/>
                                    <Route path="setting" element={<Settings/>}/>
                                </Route>
                                <Route path="document" element={<FileManage/>}>
                                    <Route index element={<ResourceInFile/>}/>
                                    <Route path="resource" element={<ResourceInFile/>}/>
                                    <Route path="checked" element={<ResourceInFile/>}/>
                                    <Route path="copy-verify" element={<CopyVerify/>}/>


                                </Route>
                                <Route path="subject" element={
                                    <ProtectedRoute isAllowed={userRole.subject.isAccess}>
                                        <SubjectManage />
                                    </ProtectedRoute>
                                }/>
                                    {/*<Route path="subject" element={<SubjectManage/>}/>*/}


                                <Route path="subject/:subjectID"
                                       element={
                                           <ProtectedRoute isAllowed={userRole.subject.isAccess}>
                                               <SelectSubject />
                                           </ProtectedRoute>
                                       }
                                />
                                <Route path="user"
                                       element={
                                           <ProtectedRoute isAllowed={userRole.user.isAccess}>
                                               <UserManage />
                                           </ProtectedRoute>
                                       }
                                >
                                    <Route index element={<UserInUser/>}/>
                                    <Route path="role" element={<RoleInUser/>}/>
                                </Route>
                            </Route>
                        </Route>
                        <Route path="/unauthorized" element={<Unauthorized />} />
                    </Routes>

                    {showNavbar && (<div style={{bottom: 24, right: 60, zIndex: 1000}} className="is-fixed ">
                        <Link to={"/login"} className="p-s px-l bg-shadow is-flex vertical gap-s animate-SJF">
                            <div className="text-xs text-disable">Powered by</div>
                            <img title={"Đại học Đại Nam"} className={"size-y-xl"} src={logo} alt="Đại học Đại Nam"/>
                        </Link>
                    </div>)}

                </div>

            </ContextMenuProvider>

        </div>
    );
}

export default App;

const Unauthorized = () => {
    return (
        <div>
            <h1>Unauthorized</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
        </div>
    );
};