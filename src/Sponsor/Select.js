import React, { useEffect, useRef, useState } from 'react';
import DuckIcon from "duckicon";
import { useContextMenu } from "./ContextMenu/ContextMenuProvider";

function DuckSelect({ data = [], placeholder, child, onSelect, value, disable = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value || null);
    const selectRef = useRef(null);
    const { showMenu } = useContextMenu();

    const handleSelect = (item) => {
        setIsOpen(false);
        setSelected(item);
        onSelect && onSelect(item);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggleMenu = () => {
        if (disable || data.length <= 1) return; // Không mở menu nếu bị vô hiệu hóa hoặc không đủ dữ liệu
        setIsOpen((prev) => !prev);
        showMenu(
            selectRef,
            <div className="select-list active">
                {data.map((item, index) => (
                    <div key={index} className="select-item" onClick={() => handleSelect(item)}>
                        <div className="is-flex jt-between align-center bg-hover-light">
                            {child({ item, index })}
                            {item === selected && <div className="text-xl icon icon-check">ě</div>}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`select ${disable ? 'select--disabled' : ''}`} ref={selectRef}>
            <div
                onClick={handleToggleMenu}
                className={`select-input ${disable ? 'select-input--disabled' : ''}`}
            >
                <div className={`${!selected && placeholder ? 'select-title placeholder' : 'select-title'}`}>
                    {selected ? child({ item: selected }) : placeholder}
                </div>
                <DuckIcon className="text-l text-disable" icon={`up-direction ${isOpen ? "" : "rotate-180"}`} />
            </div>
        </div>
    );
}

export default DuckSelect;