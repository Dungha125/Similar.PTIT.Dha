import React, { useCallback, useEffect, useRef, useState } from 'react';
import DuckIcon from 'duckicon';
import { useSuggestUserQuery } from '../services/user';
import SelectLi from './ContextMenu/SelectLi';
import { useContextMenu } from './ContextMenu/ContextMenuProvider';

const TagsInput = ({ onTagsChange, onClear }) => {
    const branchID = '956a310a-0df0-4b99-956c-8d3edd9d8c88';
    const [tags, setTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { data: suggestData, isFetching: suggestFetching, isLoading: suggestLoading } = useSuggestUserQuery(
        { branchID, username: inputValue },
        { skip: inputValue.length < 2 }
    );
    const { showMenu, hideMenu } = useContextMenu();
    const [menuContent, setMenuContent] = useState(null);
    const inputRef = useRef(null);
    const valueRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
    };

    useEffect(() => {
        if (suggestData?.length) {
            setSuggestedTags(suggestData);
        } else {
            setSuggestedTags([]);
        }
    }, [suggestData]);

    useEffect(() => {
        setTags([]);
        hideMenu();
    }, [onClear]);

    const handleAddTag = useCallback((tag) => {
        if (tag && !tags.some((t) => t.tag === tag)) {
            const newTags = [...tags, { tag }];
            setTags(newTags);
            onTagsChange(newTags);
        }
        setInputValue('');
        setSuggestedTags([]);
    }, [tags, onTagsChange]);

    const handleRemoveTag = useCallback((tag) => {
        const newTags = tags.filter((t) => t.tag !== tag);
        setTags(newTags);
        onTagsChange(newTags);
    }, [tags, onTagsChange]);

    const [addNewsMenu, setAddNewsMenu] = useState([]);

    useEffect(() => {
        const cateMenu = suggestedTags.length === 0
            ? [{ actionName: 'Không tìm thấy user', action: () => {} }]
            : suggestedTags.map((suggestTag) => ({
                actionName: suggestTag.username,
                action: () => handleAddTag(suggestTag.id),
            }));
        setAddNewsMenu(cateMenu);
    }, [suggestedTags, handleAddTag]);

    // Cập nhật nội dung của menu
    useEffect(() => {
        const content = (
            <>
                <div className="field">
                    <input
                        ref={valueRef}
                        type="text"
                        className="ignore-click"
                        onChange={handleInputChange}
                        onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng menu khi click vào input
                        placeholder="Tìm kiếm người dùng"
                    />
                </div>
                {(!suggestFetching || !suggestLoading) && (
                    <div className="select-list active">
                        {addNewsMenu.map((item, index) => (
                            <SelectLi key={index} item={item} />
                        ))}
                    </div>
                )}
            </>
        );
        setMenuContent(content);

        if (inputRef.current) {
            hideMenu(); // Đóng menu trước đó
            showMenu(inputRef, content); // Hiển thị lại với nội dung mới
        }
    }, [addNewsMenu, inputValue, suggestFetching, suggestLoading]);

    return (
        <div>
            <div className="field">
                <div ref={inputRef} onClick={() => showMenu(inputRef, menuContent)} className="select">
                    <div className="select-input">
                        {tags.length ? tags.map((tag, index) => (
                            <span className="tag pr-x" key={index}>
                                {tag.tag}
                                <div
                                    className="bg-hover-primary-light pr-xs rounded-xs"
                                    onClick={() => handleRemoveTag(tag.tag)}
                                    style={{ marginLeft: '5px' }}
                                >
                                    <DuckIcon icon="close" />
                                </div>
                            </span>
                        )) : <div className="text-disable">Chọn người dùng</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TagsInput);
