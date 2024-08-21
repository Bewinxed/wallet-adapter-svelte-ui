<script lang="ts">
	// import '../app.css';
	import { type ComponentProps, type Snippet } from 'svelte';
	import { setWalletModalContext, useWalletModal } from '../useWalletModal.svelte.js';
	import WalletModal from './WalletModal.svelte';

	let { children, ...props }: { children: Snippet } & ComponentProps<typeof WalletModal> =
		$props();

	setWalletModalContext();
	let modal = useWalletModal();
</script>

{#if modal.visible}
	<WalletModal  {...props} />
{/if}
{@render children()}

<style>
	:root {
		--chin-shadow: 0 8px 24px rgba(18, 7, 143, 0.04), 0 1px 2px rgba(14, 9, 72, 0.08),
			0 0 0 1px rgba(14, 9, 72, 0.04), inset 0 0 3px rgba(19, 39, 108, 0.04),
			inset 0 -4px 1px rgba(19, 39, 109, 0.1);

		--solana-primary: var(--solana-primary, rgb(94, 64, 157));
		--solana-primary-light: var(--solana-primary-light, rgb(139, 126, 200));
		--solana-secondary: var(--solana-secondary, rgba(64, 157, 114));
		--solana-secondary-light: var(--solana-secondary-light, rgb(126, 200, 139));
		--solana-accent: var(--solana-accent, rgb(94, 64, 157));
		--solana-accent-light: var(--solana-accent-light, rgb(139, 126, 200));
		--solana-backdrop: var(--solana-backdrop, rgb(16, 15, 15));
		--solana-background: var(--solana-background, rgb(250, 249, 246));
	}
</style>
