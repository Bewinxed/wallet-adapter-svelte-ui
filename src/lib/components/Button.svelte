<script lang="ts">
	import type { ButtonProps } from '$lib/button';
	import type { Snippet } from 'svelte';
	import WalletIcon from './WalletIcon.svelte';
	import { slide } from 'svelte/transition';

	let {
		headless,
		class: className,
		disabled,
		endIcon,
		onclick,
		startIcon,
		style,
		flat,
		tabIndex,
		children,
		square,
		...props
	}: ButtonProps = $props();
</script>

{#snippet icon(snippet: Snippet | string, className: string)}
	{#if typeof snippet === 'string'}
		<div
			style:box-shadow="var(--chin-shadow)"
			transition:slide={{ axis: 'x' }}
			class="p-0.5 rounded-lg w-[1.25lh] aspect-square"
		>
			<i class={className}>
				<WalletIcon wallet={{ adapter: { icon: snippet, name: '' } }} />
			</i>
		</div>
	{:else}
		{@render snippet()}
	{/if}
{/snippet}

<button
	{...props}
	class:shadow-sm={!flat}
	class:hover:shadow-md={!flat}
	class:disabled
	class:rounded-lg={!square}
	class:border-opacity-25={disabled}
	class="{className} {headless
		? ''
		: `flex p-1.5 gap-2 place-content-center font-semibold place-items-center min-w-36  border transition-[box-shadow,background-opacity,scale] duration-200   ease-in-out ${disabled ? '' : 'active:shadow-none active:scale-95 active:bg-opacity-100 hover:bg-opacity-90 hover:border-gray-400'} `} "
	{disabled}
	{onclick}
	tabindex={tabIndex}
	type="button"
>
	{#if startIcon}
		{@render icon(startIcon, 'wallet-adapter-button-start-icon')}
	{/if}
	{#if children}
		{@render children()}
	{/if}
	{#if endIcon}
		{@render icon(endIcon, 'wallet-adapter-button-end-icon')}
	{/if}
</button>
