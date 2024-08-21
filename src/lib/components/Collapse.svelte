<script lang="ts">
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		class: className,
		expanded,
		id,
		children
	}: {
		class?: string;
		expanded: boolean;
		id: string;
		children: Snippet;
	} = $props();

	let ref = $state<HTMLDivElement>();

	let instant = $state(false);
</script>

{#if expanded}
	<div
		class="wallet-adapter-collapse {className}"
		{id}
		bind:this={ref}
		role="region"
		transition:slide={{ axis: 'y', duration: instant ? 0 : 250 }}
	>
		{@render children()}
	</div>
{/if}

<style>
	.wallet-adapter-collapse {
		transition-timing-function: ease-out;
	}
</style>
