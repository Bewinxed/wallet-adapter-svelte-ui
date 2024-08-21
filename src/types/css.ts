export type CSSProperties = {
	[key in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[key];
};

export function useStyles(node: HTMLElement, styles: CSSProperties) {
	for (const [key, value] of Object.entries(styles) as [string, string][]) {
		node.style.setProperty(key, value);
	}
}
