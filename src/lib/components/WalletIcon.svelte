<script lang="ts">
	import type { Wallet } from '@bewinxed/wallet-adapter-svelte';
	import type { Snippet } from 'svelte';
	const {
		class: className,
		wallet
	}: {
		class?: string;
		wallet: {
			adapter: {
				icon: Snippet | string;
				name: string;
			};
		};
	} = $props();
</script>

{#if wallet}
	{#if typeof wallet.adapter.icon === 'string'}
		<img
			class="drop-shadow-sm {className}"
			src={wallet.adapter.icon}
			alt={`${wallet.adapter.name} icon`}
		/>
	{:else if className}
		<div class={className}>
			{@render wallet.adapter.icon()}
		</div>
	{:else}
		{@render wallet.adapter.icon()}
	{/if}
{/if}
