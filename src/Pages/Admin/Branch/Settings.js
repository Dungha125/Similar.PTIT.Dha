import React from 'react';

function Settings(props) {
    return (
        <div className={"bg-light"}>
            <div className="container-xl px-xl">
                <div className={"columns "}>
                    <div className="col  ">
                        <div className="is-flex gap-s mt-xxl p-m vertical">
                            <p className="p-s title-s text-black rounded-s bg-sliver">
                                Cài đặt chung
                            </p>
                            <p className="p-s title-s text-mute rounded-s bg-hover-light">
                                Quyền
                            </p>
                            <p className="p-s title-s text-mute rounded-s bg-hover-light">
                                Dung lượng
                            </p>
                            <p className="p-s title-s text-secondary rounded-s bg-hover-light">
                                Quản lý
                            </p>
                        </div>

                    </div>
                    <div className="col-4">
                        <div className={"border mt-xxl bg-white p-xl"}>
                            <div className={"gapy-s"}>
                                <h3 className={"title-l"}>Cài đặt chung</h3>
                                <div className="text-xs text-disable">
                                    Thêm các giảng viên có thể tải tài liệu lên
                                </div>
                            </div>
                            <div className="is-flex vertical">
                                <div className="field is-required">
                                    <div className="label">Tên ngành</div>
                                    <input value="Khoa Kỹ thuật" type="text"/>
                                </div>
                                <div className="field is-required">
                                    <div className="label">Mô tả</div>
                                    <textarea/>
                                </div>
                            </div>
                        </div>
                        <div className={"border mt-xxl bg-white p-xl"}>
                            <div className={"gapy-s"}>
                                <h3 className={"title-l"}>Cài đặt chung</h3>
                                <div className="text-xs text-disable">
                                    Thêm các giảng viên có thể tải tài liệu lên
                                </div>
                            </div>
                            <div className="is-flex vertical">
                                <div className="field is-required">
                                    <div className="label">Tên ngành</div>
                                    <input value="Khoa Kỹ thuật" type="text"/>
                                </div>
                                <div className="field is-required">
                                    <div className="label">Mô tả</div>
                                    <textarea/>
                                </div>
                            </div>
                        </div>
                        <div className={"border mt-xxl bg-white p-xl"}>
                            <div className={"gapy-s"}>
                                <h3 className={"title-l"}>Cài đặt chung</h3>
                                <div className="text-xs text-disable">
                                    Thêm các giảng viên có thể tải tài liệu lên
                                </div>
                            </div>
                            <div className="is-flex vertical">
                                <div className="field is-required">
                                    <div className="label">Tên ngành</div>
                                    <input value="Khoa Kỹ thuật" type="text"/>
                                </div>
                                <div className="field is-required">
                                    <div className="label">Mô tả</div>
                                    <textarea/>
                                </div>
                            </div>
                        </div>
                        <div className={"border mt-xxl bg-white p-xl"}>
                            <div className={"gapy-s"}>
                                <h3 className={"title-l"}>Cài đặt chung</h3>
                                <div className="text-xs text-disable">
                                    Thêm các giảng viên có thể tải tài liệu lên
                                </div>
                            </div>
                            <div className="is-flex vertical">
                                <div className="field is-required">
                                    <div className="label">Tên ngành</div>
                                    <input value="Khoa Kỹ thuật" type="text"/>
                                </div>
                                <div className="field is-required">
                                    <div className="label">Mô tả</div>
                                    <textarea/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}

export default Settings;