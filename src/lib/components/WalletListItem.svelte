<script lang="ts">
	import { WalletReadyState } from '@solana/wallet-adapter-base';
	import type { Wallet } from '@bewinxed/wallet-adapter-svelte';
	import WalletIcon from './WalletIcon.svelte';
	import Button from './Button.svelte';
	import { createRawSnippet } from 'svelte';

	// biome-ignore lint/style/useConst: <explanation>
	let {
		onclick,
		tabIndex,
		wallet
	}: {
		onclick: () => void;
		tabIndex?: number;
		wallet: Wallet;
	} = $props();
</script>

<Button {onclick} {tabIndex}>
	{#snippet startIcon()}
		<div
			style:box-shadow="var(--chin-shadow)"
			class="relative aspect-square w-14 rounded-lg transition-all sm:w-12"
		>
			<WalletIcon class="mix-blend-multiply" {wallet} />
		</div>
	{/snippet}
	<span class="w-full text-left font-semibold capitalize">
		{wallet.adapter.name}
	</span>
	{#if wallet.readyState === 'Installed'}
		<!-- <span class="text-xs text-green-700 capitalize">detected</span> -->
		<div class="relative flex h-5 w-5">
			<!-- icon that pings -->
			<span class="absolute h-5 w-5 animate-ping rounded-full bg-green-400 opacity-75"></span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="inline-flex aspect-square rounded-full bg-green-500 text-white"
			>
				<g fill="none">
					<path
						d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
					/>
					<path
						fill="currentColor"
						d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m3.535 4.381a1 1 0 0 1 1.498 1.32l-.083.094l-5.586 5.587a1.1 1.1 0 0 1-1.46.085l-.096-.085l-2.758-2.758a1 1 0 0 1 1.32-1.498l.094.084l2.122 2.121l4.95-4.95Z"
					/>
				</g>
			</svg>
		</div>
	{/if}
</Button>
