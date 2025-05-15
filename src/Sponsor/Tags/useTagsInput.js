import { useState, useEffect, useCallback, useRef } from 'react';

const useTagsInput = ({ fetchSuggestions, onTagsChange, onClear }) => {
    const [tags, setTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    // Fetch suggestions based on input value
    useEffect(() => {
        if (inputValue.length >= 2) {
            fetchSuggestions(inputValue).then(setSuggestedTags);
        } else {
            setSuggestedTags([]);
        }
    }, [inputValue, fetchSuggestions]);

    // Clear tags when `onClear` changes
    useEffect(() => {
        setTags([]);
    }, [onClear]);

    const handleInputChange = useCallback((value) => {
        setInputValue(value);
    }, []);

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

    return {
        tags,
        suggestedTags,
        inputValue,
        inputRef,
        handleInputChange,
        handleAddTag,
        handleRemoveTag,
    };
};

export default useTagsInput;
