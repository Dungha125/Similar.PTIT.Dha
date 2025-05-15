// fileUploadService.js

import {base,current} from "./base";

export const uploadFileToServer = (file, onProgress) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${base}/api/document`, true);

        // Set request headers if needed (but try to minimize)
        // xhr.setRequestHeader("Content-Type", "multipart/form-data"); // Usually not needed when using FormData
        // xhr.setRequestHeader("Authorization", "Bearer YOUR_TOKEN"); // Example if you need authentication

        // Update progress
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                onProgress(percentComplete);
                console.log(percentComplete)
            }
        };

        // On load
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                console.log("UploadPage successful:", response);
                resolve({ success: true, data: response });
            } else {
                console.error("UploadPage failed:", xhr.statusText);
                reject({ success: false, error: xhr.statusText });
            }
        };

        // On error
        xhr.onerror = () => {
            console.error("Error uploading file");
            reject({ success: false, error: "Error uploading file" });
        };

        // Send the request
        xhr.send(formData);
    });
};
