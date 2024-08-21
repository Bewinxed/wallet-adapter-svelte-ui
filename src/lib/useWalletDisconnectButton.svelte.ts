import type { WalletContext } from '@bewinxed/wallet-adapter-svelte';
import { useSolana, type Wallet } from '@bewinxed/wallet-adapter-svelte';
import type { SolanaProvider } from '@bewinxed/wallet-adapter-svelte/dist/useSolana.svelte';

type ButtonState = {
	buttonDisabled: boolean;
	buttonState: 'disconnecting' | 'has-wallet' | 'no-wallet';
	onButtonClick?: () => void;
	walletIcon?: Wallet['adapter']['icon'];
	walletName?: Wallet['adapter']['name'];
};

class WalletDisconnectButton implements ButtonState {
	solana: SolanaProvider = $derived(useSolana());
	context: WalletContext = $derived(this.solana.context);
	buttonDisabled = $derived(!this.context.wallet);
	buttonState: 'disconnecting' | 'has-wallet' | 'no-wallet' = $derived.by(() => {
		const { disconnecting, wallet } = this.context;
		if (disconnecting) {
			return 'disconnecting';
		}
		if (wallet) {
			return 'has-wallet';
		}
		return 'no-wallet';
	});
	onButtonClick?: () => void;
	walletIcon?: Wallet['adapter']['icon'] = $derived(this.context.wallet?.adapter.icon);
	walletName?: Wallet['adapter']['name'] = $derived(this.context.wallet?.adapter.name);

	constructor() {
		const onButtonClick = $derived(() =>
			!this.context.wallet
				? undefined
				: this.buttonState === 'has-wallet'
					? this.context.wallet.disconnect().catch(() => {
							// Silently catch because any errors are caught by the context `onError` handler
						})
					: undefined
		);
		this.onButtonClick = onButtonClick;
	}
}

export function useWalletDisconnectButton(): ButtonState {
	return new WalletDisconnectButton();
}
