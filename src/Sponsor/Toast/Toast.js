import {useToast} from "./useToast";
import React, {useEffect, useRef, useState} from "react";
import DuckIcon from "duckicon";

const toastTypes = {
    success: {
        icon: <DuckIcon icon={"checked "}/>,
        color: "#56a264",
        progressBarClass: "Thành công",
    },
    warning: {
        icon: <DuckIcon icon={"circle-ignore"}/>,
        color: "#ff8d4f",

        progressBarClass: "Cảnh báo",
    },
    info: {
        icon: <DuckIcon icon={"circle-info"}/>,
        color: "#485FC7",
        progressBarClass: "Thông báo",
    },
    error: {
        icon: <DuckIcon icon={"circle-ignore"}/>,
        color: "#c00000",
        progressBarClass: "Lỗi",
    },
};

const Toast = ({message, type, id}) => {
    const {icon, color, progressBarClass} = toastTypes[type];
    const toast = useToast() // call useToast
    const timerID = useRef(null);

    const [dismissed, setDismissed] = useState(false);

    const handleDismiss = () => {
        setDismissed(true);
        setTimeout(() => {
            toast.remove(id);
        }, 400);
    };
    useEffect(() => {
        timerID.current = setTimeout(() => {
            handleDismiss();
        }, 4000);

        return () => {
            clearTimeout(timerID.current);
        };
    }, []);
    return (
        <div className={`toast rounded bg-black text-white  ${dismissed ? "toast-dismissed" : ""}`}>

            <div className="toast-message is-flex jt-between align-center">
                    <div className={"size-l is-center rounded"} style={{background:color}}>
                        <div className="toast-icon text-white text-bold ">
                            {icon}
                        </div>
                    </div>
                    <p className="title-s ">{message}</p>
                    <div onClick={handleDismiss} className={"size-l is-center rounded"}>
                        <DuckIcon className="text-l text-white " icon="multiply"></DuckIcon>
                    </div>



            </div>

        </div>
    )
}

export default Toast;