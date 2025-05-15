import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

const ModalSlide = ({size, isOpen,onClose, children }) => {
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
    const dialogRef = React.createRef();
    // handle click Outside modal dialog
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (onClose && dialogRef.current && !dialogRef.current.contains(event.target)) {
               onClose()
            }
        }
        // press esc to close modal
        function handleEsc(event) {
            if (onClose && event.key === 'Escape') {
                onClose()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [dialogRef]);
    return ReactDOM.createPortal(
        <div className="Duck">
            <div className={` modal-slide ${disModal ? "is-open" : ""}`}>
                <div ref={dialogRef} className={`modal-dialog overflow-auto    ${disDialog?"open":"close"} ${size === 's' ? "modal-s": size === 'pre'? "modal-preview":"" }`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModalSlide;