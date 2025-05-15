import React from 'react';
import DuckSelect from "../../../Sponsor/Select";

function FilterSection({
                           branchList,
                           departmentList,
                           subjectList,
                           selectedBranch,
                           selectedDepartment,
                           selectedSubject,
                           onChangeBranch,
                           onChangeDepartment,
                           onChangeSubject
                       }) {
    return (
        <div className="pb-m mt-xxl">
            <div className="title-xl">Tổng quan</div>
            <p className="text-s text-disable">Thống kê trong hệ thống</p>
            <div className="columns gap-m py-m">
                <div className="col-3">
                    <input type="search" placeholder="Tìm kiếm tài liệu" className="is-fill-x" />
                </div>
                <div className="col-2">
                    <DuckSelect
                        data={branchList}
                        value={selectedBranch}
                        placeholder="Khoa"
                        onSelect={onChangeBranch}
                        child={({ item }) => (
                            <div
                                title={item.name}
                                key={item.id}
                                className={`p-s rounded-xs ${
                                    selectedBranch.id === item.id ? "title-m text-black" : "text-mute"
                                }`}
                            >
                                <div className="is-flex gap-m">
                                    <p className="text-s">{item.name}</p>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="col-2">
                    <DuckSelect
                        data={departmentList}
                        disable={selectedBranch.id === "all" || departmentList.length <= 1}
                        value={selectedDepartment}
                        placeholder="Phòng ban"
                        onSelect={onChangeDepartment}
                        child={({ item }) => (
                            <div
                                title={item.name}
                                key={item.id}
                                className={`p-s rounded-xs ${
                                    selectedDepartment.id === item.id ? "title-m text-black" : "text-mute"
                                }`}
                            >
                                <div className="is-flex gap-m">
                                    <p className="text-s">{item.name}</p>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="col-2">
                    <DuckSelect
                        data={subjectList}
                        disable={selectedDepartment.id === "all" || subjectList.length <= 1}
                        value={selectedSubject}
                        placeholder="Học phần"
                        onSelect={onChangeSubject}
                        child={({ item }) => (
                            <div
                                title={item.name}
                                key={item.id}
                                className={`p-s rounded-xs ${
                                    selectedSubject.id === item.id ? "title-m text-black" : "text-mute bg-hover-light"
                                }`}
                            >
                                <div className="is-flex gap-m">
                                    <p className="text-s">{item.name}</p>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default FilterSection;