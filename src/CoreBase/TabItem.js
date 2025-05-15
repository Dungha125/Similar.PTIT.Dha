import React, { useEffect, useRef, useState } from 'react';



function Tabs({ tabs,activeTab, handleClick }) {
    const sub = useRef(null);
    const [visible, setVisible] = useState(null);
    const [active, setActive] = useState(0);
    let elmWidth = 0;
    let offSet = 0;

    const onHover = (ref) => {
        setVisible(ref);
    };

    useEffect(() => {
        const elm = sub.current;
        if (elm && visible && visible.current) {
            elmWidth = visible.current.clientWidth;
            offSet += visible.current.offsetLeft;
            elm.style.transform = `translateX(${offSet}px)`;
            elm.style.width = `${elmWidth}px`;
            elm.style.opacity = '1';
        } else if (elm) {
            elm.style.opacity = '0';
        }
    });

    const onClick = (tab: number) => {
        if (active !== tab) {
            setActive(tab);
            handleClick(tab);
        }
    };

    const osStyle: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        width: elmWidth,
        transform: `translateX(${offSet}px)`,
        transitionDuration: '200ms',
    };

    return (
        <div className="tabs">
        <div ref={sub} className="tab-sub" id="sub" style={visible ? osStyle : {}}></div>
    {tabs.map((item, index) => (
        <TabItem key={index} onHover={onHover}>
    <div onClick={() => onClick(index)} className={`tab-item ${index === activeTab ? 'active ' : ''}`}>
        {item.tabName}
        </div>
        </TabItem>
    ))}
    </div>
);
}


export const TabItem= ({onHover, children,style,className}) => {
    const tab = useRef(null);
    return (
        <div
            ref={tab}
    className={className}
    style={style}
    onMouseEnter={() => {
        onHover(tab)
    }}
    onMouseLeave={() => onHover(null)}
>
    {children}
    </div>
);
};

export default Tabs;

function Segment(props) {
    const sub = useRef(null)
    const [visible, setVisible] = useState(null);
    let elmWidth = 0
    let offSet = 0
    const onHover = ref => {
        if (ref)
            setVisible(ref)
        else setVisible(null)
    }
    useEffect(() => {
        const elm = sub.current
        if (visible != null) {
            elmWidth = visible.current.clientWidth
            offSet += visible.current.offsetLeft
            elm.style.transform = `translateX(${offSet}px)`
            elm.style.width = `${elmWidth}px`
        } else {
            elm.style.opacity = 0;
        }
    })

    const osStyle = {
        opacity: visible ? 1 : 0,
        width: elmWidth,
        transform: `translateX(${offSet}px)`,
        transitionDuration: '200ms'
    }
    return <div className="segment">
        <div ref={sub} className="segment-sub" style={visible ? osStyle : {}}/>
        {props.segment.map((item, index) => {
            return <SegmentItem key={index} onHover={onHover}>
                {props.child({item, index, ...props})}
            </SegmentItem>
        })}
    </div>
}
const SegmentItem = (props) => {
    const segment = useRef(null)
    return <div ref={segment}  style={props.style}
                onMouseEnter={() => props.onHover(segment)}
                onMouseLeave={() =>
                    props.onHover(null)
                }>
        {props.children}

    </div>
}
export {Segment, SegmentItem};