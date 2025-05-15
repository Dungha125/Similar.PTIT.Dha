import Toast from './Toast';

const ToastsContainer = ({ toasts }) => {

    return (
        <div className="Duck">
            <div className="toasts-container-2 bottom-center">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </div>

    );
};

export default ToastsContainer;