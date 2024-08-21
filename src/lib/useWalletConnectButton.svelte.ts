import { useSolana, type WalletContext, type Wallet } from '@bewinxed/wallet-adapter-svelte';
import type { SolanaProvider } from '@bewinxed/wallet-adapter-svelte/dist/useSolana.svelte';

type ButtonState = {
	buttonDisabled: boolean;
	buttonState: 'connecting' | 'connected' | 'has-wallet' | 'no-wallet';
	onButtonClick?: () => void;
	walletIcon?: Wallet['adapter']['icon'];
	walletName?: Wallet['adapter']['name'];
};

class WalletConnectButton implements ButtonState {
	solana: SolanaProvider = $derived(useSolana());
	context: WalletContext = $derived(this.solana.context);

	buttonState: 'connecting' | 'connected' | 'has-wallet' | 'no-wallet' = $derived.by(() => {
		const { connected, connecting, wallet } = this.context;
		if (!wallet) {
			return 'no-wallet';
		}
		let buttonState: ButtonState['buttonState'];
		if (connecting) {
			buttonState = 'connecting';
		} else if (connected) {
			buttonState = 'connected';
		} else if (wallet) {
			buttonState = 'has-wallet';
		} else {
			buttonState = 'no-wallet';
		}
		return buttonState;
	});
	buttonDisabled = $derived(this.buttonState !== 'has-wallet');
	onButtonClick?;
	walletIcon?: Wallet['adapter']['icon'] = $derived(this.context.wallet?.adapter.icon);
	walletName?: Wallet['adapter']['name'] = $derived(this.context.wallet?.adapter.name);

	constructor() {
		const onButtonClick = $derived(() =>
			!this.context.wallet
				? undefined
				: this.buttonState === 'has-wallet'
					? this.context.wallet.connect().catch(() => {
							// Silently catch because any errors are caught by the context `onError` handler
						})
					: undefined
		);
		this.onButtonClick = onButtonClick;
	}
}

export function useWalletConnectButton(): ButtonState {
	return new WalletConnectButton();
}
