<script lang="ts">
	import type { ButtonProps } from '$lib/button';
	import { useWalletDisconnectButton } from '../useWalletDisconnectButton.svelte.js';
	import Button from './Button.svelte';

	const {
		className,
		endIcon,
		onclick,
		startIcon,
		style,
		tabIndex,
		children,
		...props
	}: ButtonProps = $props();

	const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } = $derived(
		useWalletDisconnectButton()
	);

	const labels = {
		disconnecting: 'Disconnecting ...',
		'has-wallet': 'Disconnect',
		'no-wallet': 'Disconnect Wallet'
	} as const;
</script>

<Button
	{...props}
	class="wallet-adapter-button-trigger {buttonState === 'disconnected'
		? 'disconnected'
		: ''} {className}"
	disabled={buttonDisabled}
	onclick={onButtonClick}
	startIcon={walletIcon}
>
	{#if children}
		{@render children()}
	{:else}
		{labels[buttonState]}
	{/if}
</Button>
