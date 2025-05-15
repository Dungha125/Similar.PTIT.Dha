import React, {useEffect, useState} from 'react';
import {UserRole} from "../../../../RoleMap";
import DuckIcon from "duckicon";
import UserRow from "./UserRowTable";
import Modal from "../../../../../Sponsor/Slice/Modal";
import {useToast} from "../../../../../Sponsor/Toast/useToast";
import {
    useAssignUserToBranchMutation,
    useGetAllUsersQuery,
    useGetUserInBranchQuery
} from "../../../../../services/user";
import {useParams} from "react-router-dom";
import UFO from "../../../../../Illustation/UFO";
import TagsInput from "../../../../../Sponsor/Tags/TagsInput";

function UserInBranch() {

    const {branchID} = useParams();
    const [userList, setUserList] = useState([])
    const {data: userData, isFetching, isLoading} = useGetUserInBranchQuery({branchID: branchID})
    const [inputValue, setInputValue] = useState('');
    const {data: users, isLoading: usersLoading, isFetching: usersFetching} = useGetAllUsersQuery(
        {},
        {skip: inputValue.length < 2}
    );
    const [assignUser] = useAssignUserToBranchMutation()


    const toast = useToast()
    const [modal, setModal] = useState(false)

    const userRole = UserRole
    const [addUser, setAddUser] = useState([]);
    useEffect(() => {
        if (users?.users?.length) {
            const mappedUsers = users.users.map(user => ({
                code: user.id,
                name: user.username
            }));
            setAddUser(mappedUsers);
        } else {
            setAddUser([]);
        }
    }, [users]);
    const handleAssignUser = async () => {
        const data = tags.map(item => item.code)
        console.log(data)
        try {
            const res = await assignUser({branchID: branchID, userID: data}).unwrap()
            if (res) {
                setModal(false)
                setTags([])
                toast.success("Đã thêm giảng viên")
            }
        } catch (e) {
            console.error(e)
            toast.error("Có lỗi xảy ra")
        }
    }
    const [tags, setTags] = useState([]);
    const renderActionName = (item) => item.name;
    const handleInputValueChange = (value) => setInputValue(value);
    const handleItemAction = (item) => {
        const newTag = {code: item.code, name: item.name};
        console.log("aaa", tags)

        if (!tags.some((t) => t.code === newTag.code)) {
            setTags((prevTags) => {
                return [...prevTags, newTag];
            });
        }
        setInputValue('');
    };
    const handleRemoveTag = (code) => {
        const newTags = tags.filter((tag) => tag.code !== code);
        setTags(newTags);
    };
    const [isClear, setIsClear] = useState(false);
    const ShowTags = ({tags}) => {
        console.log(tags)
        return tags.map((tag, index) => (
            <span onClick={() => handleRemoveTag(tag.code)}
                  className="tag pr-x mx-xs" key={index}>
                    {tag.name}
                <div className="bg-hover-primary-light pr-xs rounded" style={{marginLeft: '5px'}}>
                        <DuckIcon icon="close"/>
                    </div>
                </span>
        ))
    }
    useEffect(() => {
        if (userData?.length) {
            setUserList(userData)
        } else {
            setUserList([])
        }
    }, [branchID, userData]);


    return (
        <div className="bg-light">
            <Modal size={"s"} isOpen={modal} onClose={() => setModal(false)}>
                <div className="modal-header  ">
                    <h3>Thêm giảng viên</h3>

                    <div className=" bg-light p-m is-fill-x rounded-s">
                        <p className={"text-s"}> Bạn có thể thêm các giảng viên có quyền tải lên file </p>
                    </div>
                </div>
                <div className="modal-body   ">
                    <div className="is-flex vertical">
                        <div className="p-m">
                            <TagsInput
                                data={addUser}
                                // data={inputValue?.length <2 ? [] : rtkQuery.data}
                                onInputValueChange={handleInputValueChange}
                                inputValue={inputValue}
                                isLoading={usersLoading || usersFetching}
                                renderActionName={renderActionName}
                                handleItemAction={handleItemAction}
                                onClear={isClear}
                                children={
                                    tags?.length ?
                                        <ShowTags tags={tags} onRemoveTag={handleRemoveTag}/> : null
                                }
                            />


                        </div>
                    </div>
                </div>

                <div className="modal-bottom  ">
                    <div onClick={() => {
                        setModal(false);
                        setTags([])
                    }} className="btn btn-fill">
                        Huỷ
                    </div>
                    <div onClick={() => handleAssignUser()} className="btn ">
                        Thêm
                    </div>
                </div>
            </Modal>
            <div className=" py-xxl border-b">
                <div className="container-xl px-xl">
                    <div className="is-flex jt-between">
                        <div>
                            <div className={"title-xxl"}>Giảng viên</div>
                            <p className="text-disable">
                                Thêm các giảng viên có thể tải tài liệu lên
                            </p>
                        </div>
                        {userRole.user.isEdit &&
                            <div onClick={() => setModal(true)} className={"btn   btn-primary"}>
                                <> <DuckIcon icon={"add"} className={"text-l"}></DuckIcon>
                                    Thêm
                                </>
                            </div>}
                    </div>
                </div>
            </div>
            <div className={"container-xl px-xl"}>

                {userRole.user.isAccess && <>


                    <div className="columns  gap-m  py-m pt-xl ">
                        <div className="col-3">
                            <input type="search" placeholder={"Tìm kiếm người dùng"} className="is-fill-x"/>
                        </div>


                    </div>
                    <div className=" table-section bg-white border rounded-s ">
                        <table className={`table-strip-border`}>
                            <thead className={"text-disable bg-light"}>
                            <tr>
                                <th className={"px-s px-l"}>
                                    <div className="text-s text-left">Người dùng</div>
                                </th>

                                <th className={" text-left px-l py-s"}>

                                    <div className="text-s ">Tình trạng</div>
                                </th>

                                <th className={""}>
                                    <div className="is-flex jt-end px-l ">
                                        <div className="btn btn-ghost">
                                            <DuckIcon className={"text-l text-right"} icon={"context-menu-2 "}/>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {userList.length > 0 ? userList.map((item, index) => {
                                return <UserRow key={index} data={item}></UserRow>
                            }) : <tr>
                                <td colSpan={3}><UFO cmt={"Không có giáo viên nào"} size={300}/></td>
                            </tr>}
                            </tbody>
                        </table>
                        {/*{userList.length > 0 && <div className="px-l py-xs">*/}
                        {/*    <Pagination limit={12} total={7}></Pagination>*/}

                        {/*</div>}*/}
                    </div>

                </>

                }</div>

        </div>
    );
}

export default UserInBranch;

