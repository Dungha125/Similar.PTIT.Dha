// const testHighlights: Array<IHighlight> = _testHighlights;
import {IHighlight} from "react-pdf-highlighter";

// export type Coordinates = number[][];
//
// export type Rect =number[]

export interface Position {
    boundingRect: Rect;
    rects: Rect[];
    pageNumber: number;
}

// export function convertCoordinates(coords: number[], pageNumber: number, pageWidth: number, pageHeight: number): Position {
//     const [x1, y1, x2, y2] = coords;
//
//     const boundingRect: Rect = {
//         x1,
//         y1,
//         x2,
//         y2,
//         width: pageWidth,
//         height: pageHeight,
//         pageNumber,
//     };
//
//     return {
//         boundingRect,
//         rects: [boundingRect],
//         pageNumber,
//     };
// }
//
// export function convertSimilarityBoxSentences(
//     similarityBoxSentences: number[][][],
//     pageWidth: number,
//     pageHeight: number
// ): Position[][] {
//     const pageNumber = 2; // Giả định tất cả các vị trí đều thuộc trang 1
//     return similarityBoxSentences.map(sentence =>
//         sentence.map(coords => convertCoordinates(coords, pageNumber, pageWidth, pageHeight))
//     );
// }

// Tạo ID duy nhất
export const getNextId = () => String(Math.random()).slice(2);

// export function convertToIHighlight(positions: Position[][]): IHighlight[] {
//     return positions.flatMap((sentence) =>
//         sentence.map((position) => ({
//             content: {
//                 text: '',
//             },
//             id: getNextId(), // Tạo ID duy nhất cho mỗi highlight
//             position: position,
//             comment: {
//                 text: '', // Bạn có thể thêm giá trị comment mặc định hoặc tùy chỉnh theo nhu cầu
//                 emoji: '', // Bạn có thể thêm emoji mặc định hoặc tùy chỉnh theo nhu cầu
//             }
//         }))
//     );
// }
export interface RootObject {
    data:Data
    file:File
}
export interface File {
    id: string
    subject_id: string
    filename: string
    filepath: string
    uploaded_by: string
    uploaded_at: string
    status: boolean
    width: number
    height: number
}

export interface Data {
    file_check_id: string;
    data_result: DataResult[];
    total_similarity_percent: number;
    create_at: string; // Định dạng ISO, có thể là `Date` nếu cần
    duration: number;
}

export interface DataResult {
    file_name: string;
    file_resource_id: string;
    page_result: PageResult[];
    similarity_value: number;
}

export interface PageResult {
    pageNumber: number;
    similarity_content: SimilarityContent[];
}

export interface SimilarityContent {
    content: string;
    rects: Rect[];
}

export type Rect = [number, number, number, number]; // Giữ nguyên kiểu dữ liệu `Rects`


export function convertToIHighlights(data: RootObject): IHighlight[] {
    const highlights: IHighlight[] = [];

    data.data.data_result.forEach((fileData, fileIndex) => {
        fileData.page_result.forEach((page, pageIndex) => {
            page.similarity_content.forEach((contentItem, contentIndex) => {
                const highlight: IHighlight = {
                    id: `${fileIndex}-${pageIndex}-${contentIndex}`,
                    content: {
                        text: `hl-${fileIndex}`
                    },
                    comment: {
                        text: `${page.pageNumber} ${contentItem.content}`,
                        emoji: '',
                    },
                    position: {
                        pageNumber: page.pageNumber + 1,
                        rects: contentItem.rects.map((rect) => ({
                            x1: rect[0],
                            y1: rect[1],
                            x2: rect[2],
                            y2: rect[3],
                            width: data.file.width, // Không có `size_page`, đặt giá trị mặc định
                            height: data.file.height,
                        })),
                        boundingRect: {
                            x1: contentItem.rects[0][0],
                            y1: contentItem.rects[0][1],
                            x2: contentItem.rects[0][2],
                            y2: contentItem.rects[0][3],
                            width: 0,
                            height: 0,
                        }
                    },
                };
                highlights.push(highlight);
            });
        });
    });

    return highlights;
}

