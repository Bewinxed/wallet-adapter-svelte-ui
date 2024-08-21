import type { Action, ActionReturn } from 'svelte/action';

/** Dispatch event on click outside of node */
export function dialogOpen<T extends HTMLDialogElement>(
	node: T
): ActionReturn<
	undefined,
	{
		onopen?: Action<T>;
	}
> {
	// observer if the dialog is open
	const observer = new MutationObserver((mutations) => {
		for (const { attributeName, target } of mutations) {
			if (attributeName === 'open' && target === node) {
				if (node.open) {
					node.dispatchEvent(new CustomEvent('open', { detail: node }));
				}
			}
		}
	});

	observer.observe(node, {
		attributes: true,
		attributeFilter: ['open']
	});

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

export function dialogEsc<T extends HTMLDialogElement>(node: T): ActionReturn<undefined> {
	const listener = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			node.dispatchEvent(new CustomEvent('close', { detail: node, bubbles: true }));
		}
	};
	window.addEventListener('keydown', listener);

	return {
		destroy() {
			window.removeEventListener('keydown', listener);
		}
	};
}
