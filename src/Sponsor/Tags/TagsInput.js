import React, { useEffect, useRef, useState } from "react";
import SelectLi from "../ContextMenu/SelectLi";
import { useContextMenu } from "../ContextMenu/ContextMenuProvider";

const TagsInput = ({
                       data,
                       onInputValueChange,
                       renderActionName,
                       handleItemAction,
                       onClear,
                       children,
                   }) => {
    const { showMenu, hideMenu } = useContextMenu();
    const inputRef = useRef(null);
    const spanRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    useEffect(() => {
        if (onClear) {
            clearInput();
        }
    }, [onClear]);

    const handleInputChange = (e) => {
        const value = e.target.textContent.trim();
        setInputValue(value);
        onInputValueChange(value);

        if (value.length >= 2 && data?.length) {
            const filteredData = data.filter(
                (item) =>
                    item.code.toLowerCase().includes(value.toLowerCase()) ||
                    item.name.toLowerCase().includes(value.toLowerCase())
            );

            showMenu(
                inputRef,
                filteredData.length > 0
                    ? filteredData.map((item, index) => (
                        <SelectLi
                            key={index}
                            item={{
                                actionName: renderActionName(item),
                                action: () => handleSelect(item),
                            }}
                        />
                    ))
                    : [<p key="no-data" className="px-2 py-1 text-gray-500">Không có dữ liệu</p>]
            );
        } else {
            // Nếu input rỗng, vẫn hiển thị "Không có dữ liệu"
            showMenu(
                inputRef,
                <p className="px-2 py-1 text-gray-500">Không có dữ liệu</p>
            );
        }
    };

    // Hàm xử lý khi chọn item
    const handleSelect = (item) => {
        handleItemAction(item);
        clearInput();
        hideMenu();
    };

    // Hàm clear input
    const clearInput = () => {
        setInputValue("");
        if (spanRef.current) {
            spanRef.current.textContent = "";
            spanRef.current.focus();
        }
        // Hiển thị lại "Không có dữ liệu" khi clear input
        showMenu(
            inputRef,
            <p className="px-2 py-1 text-gray-500">Không có dữ liệu</p>
        );
    };

    return (
        <div
            ref={inputRef}
            onClick={() => spanRef.current.focus()}
            className={"border rounded-s is-flex align-center wrap bg-light"}
        >
            {children}
            <span
                style={{ minWidth: "140px" }}
                ref={spanRef}
                data-ph="Nhập từ khóa"
                className={"py-s px-s is-grow tag-editable"}
                onInput={handleInputChange}
                contentEditable={true}
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

export default TagsInput;
