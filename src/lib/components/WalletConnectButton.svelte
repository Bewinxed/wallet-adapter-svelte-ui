<script lang="ts">
	import type { ButtonProps } from '$lib/button';
	import { useWalletConnectButton } from '../useWalletConnectButton.svelte.js';
	import Button from './Button.svelte';

	const { className, disabled, endIcon, startIcon, children, ...props }: ButtonProps = $props();

	const { buttonDisabled, buttonState, onButtonClick, walletIcon, walletName } =
		$derived(useWalletConnectButton());
	const labels = {
		connecting: 'Connecting ...',
		connected: 'Connected',
		'has-wallet': 'Connect',
		'no-wallet': 'Connect Wallet'
	} as const;
</script>

<Button
	{...props}
	class="wallet-adapter-button-trigger {buttonState === 'connected' ? 'connected' : ''} {className}"
	disabled={disabled || buttonDisabled}
	onclick={onButtonClick}
	startIcon={walletIcon}
>
	{#if children}
		{@render children()}
	{:else}
		{labels[buttonState]}
	{/if}
</Button>
