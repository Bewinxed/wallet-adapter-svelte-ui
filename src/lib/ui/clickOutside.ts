import type { Action, ActionReturn } from 'svelte/action';

/** Dispatch event on click outside of node */
export function clickOutside<T extends HTMLElement>(
	node: HTMLElement
): ActionReturn<
	undefined,
	{
		onclickoutside?: Action<T>;
	}
> {
	const handleClick = (event: MouseEvent): void => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickoutside', { detail: node }));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
