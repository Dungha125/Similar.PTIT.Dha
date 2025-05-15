import { pdfjs } from 'react-pdf';

// Cấu hình workerSrc với URL từ CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
