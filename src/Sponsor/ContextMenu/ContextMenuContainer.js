// Component ContextContainer
import {useEffect} from "react";
import ReactDOM from "react-dom";

const ContextContainer = ({ menus, currentMenuIndex, hideMenu }) => {
    if (currentMenuIndex === null || !menus[currentMenuIndex]) {
        return null; // Không hiển thị nếu không có menu nào đang chọn
    }
    // Click Outside
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".context-menu") ) {
                hideMenu();
                console.log("click outside")
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[]);

    const { position, content ,size} = menus[currentMenuIndex];

    return ReactDOM.createPortal(
        <div className={"Duck"}>
            <div className="is-absolute" style={{top:0,left:0}}>
                <div className="select-list active context-menu is-overflow" id={"modal-root"}
                     style={{
                         top: position.top,
                         left: position.left,
                         width: size.width,
                         maxHeight: size.height,
                         overflow: "auto",
                         transform: "translate(-100%, 4px)",
                         zIndex: 99999,
                     }}
                     onClick={hideMenu}
                >
                    {content}
                </div>
            </div>
        </div>
        ,
        document.body
    )
};
export default ContextContainer;