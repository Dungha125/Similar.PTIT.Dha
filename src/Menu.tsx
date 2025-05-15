import {useParams} from "react-router-dom";
import {TabItem} from "./CoreBase/TabItem";
// @ts-ignore
import React, {useEffect, useRef, useState} from "react";
import {Similaritydocument, PageResult} from "./PDFViewer/type";
import DuckIcon from "duckicon";
// @ts-ignore
import {getStyle} from "./PDFViewer/PDFH.tsx";
import CustomDocs from "./CoreBase/CustomDocs"
import Tabs, {Segment} from "./CoreBase/TabItem";

interface MenuProps {
    // setActiveNews: (value: number) => void;
    list: Similaritydocument[]
    styles: {
        style: number,
        color: number
    }[]
    setStyle: (value: number) => void
}

const scrollToTop = () => {
    const targetElement = document.getElementById("intoview");
    if (targetElement) {
        targetElement.scrollTop = 0;
    }
}

function truncatePdfFilename(filename: string): string {
    // Regular expression to match numbers followed by an underscore
    const regex = /^[0-9]+_/;
    // Remove the numbers before the first underscore
    return filename.replace(regex, '');
}

const updateHash = (id: string) => {
    document.location.hash = `highlight-${id}`;
};

const PercentBar = ({percent}) => {
    const maxStorageGB = 100; // Cứng theo UI

    return (<div>
            <div className={"is-flex align-center gap-m mt-m"}>
                <div className="is-fill-x size-y-s bg-sliver rounded ">
                    <div
                        className="size-y-s rounded bg-primary"
                        style={{width: `${percent + 10}%`}}
                    ></div>
                </div>
                <div className=" size-x-xxl text-right text-xs">{`${percent + 10}% `}</div>

            </div>
        </div>

    );
};
export const Menu = ({list, styles, setStyle}: MenuProps) => {
    const {seriesUrl, customUrl} = useParams<Record<string, string | undefined>>();
    const sub = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState<HTMLDivElement | null>(null);
    const [active, setActive] = useState<string>(customUrl);
    const [offSet, setOffSet] = useState(0)
    const [clItem, setClItem] = useState<number>(0)
    let elmWidth = 0;
    let elmHeight = 0;
    const [tab, setTab] = useState(0);
    const osStyle = {
        right: "0px",
        left: "0px",
        opacity: visible ? 1 : 0,
        width: elmWidth,
        transform: `translateY(${offSet}px)`,
        transitionDuration: '300ms'
    };
    const tabs = [
        {tabId: 0, tabName: "Kiểm tra trùng lặp", link: "department"},
        {tabId: 1, tabName: "Soát chính tả", link: "teacher"},
    ];

    function changeTab(value) {
        setTab(value);
    }

    useEffect(() => {
        const elm = sub.current;
        if (elm && visible) {
            elmWidth = visible.clientWidth;
            elmHeight = visible.clientHeight;
            setOffSet(visible.offsetTop)
            elm.style.transform = `translateY(${offSet}px)`;
            elm.style.width = `${elmWidth}px`;
            elm.style.height = `${elmHeight}px`;
            elm.style.opacity = '1';
        } else if (elm) {
            elm.style.opacity = '0';
        }
    }, [visible]);

    useEffect(() => {
        setActive(customUrl);
    }, [customUrl]);

    const onHover = (ref: React.RefObject<HTMLDivElement> | null) => {
        if (ref && ref.current) {
            setVisible(ref.current);
            setOffSet(ref.current.offsetTop)
        } else setVisible(null)
    };
    const handleScrollTo = (id: string, pageNumber: number) => {
        const container = document.querySelector('.PdfHighlighter');

        if (!container) {
            console.error('Container .PdfHighlighter not found.');
            return;
        }

        // Tìm trang chứa highlight trước
        const pageElement = document.querySelector(`[data-page-number="${pageNumber}"]`);

        if (pageElement) {
            // Cuộn đến trang trước
            pageElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });

            // Đợi trang load xong rồi mới tìm và scroll đến highlight
            setTimeout(() => {
                const targetElement = document.getElementById(id);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });

                    targetElement.classList.add('highlight-color');
                    setTimeout(() => targetElement.classList.remove('highlight-color'), 3000);
                } else {
                    console.error(`Element with id ${id} not found after page scroll.`);
                }
            }, 500); // Đợi trang render xong (có thể điều chỉnh thời gian)
        } else {
            console.error(`Page ${pageNumber} not found.`);
        }
    };

    return (
        <div className={"is-flex vertical"}>
            <div className={"  is-flex is-grow gap-m"}>

                <div className=" is-calc2  is-flex vertical  w-312 is-relative border bg-blur-white">
                    <div className="p-m h-80 border-b is-sticky  " style={{zIndex: 100, top: 0}}>
                        <Segment handleClick={() => {
                        }} segment={[{action: "Kiểm tra trùng lặp", value: 0}, {
                            action: "Soát chính tả",
                            value: 1
                        }]}
                                 child={({item, index}) => (
                                     <div key={index}
                                          className={`btn text-center  gapx-xs ${tab === item.value ? "active" : ""}`}
                                          onClick={() => {
                                              setTab(item.value)
                                          }}>
                                         <div className="text-capitalize text-semi text-xs">{item.action}</div>
                                     </div>)}
                        />
                    </div>

                    {tab === 0 ? <div className={"is-grow is-fill  is-scroll-y"}>
                            <div className="is-flex vertical   p-m is-fill ">

                                <div className="pb-m title-s text-uppercase text-disable ">
                                    Danh sách file
                                </div>
                                <div className="is-flex vertical gap-m">

                                    {list.map((item, index) => {
                                        return <div key={index} onClick={() => {
                                            setActive(`item${index}`);
                                            setVisible(null);
                                            scrollToTop()
                                            setClItem(index)

                                        }}
                                                    className={`p-x animate-DFJ item border rounded-s is-overflow  ${clItem === index ? " bg-light" : ""}`}>
                                            <div key={index}
                                                 className={`sidebar-btn  cursor-pointer  is-flex vertical align-center  p-m   ${clItem === index && "bg-primary-light"}`}>
                                                <div className={"is-flex  "}>
                                                    <div>
                                                        <div className="size-xl is-center  ">
                                                            <DuckIcon className={"text-secondary text-xxl"}
                                                                      icon={"document"}/>
                                                        </div>
                                                    </div>

                                                    <div className="item-text pl-s ">
                                                        <div className="is-flex vertical jt-between gap-m">
                                                            <div className="title-s truncate text-mute"
                                                                 style={{maxWidth: "250px"}}>{truncatePdfFilename(item.file_resource_id || 'abc-xyz.pdf')}</div>

                                                            <PercentBar percent={item.similarity_value}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {clItem === index && <CustomDocs index={clItem}
                                                                             name={list[clItem].file_resource_id}
                                                                             setStyle={setStyle}/>}

                                        </div>
                                    })}


                                </div>
                            </div>

                        </div> :
                        <div className="is-grow is-fill  is-scroll-y bg-white is-flex vertical align-center gap-m p-m">
                            <ListContentGrammar clItem={clItem} handleScrollTo={handleScrollTo}
                                                setActive={setActive}
                                                listContent={list[clItem].page_result} active={active}/>

                        </div>
                    }
                </div>

                <div
                    className={`border is-calc2 is-flex vertical is-overflow bg-white transition-all ${tab === 1 ? "w-0 " : "w-312"}`}>
                    <div className="p-m h-80 is-sticky border-b">
                        <div className="is-flex vertical  gap-s ">
                            <div className="is-flex align-center gap-s">
                                <div
                                    className={`  ${getStyle(styles[clItem].style, styles[clItem].color, clItem)}`}>
                                    <div className={`  size-mark py-xs  hl-${clItem}`}>
                                        <div className={` px-s  is-center  mark`}>
                                            <div className="text-black  title-xs">
                                                Mark
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="title-s gap-s is-1-line">
                                    {truncatePdfFilename(list[clItem].file_resource_id || 'abc-xyz.pdf')}.pdf
                                </div>
                            </div>

                            <div className="text-xs text-disable">
                                {list[clItem].page_result.reduce((acc, item) => acc + item.similarity_content.length, 0)} nội
                                dung trùng lặp
                            </div>
                        </div>

                    </div>

                    <div className=" is-grow is-fill  is-scroll-y is-flex gap-m vertical p-m">
                        <ListContentSimilarity clItem={clItem} handleScrollTo={handleScrollTo} setActive={setActive}
                                               listContent={list[clItem].page_result}
                                               active={active}></ListContentSimilarity>
                    </div>

                </div>
            </div>
        </div>

    );
};


