import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

const Dialog = ({isOpen, children, onClose}) => {
    const [disDialog, setDisDialog] = useState(false);
    const [disModal, setDisModal] = useState(false);

    useEffect(() => {
        let timerId;

        if (isOpen) {
            document.body.classList.add('modal-open'); // Thêm lớp khi modal mở
            setDisModal(true);
            timerId = setTimeout(() => {
                setDisDialog(true);
            }, 100);
        } else {
            document.body.classList.remove('modal-open'); // Loại bỏ lớp khi modal đóng
            setDisDialog(false);
            timerId = setTimeout(() => {
                setDisModal(false);
            }, 400);
        }

        return () => clearTimeout(timerId);
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        // Kiểm tra nếu người dùng click vào backdrop, không phải vào modal-dialog
        if (e.target.classList.contains('modal')) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className="Duck">
            {disModal && (
                <div
                    className={`modal ${disModal ? 'is-open' : ''}`}
                    onClick={handleBackdropClick} // Lắng nghe sự kiện click trên backdrop
                >
                    <div
                        className={`modal-dialog dialog border overflow-auto ${disDialog ? 'open' : 'close'} `}
                        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan đến backdrop
                    >
                        {children}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default Dialog;

const DialogConfirm = ({isOpen, type = "danger", onConfirm, onClose, title, content, confirm = "Xoá"}) => (
    <Dialog isOpen={isOpen} onClose={onClose}>

        <div className="modal-body bg-white p-l">
            <div className={"mb-m  title-l is-fill-x"}>{title}</div>
            <p style={{whiteSpace: 'pre-line'}} className={" text-mute is-fill-x"}>{content}</p>
        </div>
        <div className="modal-bottom  p-m">
            <div className="btn btn-s btn-fill" onClick={onClose}>Huỷ</div>
            <div className={`btn btn-s ${type === "danger" ? "btn-primary" : "btn-secondary"}`} onClick={onConfirm}>
                <span className="text-white">{confirm}</span></div>
        </div>
    </Dialog>
);

export {DialogConfirm};