import React, {useState} from 'react';
import {useUpdateSubjectMutation} from "../../../services/subject";
import {useToast} from "../../../Sponsor/Toast/useToast";

function SettingInSubject({subject}) {
    const [updateSubject] = useUpdateSubjectMutation();

    const [newsSubject, setNewsSubject] = useState(subject)
    const toast = useToast();
    const handleUpdateSubject = async () => {
        const subjectData = {
            name: newsSubject.name,
            description: newsSubject.description
        };
        try {
            const res = await updateSubject({subjectID:subject.id,  ...subjectData});
            if (res?.data) {
                setNewsSubject({name: "", description: ""});
                toast.success("Đã cập nhật học phần");
            }
        } catch (e) {
            toast.error(e);
        }
    };
    return (
        <div className={"is-flex vertical align-end"}>
                <div className="is-flex vertical is-fill-x">
                    <div className="field">
                        <div className="label">Tên học phần</div>
                        <input
                            value={newsSubject.name}
                            onChange={(e) => setNewsSubject({...newsSubject, name: e.target.value})}
                            type="text"
                            className="input"
                        />
                    </div>
                    <div className="field">
                        <div className="label">Mô tả</div>
                        <textarea
                            value={newsSubject.description}
                            onChange={(e) => setNewsSubject({...newsSubject, description: e.target.value})}
                            className="input"
                        />
                    </div>
                </div>
                <div onClick={ handleUpdateSubject } className="btn">
                    Cập nhật
                </div>
        </div>
    );
}

export default SettingInSubject;