
const StorageCard = ({ used, total }) => {
    const percent = (parseFloat(used) / parseFloat(total)) * 100;

    return (
        <div>
            <div>
                <div>Lưu trữ</div>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span>Dung lượng đã dùng</span>
                    <span>{used}GB / {total}GB</span>
                </div>
                <div value={percent} />
                <button className="w-full mt-4 bg-black text-white py-2 rounded-xl hover:bg-gray-800 text-sm">
                    Quản lý dung lượng
                </button>
            </div>
        </div>
    );
};

export default StorageCard;
