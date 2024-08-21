<script lang="ts">
	import type { ButtonProps } from '../button';
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import { slide } from 'svelte/transition';
	import WalletIcon from './WalletIcon.svelte';

	let {
		walletIcon,
		walletName,
		class: className,
		...props
	}: ButtonProps & {
		walletIcon?: Snippet | string;
		walletName?: string;
	} = $props();
</script>

<Button {...props} class="wallet-adapter-button-trigger {className}">
	{#snippet startIcon()}
		{#if walletIcon}
			<div
				style:box-shadow="var(--chin-shadow)"
				transition:slide={{ axis: 'x' }}
				class="p-0.5 rounded-lg w-8 aspect-square"
			>
				<i class="wallet-adapter-button-start-icon">
					<WalletIcon wallet={{ adapter: { icon: walletIcon, name: '' } }} />
				</i>
			</div>
		{/if}
	{/snippet}
</Button>
