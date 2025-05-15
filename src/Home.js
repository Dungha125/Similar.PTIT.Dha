import React from 'react';
import DuckIcon from "duckicon";
import {BrandLogo, RotateLogo} from "./CoreBase/Brand";
import {Link} from "react-router-dom";

function Home(props) {
    return (
        <div className={"Main"}>
            <div className="container-full p-xxl">
                <div className="hero hero-bg rounded-t-l has-background   ">
                    <div className=" logo-transform">

                    </div>
                    <div className=" p-xxl rounded-l">

                        <div className="is-flex vertical gap-l align-center">
                            <RotateLogo/>

                            <div className="hi-xl  text-center pb-xxl">
                                Unlock <strong className={"color-brand"}>Clarity </strong> in <i>Every</i>
                                <strong> Document </strong>
                            </div>

                            <div className="btn-group container-s l ">
                                <input className={"is-l"} placeholder={"Search for documents, topics, subjects..."}
                                       type="search"/>
                                <div className="btn btn-l">
                                    <DuckIcon icon={"zoom"} className={"text-xxl"}></DuckIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-l">
                        {/*<h1 className="hi-l">All Tools</h1>*/}
                        <div className="grid-3">
                            <Link to={"/"} className="col border bg-hover-light">
                                <div className="is-flex vertical p-l gap-l">
                                    <div className="is-flex vertical  gap-s">
                                        <h1>Similar<span className={"h-l color-brand"}>.</span><i className={"title-l "}>Checker</i></h1>
                                        <div className="text-xs text-disable">Check your document similarity</div>
                                    </div>

                                    <div className="is-flex jt-end">
                                        <BrandLogo />
                                    </div>
                                </div>
                            </Link>
                            <div className="col border bg-hover-light">
                                <div className="is-flex vertical p-l gap-l">
                                    <div className="is-flex vertical  gap-s">
                                        <h1>True<span className={"h-l color-brand"}>.</span><i className={"title-l "}>Checker</i></h1>
                                        <div className="text-xs text-disable">Verify the accuracy of documents</div>
                                    </div>

                                    <div className="is-flex jt-end">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="12" fill="#0A0A0A"/>
                                            <rect x="27.5449" y="16" width="7.09091" height="5" rx="0.768" transform="rotate(180 27.5449 16)" fill="white"/>
                                            <rect x="18.0918" y="30" width="7.09091" height="5" rx="0.768" transform="rotate(180 18.0918 30)" fill="#FF3838"/>
                                            <rect x="37" y="30" width="7.09091" height="5" rx="0.768" transform="rotate(180 37 30)" fill="#FF3838"/>
                                            <rect x="27.5449" y="30" width="7.09091" height="5" rx="0.768" transform="rotate(180 27.5449 30)" fill="white"/>
                                            <rect x="27.5449" y="37" width="7.09091" height="5" rx="0.768" transform="rotate(180 27.5449 37)" fill="white"/>
                                            <rect x="37" y="18" width="5" height="26" rx="0.768" transform="rotate(90 37 18)" fill="white"/>
                                        </svg>

                                    </div>
                                </div>
                            </div>
                            <div className="col border bg-hover-light">
                                <div className="is-flex vertical p-l gap-l">
                                    <div className="is-flex vertical  gap-s">
                                        <h1>Spells<span className={"h-l color-brand"}>.</span><i className={"title-l "}>Checker</i></h1>
                                        <div className="text-xs text-disable">Check Vietnamese spelling</div>
                                    </div>

                                    <div className="is-flex jt-end">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="12" fill="#0A0A0A"/>
                                            <rect x="27" y="37" width="6" height="27" rx="0.768" transform="rotate(180 27 37)" fill="white"/>
                                            <rect x="38" y="16" width="9" height="6" rx="0.768" transform="rotate(180 38 16)" fill="white"/>
                                            <rect x="19" y="31" width="6" height="9" rx="0.768" transform="rotate(90 19 31)" fill="#FF3838"/>
                                        </svg>

                                    </div>
                                </div>
                            </div>
                            <div className="col border bg-hover-light">
                                <div className="is-flex vertical p-l gap-l">
                                    <div className="is-flex vertical  gap-s">
                                        <h1>Profession<span className={"h-l color-brand"}>.</span><i className={"title-l "}>Writer</i></h1>
                                        <div className="text-xs text-disable">Document writing support</div>
                                    </div>

                                    <div className="is-flex jt-end">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="12" fill="#0A0A0A"/>
                                            <rect x="22.0918" y="16" width="7.09091" height="5" rx="0.768" transform="rotate(180 22.0918 16)" fill="white"/>
                                            <rect x="31.0918" y="30" width="7.09091" height="5" rx="0.768" transform="rotate(180 31.0918 30)" fill="#FF3838"/>
                                            <rect x="22.0918" y="30" width="7.09091" height="5" rx="0.768" transform="rotate(180 22.0918 30)" fill="white"/>
                                            <rect x="31.0918" y="16" width="7.09091" height="5" rx="0.768" transform="rotate(180 31.0918 16)" fill="white"/>
                                            <rect x="22.0918" y="37" width="7.09091" height="5" rx="0.768" transform="rotate(180 22.0918 37)" fill="white"/>
                                            <rect x="33" y="18" width="5" height="18" rx="0.768" transform="rotate(90 33 18)" fill="white"/>
                                        </svg>

                                    </div>
                                </div>
                            </div>
                            <div className="col border bg-hover-light">
                                <div className="is-flex vertical p-l gap-l">
                                    <div className="is-flex vertical  gap-s">
                                        <h1>Format<span className={"h-l color-brand"}>.</span><i className={"title-l "}>Writer</i></h1>
                                        <div className="text-xs text-disable">Write documents according to standards</div>
                                    </div>

                                    <div className="is-flex jt-end">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" rx="12" fill="#0A0A0A"/>
                                            <rect x="22" y="38" width="6" height="27" rx="0.768" transform="rotate(180 22 38)" fill="white"/>
                                            <rect x="35" y="17" width="11" height="6" rx="0.768" transform="rotate(180 35 17)" fill="white"/>
                                            <rect x="35" y="21" width="6" height="11" rx="0.768" transform="rotate(90 35 21)" fill="white"/>
                                        </svg>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Home;