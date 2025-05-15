import React, {useEffect, useRef, useState} from 'react';

function Tabs({tabs, handleClick}) {
    const sub = useRef(null)
    const [visible, setVisible] = useState(null);
    const [active, setActive] = useState(0);
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
    const onClick = (tab) => {
        if (active === tab) {

        } else {
            setActive(tab)
            handleClick(tab)
        }
    }
    const osStyle = {
        opacity: visible ? 1 : 0,
        width: elmWidth,
        transform: `translateX(${offSet}px)`,
        transitionDuration: '200ms'
    }

    return <div className="pl-m tabs bg-white" >
        <div ref={sub} className="tab-sub" id="sub"
             style={visible ? osStyle : {}}></div>
        {tabs.map((item,index)=>{
            return 	<TabItem key={index} onHover={onHover}>
                <div onClick={() => onClick(index)} className={`tab-item ${active === index ? "active" : ""}`}>
                    {item.tabName}
                </div>
            </TabItem>
        })}
    </div>;

}

const TabItem = (props) => {
    const tab = useRef(null)
    return <div ref={tab} className={props.className} style={props.style} onMouseEnter={() => props.onHover(tab)}
                onMouseLeave={() =>
                    props.onHover(null)
                }>
        {props.children}

    </div>
}
export default Tabs;
export {TabItem}