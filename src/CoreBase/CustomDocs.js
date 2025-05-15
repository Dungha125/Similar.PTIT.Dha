import React, {useState} from 'react';
import DuckIcon from "duckicon";

const colors = [
    {
        id: 0,
        color: 'color-0-background'
    },
    {
        id: 1,
        color: 'color-1-background'
    },
    {
        id: 2,
        color: 'color-2-background'
    },
    {
        id: 3,
        color: 'color-3-background'
    },
    {
        id: 4,
        color: 'color-4-background'
    }
]
const styles = [
    {
        id: 0,
        style: 'cus-border',
        icon: 'background'

    },
    {
        id: 1,
        style: 'background',
        icon: 'rectangle-16-9'
    },
    {
        id: 2,
        style: 'dash-border',
        icon: 'context-menu-1 h-l'
    },
]
let json = require('../PDFViewer/plagiarism.json')
let sampleJSON;
sampleJSON = json;

function CustomDocs({setStyle, index, name}) {
    const [cusStyle, setCusStyle] = useState(0);
    const [color, setColor] = useState(index);
    const [visible,setVisible] =useState(true)
    const handleSetCusStyle = (value) => {
        setStyle((prevStyle) => {
            // Create a new array from the previous state
            const updatedStyles = [...prevStyle];
            // Update the specific element at the index
            updatedStyles[index] = {...updatedStyles[index], style: value, color: color};
            // Return the updated array
            return updatedStyles;
        });
        setCusStyle(value)
    }
    const handleSetColor = (value) => {
        setStyle((prevStyle) => {
            // Create a new array from the previous state
            const updatedStyles = [...prevStyle];
            // Update the specific element at the index
            updatedStyles[index] = {...updatedStyles[index], style: cusStyle, color: value};
            // Return the updated array
            return updatedStyles;
        });
        setColor(value)
    }
    const handleSetVisible = (e) => {
        e.stopPropagation()
        console.log("call")
        setStyle((prevStyle) => {
            // Create a new array from the previous state
            const updatedStyles = [...prevStyle];
            // Update the specific element at the index
            updatedStyles[index] = {
                ...updatedStyles[index],
                style: visible ? 999 : cusStyle,
                color: color
            };
            // Return the updated array
            return updatedStyles;
        });

        setVisible(!visible);
    };

    return (
        <div className="is-flex vertical gap-s border-t is-hover">



            <div className={`is-flex vertical px-m  ${visible?"":"cusor-ban"}` }>

                <div className="is-flex p-s gap-s bg-hover-light rounded-m align-center">
                    <div  className=" size-x-m-x2  text-xs ">Style</div>
                    {styles.map((item, index) => {
                        return <div title={item.style}
                                    key={index}
                                    onClick={() => handleSetCusStyle(item.id)}
                                    className={`  size-xl btn btn-s ${cusStyle === item.id ? "btn-outline btn-primary " : "btn-ghost"}   rounded-s is-center `}>
                            <DuckIcon className={`text-xl  ${cusStyle === item.id ? "text-primary " : "text-sliver"} `}
                                      icon={item.icon}></DuckIcon>
                        </div>
                    })}


                </div>
                <div className="is-flex p-s bg-hover-light rounded-m align-center">
                    <div className=" size-x-m-x2  text-xs ">Color</div>
                    <div className="is-flex align-end gap-m pl-m">
                        {colors.map((item, index) => {
                            return <div
                                key={index}
                                onClick={() => handleSetColor(item.id)}
                                className={`customs-style-2 ${color === item.id ? "active" : ""} size-m ${colors[index].color}`}></div>
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
}

export default CustomDocs;