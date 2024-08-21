export type CSSProperties = {
    [key in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[key];
};
export declare function useStyles(node: HTMLElement, styles: CSSProperties): void;
