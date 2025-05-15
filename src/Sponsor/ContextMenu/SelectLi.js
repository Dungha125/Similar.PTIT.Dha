import React from 'react';
import DuckIcon from "duckicon";

function SelectLi({item}) {
    return (
            <div onClick={item.action} className="select-item bg-hover-light p-s is-flex gap-m text-mute">
                {item.icon&&  <DuckIcon icon={item.icon} className={"text-xl "}/>}
            <p>
                {item.actionName}
            </p>
        </div>
    );
}

export default SelectLi;