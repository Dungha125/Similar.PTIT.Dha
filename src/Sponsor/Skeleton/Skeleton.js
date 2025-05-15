import React from 'react';



const Skeleton = ({ width = '100%', height = '100%', borderRadius = '8px'  ,className=''}) => {
    return (
        <div
            className={"skeleton "+className}
            style={{ width, height, borderRadius }}
        ></div>
    );
};

export default Skeleton;

export const TableSkeleton = ({ width = 5, skeleton ='20px'}) => {
    var indents = [];
    for (let i = 0; i < width; i++) {
        indents.push(
            <tr className={"border-b"}>
                <td colSpan="999">
                    <div className="columns gap-l p-m">
                        <div className="col-3 ">
                            <Skeleton height={skeleton}/>
                        </div>
                        <div className="col-2">
                            <Skeleton height={skeleton}/>
                        </div>

                        <div className="col ">
                            <Skeleton height={skeleton}/>
                        </div>

                        <div className="col ">
                            <Skeleton height={skeleton}/>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }

    return (
        indents
    );
}
 export const PaginationSkeleton = ({ width = 5, skeleton =' 20px'}) => {
    return <div className={"is-flex jt-between"}>
        <Skeleton width={"120px"} height={skeleton}/>
        <Skeleton width={"220px"} height={skeleton}/>
    </div>
 }