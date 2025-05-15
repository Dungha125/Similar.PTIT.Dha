import {createContext, useContext, useState} from "react";

const ContextMenuContext = createContext();

export const ContextMenuProvider = ({ children }) => {
    const [menus, setMenus] = useState([]);
    const [currentMenuIndex, setCurrentMenuIndex] = useState(null);

    // Hàm để hiển thị menu dưới button
    const showMenu = (buttonRef, content,width,height) => {

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const newMenu = {
                position: { top: rect.bottom, left: rect.right },
                size : {width : width| rect.width , height : 270| height},
                content: content,
            };
            setMenus([...menus, newMenu]);
            setCurrentMenuIndex(menus.length);
        }
    };

    // Hàm để ẩn menu
    const hideMenu = () => {
        setCurrentMenuIndex(null);
    };

    return (
        <ContextMenuContext.Provider
            value={{
                menus,
                currentMenuIndex,
                showMenu,
                hideMenu,
            }}
        >
            {children}
        </ContextMenuContext.Provider>
    );
};
export const useContextMenu = () => useContext(ContextMenuContext);