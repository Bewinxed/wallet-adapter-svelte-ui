import { getContext, hasContext, setContext } from 'svelte';

export interface WalletModalContextState {
	visible: boolean;
	setVisible: (open: boolean) => void;
}

function constructMissingProviderErrorMessage(action: string, valueName: string) {
	return `You have tried to  ${action} "${valueName}" on a WalletModalContext without providing one. Make sure to render a WalletModalProvider as an ancestor of the component that uses WalletModalContext`;
}

export const WALLET_MODAL_CONTEXT_KEY = Symbol();

class WalletModal {
	visible = $state(false);

	constructor() {
		this.visible = false;
	}
}

export function setWalletModalContext() {
	setContext(WALLET_MODAL_CONTEXT_KEY, new WalletModal());
}

export function useWalletModal() {
	if (!hasContext(WALLET_MODAL_CONTEXT_KEY)) {
		throw new Error(constructMissingProviderErrorMessage('use', 'WalletModal'));
	}
	const context = $derived(getContext<WalletModal>(WALLET_MODAL_CONTEXT_KEY));

	if (!context) {
		console.error(constructMissingProviderErrorMessage('use', 'WalletModal'));
		return {
			get visible() {
				console.error(constructMissingProviderErrorMessage('read', 'visible'));
				return context;
			},
			set visible(visibility) {
				console.error(constructMissingProviderErrorMessage('set', 'visible'));
			}
		};
	}

	return context;
}