interface ListContentSimilarityProps {
    clItem: number;
    listContent: any;
    active: string;
    setActive: (value: string) => void; // khai báo rõ ràng hàm nhận string
    handleScrollTo: (id: string, pageNumber: number) => void;
}

const ListContentSimilarity = ({
                                   clItem,
                                   listContent,
                                   active,
                                   setActive,
                                   handleScrollTo
                               }: ListContentSimilarityProps) => {
    return (<>
        {listContent.map((itemSimilarity, indexSimilarity) => {
            return <div className={"is-flex gap-m vertical "}
                        key={indexSimilarity}>{itemSimilarity.similarity_content.map((content, contentIndex) => {
                return <div key={contentIndex}
                            className={`item border rounded-s  cursor-pointer ${active === `item-${indexSimilarity}-${contentIndex}` && "bg-light"}`}
                >
                    <div

                        className=" p-m">

                        <div className="is-flex align-end vertical text-wrap"
                             style={{maxWidth: "360px"}}>

                            <div
                                className={`text-xs is-2-line text-wrap ${active === `item-${indexSimilarity}-${contentIndex}` && "text-black fw-active"}`}>
                                {content.content.replace(/_/g, ' ')}
                            </div>
                            <div className="is-flex is-fill-x py-s">
                                <div className="text-xs text-disable">
                                    Trang {itemSimilarity.pageNumber + 1} |   &nbsp; Nguồn: Name of file
                                </div>
                            </div>
                            <div
                                onClick={(e) => (e.stopPropagation(), setActive(`item-${indexSimilarity}-${contentIndex}`), handleScrollTo(`page${clItem}-${indexSimilarity}-${contentIndex}`, itemSimilarity.pageNumber))}
                                className="btn btn-fill btn-s ">
                                <div className="title-xs">
                                    Xem
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })
            }</div>
        })}
    </>)
}
const ListContentGrammar = ({clItem, listContent, active, setActive, handleScrollTo}: ListContentSimilarityProps) => {
    // File data with individual highlighting preferences, duplicate content, and spelling errors
    const [files, setFiles] = useState([
        {
            id: 1,
            name: "thesis.pdf",
            duplicatePercentage: 23,
            spellingErrorCount: 15,
            duplicateHighlightColor: "#ffcc00",
            duplicateHighlightStyle: "highlight",
            spellingHighlightColor: "#ff6666",
            spellingHighlightStyle: "underline",
            duplicateContent: [
                {
                    id: 1,
                    text: "Artificial intelligence (AI) is intelligence demonstrated by machines...",
                    page: 1,
                    source: "Wikipedia",
                },
                {
                    id: 2,
                    text: "Machine learning is a subset of artificial intelligence that provides systems...",
                    page: 3,
                    source: "Research Paper #42",
                },
            ],
            spellingErrors: [
                {
                    id: 1,
                    word: "intellegence",
                    suggestion: "intelligence",
                    context: "Artificial intellegence (AI) is a field of...",
                    page: 1,
                },
                {
                    id: 2,
                    word: "algoritm",
                    suggestion: "algorithm",
                    context: "The algoritm processes data to make predictions...",
                    page: 2,
                },
                {
                    id: 3,
                    word: "lerning",
                    suggestion: "learning",
                    context: "Machine lerning models require large datasets...",
                    page: 3,
                },
            ],
        },
        {
            id: 2,
            name: "research-paper.pdf",
            duplicatePercentage: 15,
            spellingErrorCount: 8,
            duplicateHighlightColor: "#66ff66",
            duplicateHighlightStyle: "box",
            spellingHighlightColor: "#66ccff",
            spellingHighlightStyle: "underline",
            duplicateContent: [
                {
                    id: 1,
                    text: "Deep learning is part of a broader family of machine learning methods...",
                    page: 7,
                    source: "AI Textbook",
                },
                {
                    id: 2,
                    text: "Convolutional neural networks are specialized neural networks...",
                    page: 12,
                    source: "Deep Learning Book",
                },
            ],
            spellingErrors: [
                {
                    id: 1,
                    word: "nueral",
                    suggestion: "neural",
                    context: "Convolutional nueral networks process image data...",
                    page: 5,
                },
                {
                    id: 2,
                    word: "proccess",
                    suggestion: "process",
                    context: "The model can proccess large amounts of data...",
                    page: 8,
                },
            ],
        },
        {
            id: 3,
            name: "literature-review.pdf",
            duplicatePercentage: 8,
            spellingErrorCount: 12,
            duplicateHighlightColor: "#ff6666",
            duplicateHighlightStyle: "underline",
            spellingHighlightColor: "#ffcc00",
            spellingHighlightStyle: "box",
            duplicateContent: [
                {
                    id: 1,
                    text: "Natural language processing (NLP) is a subfield of linguistics, computer science...",
                    page: 5,
                    source: "Conference Paper",
                },
            ],
            spellingErrors: [
                {
                    id: 1,
                    word: "lingustics",
                    suggestion: "linguistics",
                    context: "Natural language processing is a field of lingustics...",
                    page: 2,
                },
                {
                    id: 2,
                    word: "procesing",
                    suggestion: "processing",
                    context: "Language procesing requires understanding context...",
                    page: 3,
                },
                {
                    id: 3,
                    word: "grammer",
                    suggestion: "grammar",
                    context: "The system analyzes grammer and syntax...",
                    page: 4,
                },
            ],
        },
        {
            id: 4,
            name: "chapter-1.pdf",
            duplicatePercentage: 5,
            spellingErrorCount: 6,
            duplicateHighlightColor: "#66ccff",
            duplicateHighlightStyle: "highlight",
            spellingHighlightColor: "#cc66ff",
            spellingHighlightStyle: "underline",
            duplicateContent: [
                {
                    id: 1,
                    text: "Reinforcement learning is an area of machine learning concerned with how...",
                    page: 3,
                    source: "ML Handbook",
                },
            ],
            spellingErrors: [
                {
                    id: 1,
                    word: "reinforcment",
                    suggestion: "reinforcement",
                    context: "Reinforcment learning uses reward signals...",
                    page: 1,
                },
                {
                    id: 2,
                    word: "enviroment",
                    suggestion: "environment",
                    context: "Agents interact with the enviroment to learn...",
                    page: 2,
                },
            ],
        },
    ])
    const highlightWord = (context: string, word: string) => {
        const regex = new RegExp(`(${word})`, 'gi');
        return context.replace(regex, '<span class="text-semi text-black">$1</span>');
    };
    return (<>
        {files.map((itemSimilarity, indexSimilarity) => {
            return <div className={"is-flex gap-m vertical "}
                        key={indexSimilarity}>{itemSimilarity.spellingErrors.map((content, contentIndex) => {
                return <div key={contentIndex}
                            className={`item border rounded-s  cursor-pointer ${active === `item-${indexSimilarity}-${contentIndex}` && "bg-light"}`}
                >
                    <div

                        className=" p-m">

                        <div className="is-flex align-end vertical text-wrap"
                             style={{maxWidth: "360px"}}>
                            <div className="is-flex is-fill-x ">
                                <div style={{textDecorationLine: "line-through"}}
                                     className="title-s text-primary">{content.word}</div>
                                <DuckIcon icon={"right-direction"}></DuckIcon>
                                <div className="title-s text-secondary">{content.suggestion}</div>
                            </div>
                            <div
                                className={`text-xs is-fill-x text-mute-2 is-2-line text-wrap py-m `}
                                dangerouslySetInnerHTML={{
                                    __html: `"... ${highlightWord(content.context, content.word)} ..."`,
                                }}
                            ></div>
                            <div className="is-flex is-fill-x pb-s">
                                <div className="text-xs text-disable">
                                    Trang {content.page} |   &nbsp; Đề xuất bởi GPT
                                </div>
                            </div>
                            <div
                                onClick={(e) => (e.stopPropagation(), setActive(`item-${indexSimilarity}-${contentIndex}`), handleScrollTo(`page${clItem}-${indexSimilarity}-${contentIndex}`, itemSimilarity.pageNumber))}
                                className="btn btn-s ">
                                <div className="title-xs">
                                    Sửa
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })
            }</div>
        })}
    </>)
}
