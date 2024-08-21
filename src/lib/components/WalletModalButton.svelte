<script lang="ts">
	import type { ButtonProps } from '../button';
	import BaseWalletConnectionButton from './Button.svelte';
	import { useWalletModal } from '../useWalletModal.svelte.js';

	let { children, onclick, ...props }: ButtonProps = $props();

	let modal = useWalletModal();
</script>

<BaseWalletConnectionButton
	{...props}
	className="wallet-adapter-button-trigger"
	onclick={(e) => {
		if (onclick) {
			onclick(e);
		}
		if (e.defaultPrevented) {
			modal.visible = !modal.visible;
		}
	}}
>
	{children}
</BaseWalletConnectionButton>
