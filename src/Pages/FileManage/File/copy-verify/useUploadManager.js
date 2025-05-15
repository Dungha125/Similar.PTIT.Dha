import { useState } from "react";

export function useUploadManager() {
    const [upload, setUpload] = useState(null);
    const [minimized, setMinimized] = useState(false);

    const addFile = (file) => {
        if (upload && upload.status === "uploading") return; // Không chọn khi đang tải
        console.log(upload)
        const newFile = {
            id: Date.now(),
            name: file.name,
            size: file.size,
            progress: 0,
            status: "uploading",
        };
        setUpload(newFile);

        // Fake upload
        const interval = setInterval(() => {
            setUpload((prev) =>
                prev ? { ...prev, progress: Math.min(prev.progress + 10, 100) } : null
            );
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
            setUpload((prev) =>
                prev ? { ...prev, status: "done", progress: 100 } : null
            );
        }, 15000);
    };

    return { upload, addFile, minimized, setMinimized };
}
