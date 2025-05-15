import React from 'react';
import {Position, Comment} from 'react-pdf-highlighter';

interface CustomHighlightProps {
    isScrolledTo: boolean;
    position: Position;
    comment: Comment;
}

const CustomHighlight: React.FC<CustomHighlightProps> = ({
                                                             isScrolledTo,
                                                             position,
                                                             comment,
                                                         }) => {
    // Ví dụ: Tùy chỉnh style cho highlight
    const style = {
        position: 'absolute' as const,
        backgroundColor: isScrolledTo ? 'lightblue' : 'lightyellow',
        borderRadius: '4px',
        top: `${position.boundingRect.y1}px`,
        left: `${position.boundingRect.x1}px`,
        width: `${position.boundingRect.width}px`,
        height: `${position.boundingRect.height}px`,
        pointerEvents: 'none' as const, // Đảm bảo không ảnh hưởng đến tương tác người dùng
    };
    console.log(     isScrolledTo,
        position,
        comment,)
    return (
        <div style={style} title={comment.text}>
            {comment.emoji} {/* Ví dụ: hiển thị emoji nếu có */}
        </div>
    );
};

export default CustomHighlight;
