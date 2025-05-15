import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ size, isOpen, children, onClose }) => {
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
                        className={`modal-dialog border overflow-auto ${disDialog ? 'open' : 'close'} ${
                            size === 's' ? 'modal-s' : size === 'pre' ? 'modal-preview' : ''
                        }`}
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

export default Modal;
