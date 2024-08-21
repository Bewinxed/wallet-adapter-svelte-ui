import { type Wallet, useSolana } from '@bewinxed/wallet-adapter-svelte';
import type { PublicKey } from '@solana/web3.js';
import { getContext, hasContext, setContext } from 'svelte';

type ButtonState = {
	buttonState: 'connecting' | 'connected' | 'disconnecting' | 'has-wallet' | 'no-wallet';
	onconnect?: (publicKey: PublicKey) => void;
	ondisconnect?: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onselectwallet?: (...args: any[]) => void;
	publicKey?: PublicKey | null;
	walletIcon?: string;
	walletName?: Wallet['adapter']['name'];
};

type Config = {
	onselectwallet: (config: {
		onselectwallet: (walletName: Wallet['adapter']['name']) => void;
		wallets: Wallet[];
	}) => void;
};

class WalletMultiButton implements ButtonState {
	context = $derived(useSolana().context);
	wallet = $derived(this.context.wallet);
	readonly buttonState = $derived.by<
		'connecting' | 'connected' | 'disconnecting' | 'has-wallet' | 'no-wallet'
	>(() => {
		if (!this.wallet) {
			return 'no-wallet';
		}
		switch (this.wallet.status) {
			case 'connecting':
				return 'connecting';
			case 'connected':
				return 'connected';
			case 'disconnecting':
				return 'disconnecting';
			case 'disconnected':
				return 'has-wallet';
			default:
				return 'no-wallet';
		}
	});

	// let buttonDisabled = $derived(buttonState !== 'has-wallet');
	readonly walletIcon = $derived(this.wallet?.adapter.icon);
	readonly walletName = $derived(this.wallet?.adapter.name);

	readonly onconnect?: (publicKey: PublicKey) => void = $derived(() =>
		this.buttonState === 'has-wallet'
			? this.wallet?.connect().catch(() => {
					// Silently catch because any errors are caught by the context `onError` handler
				})
			: undefined
	);
	readonly ondisconnect?: () => void = $derived(() =>
		this.buttonState === 'has-wallet'
			? this.wallet?.disconnect().catch(() => {
					// Silently catch because any errors are caught by the context `onError` handler
				})
			: undefined
	);
	onselectwallet = $state<Config['onselectwallet']>();

	constructor({ onselectwallet: onSelectWallet }: Config) {
		this.onselectwallet = () =>
			onSelectWallet({ onselectwallet: this.context.select, wallets: this.context.wallets });
	}
}

// function logMissingProviderError(action: string, property: string) {
// 	const error = new Error(
// 		`You have tried to ${action} "${property}" on a WalletContext without providing one. Make sure to render a WalletProvider as an ancestor of the component that uses WalletContext.`
// 	);
// 	console.error(error);
// 	return error;
// }

const WALLET_MULTI_BUTTON_CONTEXT_KEY = Symbol('wallet-multi-button');

export function setWalletMutliButtonContext({ onselectwallet: onSelectWallet }: Config) {
	return setContext(
		WALLET_MULTI_BUTTON_CONTEXT_KEY,
		new WalletMultiButton({ onselectwallet: onSelectWallet })
	);
}

export function useWalletMultiButton() {
	if (!hasContext(WALLET_MULTI_BUTTON_CONTEXT_KEY)) {
		throw new Error('useWalletMultiButton must be used within a WalletMultiButton');
	}

	const button = $derived(getContext<WalletMultiButton>(WALLET_MULTI_BUTTON_CONTEXT_KEY));

	return button;
}
