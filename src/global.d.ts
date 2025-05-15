declare module 'react-pdf-highlighter' {
    import * as React from 'react';

    // Example type for position and content based on common highlighting needs
    export interface Position {
        boundingRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
        };
        rects: Array<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
        }>;
        pageNumber: number;
    }

    export interface Content {
        text?: string;
        image?: string;
    }

    export interface Comment {
        text: string;
        emoji: string;
    }

    export interface IHighlight {
        id: string;
        position: Position;
        content: Content;
        comment: Comment;
    }

    export interface PdfLoaderProps {
        url: string;
        beforeLoad?: React.ReactNode;
        children: (pdfDocument: any) => React.ReactNode;
    }

    export class PdfLoader extends React.Component<PdfLoaderProps> {}

    export interface PdfHighlighterProps {
        pdfDocument: any;
        enableAreaSelection?: (event: MouseEvent) => boolean;
        onScrollChange?: () => void;
        scrollRef?: (scrollTo: (highlight: IHighlight) => void) => void;
        onSelectionFinished?: (
            position: Position,
            content: Content,
            hideTipAndSelection: () => void,
            transformSelection: () => void
        ) => React.ReactNode;
        highlightTransform?: (
            highlight: IHighlight,
            index: number,
            setTip: (
                highlight: IHighlight,
                callback: (highlight: IHighlight) => React.ReactNode
            ) => void,
            hideTip: () => void,
            viewportToScaled: (rect: any) => any,
            screenshot: (rect: any) => string,
            isScrolledTo: boolean
        ) => React.ReactNode;
        highlights: IHighlight[];
    }

    export class PdfHighlighter extends React.Component<PdfHighlighterProps> {}

    export interface HighlightProps {
        isScrolledTo: boolean;
        position: Position;
        comment: Comment;
    }

    export class Highlight extends React.Component<HighlightProps> {}

    export interface PopupProps {
        popupContent: React.ReactNode;
        onMouseOver: (popupContent: React.ReactNode) => void;
        onMouseOut: () => void;
        children: React.ReactNode;
    }

    export class Popup extends React.Component<PopupProps> {}

    export interface TipProps {
        onOpen: () => void;
        onConfirm: (comment: Comment) => void;
    }

    export class Tip extends React.Component<TipProps> {}

    export class AreaHighlight extends React.Component<any> {}
}
