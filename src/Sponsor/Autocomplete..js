import React, {useEffect, useRef, useState} from "react";
import {useContextMenu} from "./ContextMenu/ContextMenuProvider";
import DuckIcon from "duckicon";
import SelectLi from "./ContextMenu/SelectLi";

const Autocomplete = ({
                          options,
                          placeholder = "Tìm kiếm...",
                          multiple = false,
                          defaultValue = multiple ? [] : "",
                          onSelect,
                      }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState(
        Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    );
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const { showMenu, hideMenu } = useContextMenu();

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                hideMenu();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [hideMenu]);

    useEffect(() => {
        if (onSelect) onSelect(multiple ? selectedOptions : selectedOptions[0]);
    }, [selectedOptions, multiple, onSelect]);

    const handleSelect = (option) => {
        if (multiple) {
            if (!selectedOptions.some((item) => item.id === option.id)) {
                const newSelectedOptions = [...selectedOptions, option];
                setSelectedOptions(newSelectedOptions);
            }
        } else {
            setSelectedOptions([option]);
            setIsOpen(false);
            setSearchTerm("");
        }
    };

    const handleRemove = (optionId) => {
        const newSelectedOptions = selectedOptions.filter((item) => item.id !== optionId);
        setSelectedOptions(newSelectedOptions);
    };
    const filteredOptions = options?.filter((option) =>
        option.name.toLowerCase().includes(searchTerm?.toLowerCase())
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
        showMenu(inputRef, (
            filteredOptions.map((item, index) => (
              <>
                  <SelectLi
                      key={index}
                      item={{
                          actionName: (item.name),
                          action: () => {
                              handleSelect(item)
                              console.log(item)
                              // inputRef.current.textContent = '';
                          }
                      }}
                  />
              </>

            ))
        ));
    };

    return (
        <div className="relative w-64" ref={dropdownRef}>
            <div className="absolute z-10 bg-white shadow w-full mt-1">
                <div
                    className="is-flex align-center wrap bg-light"
                    onClick={() => inputRef.current.focus()}
                >
                    {multiple && selectedOptions.map((option,index) => (
                        <span onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(option.id);
                        }} className="tag pr-x my-s mx-xs" key={index}>
                    {option.name}
                            <div
                                className="bg-hover-primary-light pr-xs rounded"
                                style={{marginLeft: '5px'}}
                            >
                        <DuckIcon icon="close"/>
                    </div>
                </span>
                    ))}

                    {!multiple && selectedOptions[0] && (
                        <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2 mb-1">
                            {selectedOptions[0].name}
                            <button
                                type="button"
                                className="ml-1 text-sm font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(selectedOptions[0].id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <input

                        type="text"
                        ref={inputRef}
                        className="py-m px-s is-grow"
                        placeholder={selectedOptions.length === 0 ? placeholder : ""}
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                {
                    isOpen && <div className=" overflow-y-auto p-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.id}
                                    className={`select-item bg-hover-light p-s is-flex gap-m text-mute ${
                                        selectedOptions.includes(option) ? "bg-blue-100" : ""
                                    }`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.name}
                                </li>
                            ))
                        ) : (
                            <span className="p-2 text-gray-500">No options found</span>
                        )}
                    </div>
                }

            </div>

        </div>
    );
};

export default Autocomplete;