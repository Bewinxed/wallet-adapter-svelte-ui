<script lang="ts">
	import type { Wallet } from '@bewinxed/wallet-adapter-svelte';
	import { useSolana } from '@bewinxed/wallet-adapter-svelte';
	import { WalletReadyState } from '@solana/wallet-adapter-base';
	import { onMount } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import { dialogEsc, dialogOpen } from '../ui/dialogFixer';
	import { swipeToClose } from '../ui/swipeToClose';
	import { useBreakpoint } from '../ui/useBreakpoint.svelte';
	import { useWalletModal } from '../useWalletModal.svelte';
	import DigitalAssetIcon from './DigitalAssetIcon.svelte';
	import WalletListItem from './WalletListItem.svelte';

	let {
		onopen,
		onclose,
		class: className
	}: {
		/** Fires when the wallet select modal opens */
		onopen?: () => void;
		/** Fires when the wallet select modal closes */
		onclose?: () => void;
		class?: string;
	} = $props();

	let dialogEl = $state<HTMLDialogElement>();

	let { context } = useSolana();
	let { wallets, select } = $derived(context);

	let walletModal = useWalletModal();

	let expanded = $state(false);

	let { breakpoint } = $derived(useBreakpoint());

	let infoSectionExpanded = $state(breakpoint !== 'xs');

	const [listedWallets, collapsedWallets] = $derived.by(() => {
		const installed: Wallet[] = [];
		const notInstalled: Wallet[] = [];

		for (const wallet of wallets) {
			if (wallet.readyState === WalletReadyState.Installed) {
				installed.push(wallet);
			} else {
				notInstalled.push(wallet);
			}
		}

		return installed.length ? [installed, notInstalled] : [notInstalled, []];
	});

	onMount(() => {
		if (dialogEl && walletModal.visible) {
			dialogEl.showModal();
			dialogEl.style.height = `${dialogEl.getBoundingClientRect().height}px`;
		}
	});

	export function resizableModal(
		node: HTMLElement,
		options: {
			minHeight?: number;
			maxHeight?: number;
			initialHeight?: number;
			minDelta?: number;
		} = {}
	) {
		const {
			minDelta = 0,
			minHeight = 200,
			maxHeight = window.innerHeight,
			initialHeight = 300
		} = options;

		let touchStartY: number;
		let startHeight: number;
		let currentHeight: number;
		let rafId: number;

		const setModalHeight = (height: number) => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				const clampedHeight = Math.max(minHeight, Math.min(maxHeight, height));
				node.style.height = `${clampedHeight}px`;

				// Dispatch a custom event with the new height
				node.dispatchEvent(
					new CustomEvent('resize', {
						detail: { height: clampedHeight },
						bubbles: true
					})
				);
			});
		};

		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
			startHeight = node.getBoundingClientRect().height;
			currentHeight = startHeight;
			// node.style.transition = 'none';
		};

		const handleTouchMove = (e: TouchEvent) => {
			const currentY = e.touches[0].clientY;
			const deltaY = touchStartY - currentY;
			if (deltaY < minDelta) {
				return;
			}
			currentHeight = startHeight + deltaY;
			setModalHeight(currentHeight);
		};

		const handleTouchEnd = (e) => {
			// node.style.transition = 'height 0.3s ease-out';
			// if current cursor position didn't change much, ignore
			if (Math.abs(touchStartY - e.changedTouches[0].clientY) < minDelta) {
				return;
			}
			setModalHeight(currentHeight); // Snap to the nearest valid height
		};

		// Initialize the modal with the initial height
		setModalHeight(initialHeight);

		node.addEventListener('touchstart', handleTouchStart, { passive: true });
		node.addEventListener('touchmove', handleTouchMove, { passive: true });
		node.addEventListener('touchend', handleTouchEnd, { passive: true });

		return {
			destroy() {
				cancelAnimationFrame(rafId);
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', handleTouchEnd);
			},
			update(newOptions: Partial<typeof options>) {
				Object.assign(options, newOptions);
				setModalHeight(currentHeight); // Reapply constraints with new options
			}
		};
	}
</script>

{#snippet modalCloseButton()}
	<button
		onclick={() => (walletModal.visible = false)}
		class="wallet-adapter-modal-button-close rounded-full bg-gray-200 p-1 backdrop-blur"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
			<g fill="none" fill-rule="evenodd">
				<path
					d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
				/>
				<path
					fill="currentColor"
					d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
				/>
			</g>
		</svg>
	</button>
{/snippet}

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogEl}
	use:resizableModal={{ initialHeight: dialogEl?.getBoundingClientRect().height, minDelta: 30 }}
	use:swipeToClose
	use:dialogOpen
	use:dialogEsc
	{onopen}
	class:!min-h-[70vh]={infoSectionExpanded && breakpoint === 'xs'}
	aria-labelledby="wallet-adapter-modal-title"
	class="wallet-adapter-modal shadow-2xls bottom-0 top-auto m-0 mx-auto flex min-h-[50vh] w-screen max-w-[100vw] flex-1 rounded-xl p-0 transition-[height,min-height] duration-[250ms] ease-in-out sm:top-0 sm:my-auto sm:min-h-[50vh] sm:w-fit sm:min-w-[40rem] sm:max-w-lg sm:place-self-auto md:max-w-xl lg:max-w-2xl xl:max-w-3xl {className} h-min border sm:shadow-2xl"
	onmousedown={(e) => {
		if (e.target === e.currentTarget) {
			walletModal.visible = false;
		}
	}}
	onclose={() => {
		if (onclose) {
			onclose();
		}
		walletModal.visible = false;
	}}
	in:fly={{ y: 200, duration: 250, easing: sineInOut }}
	out:fly={{ y: 200, duration: 125, easing: sineInOut }}
>
	<div
		class="flex flex-1 flex-col divide-x-0 divide-y rounded-xl border sm:flex-row sm:divide-x sm:divide-y-0"
	>
		{#if wallets.length}
			<div
				class="wallet-adapter-modal-list-container mr-1 flex flex-1 grow flex-col overflow-y-auto p-2 px-6"
			>
				<div class="inline-flex items-center justify-between">
					<h1 class="wallet-adapter-modal-title py-2 text-lg font-semibold">
						Connect a wallet on Solana
					</h1>
					<div class="inline-flex sm:hidden">
						{@render modalCloseButton()}
					</div>
				</div>
				<ul class="wallet-adapter-modal-list flex flex-1 flex-col gap-2 pr-2">
					<li>
						<h2 class="text-sm font-semibold capitalize text-gray-700">installed</h2>
					</li>
					{#each listedWallets as wallet (wallet.adapter.name)}
						<li class="contents">
							<WalletListItem
								{wallet}
								onclick={() => {
									select(wallet.adapter.name);
									walletModal.visible = false;
								}}
							/>
						</li>
					{/each}
					{#if collapsedWallets.length}
						<li>
							<h2 class="text-sm font-semibold capitalize text-gray-700">popular</h2>
						</li>

						{#each collapsedWallets as wallet (wallet.adapter.name)}
							<li class="contents" class:animate-pulse={wallet.status === 'connecting'}>
								<WalletListItem
									{wallet}
									onclick={() => {
										select(wallet.adapter.name);
										walletModal.visible = false;
									}}
									tabIndex={expanded ? 0 : -1}
								/>
							</li>
						{/each}
					{/if}
				</ul>
			</div>
		{/if}
		<div class="grid flex-col gap-2 overflow-auto p-2 px-6 sm:flex-1">
			{#if !infoSectionExpanded}
				<div
					in:slide={{ axis: 'y', duration: 250, easing: sineInOut }}
					out:slide={{ axis: 'y', duration: 250, easing: sineInOut }}
					class="wallet-adapter-modal-container flex place-items-center justify-between"
				>
					<h1 class="wallet-adapter-modal-title font-semibold text-gray-700">New to Solana?</h1>
					<button
						class="group inline-flex items-center text-sm font-semibold capitalize hover:border-b"
						onclick={() => {
							infoSectionExpanded = true;
						}}
					>
						<figure class="w-4 rotate-180 transition-all group-hover:w-0">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<g fill="none" fill-rule="evenodd">
									<path
										d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
									/>
									<path
										fill="currentColor"
										d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"
									/>
								</g>
							</svg>
						</figure>
						learn more
						<figure class="w-0 rotate-180 transition-all group-hover:w-4">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<g fill="none" fill-rule="evenodd">
									<path
										d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
									/>
									<path
										fill="currentColor"
										d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"
									/>
								</g>
							</svg>
						</figure>
					</button>
				</div>
			{:else}
				<div
					class="flex-1 flex flex-col gap-4"
					in:slide={{ axis: 'y', duration: 250, easing: sineInOut }}
					out:slide={{ axis: 'y', duration: 250, easing: sineInOut }}
				>
					<div
						class="wallet-adapter-modal-container flex place-items-center content-center items-center
					justify-between"
					>
						{#if breakpoint === 'xs'}
							<button
								class="h-6 w-6"
								onclick={() => {
									infoSectionExpanded = false;
									dialogEl?.style.setProperty('min-height', '50vh');
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
									<g fill="none" fill-rule="evenodd">
										<path
											d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
										/>
										<path
											fill="currentColor"
											d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z"
										/>
									</g>
								</svg>
							</button>
						{/if}
						<div
							class="flex w-full place-content-center place-items-center gap-2 py-4 sm:py-0 justify-between"
						>
							<h1
								class="wallet-adapter-modal-title text-lg font-semibold w-full text-center sm:text-left sm:py-2"
							>
								What is a wallet?
							</h1>
							<div class="hidden sm:block">
								<button
									onclick={() => (walletModal.visible = false)}
									class="wallet-adapter-modal-button-close rounded-full bg-gray-200 p-1 backdrop-blur"
								>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
										<g fill="none" fill-rule="evenodd">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
											/>
										</g>
									</svg>
								</button>
							</div>
						</div>
					</div>
					<div class="flex flex-1 flex-col place-items-center justify-between sm:py-3">
						<div class="flex flex-col place-items-center gap-4">
							<div class="flex items-start gap-4">
								<DigitalAssetIcon />
								<div>
									<h3 class="text-sm font-semibold">A home for your digital assets</h3>
									<p class="text-sm text-gray-600">
										Wallets are used to send, receive, store, and display digital assets like
										Ethereum and NFTs.
									</p>
								</div>
							</div>
							<div class="flex items-center gap-4">
								<div style="box-shadow:var(--chin-shadow);" class="h-14 w-14 rounded-lg border p-1">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-11">
										<g fill="none">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="M18 2a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2H6v17h12zm-4 12a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2zM12 6a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"
											/>
										</g>
									</svg>
								</div>
								<div>
									<h3 class="text-sm font-semibold">Your digital passport</h3>
									<p class="text-sm text-gray-600">
										You can use your wallet as your identity, and use it to sign into your favorite
										apps.
									</p>
								</div>
							</div>
						</div>
						<!-- learn more link -->
						<div class="flex w-full place-content-center border-t p-6">
							<a
								href="https://solana.com/docs/intro/wallets"
								target="_blank"
								class="wallet-adapter-modal-list-more group inline-flex items-center gap-1 font-semibold capitalize text-[--solana-primary] hover:border-b"
								onclick={() => (expanded = !expanded)}
								tabIndex={0}
							>
								<figure class="w-4 transition-all group-hover:w-0">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<g fill="none">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="M11 6a1 1 0 1 1 0 2H5v11h11v-6a1 1 0 1 1 2 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm9-3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V6.414l-8.293 8.293a1 1 0 0 1-1.414-1.414L17.586 5H15a1 1 0 1 1 0-2Z"
											/>
										</g>
									</svg>
								</figure>
								learn more
								<figure class="w-0 transition-all group-hover:w-4">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<g fill="none">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="M11 6a1 1 0 1 1 0 2H5v11h11v-6a1 1 0 1 1 2 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm9-3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V6.414l-8.293 8.293a1 1 0 0 1-1.414-1.414L17.586 5H15a1 1 0 1 1 0-2Z"
											/>
										</g>
									</svg>
								</figure>
							</a>
						</div>
						<!-- {#if collapsedWallets.length}
					<button
						class="wallet-adapter-modal-list-more"
						onclick={() => (expanded = !expanded)}
						tabIndex={0}
					>
						<span>{expanded ? 'Hide ' : 'Already have a wallet? View '}options</span>
						<svg
							width="13"
							height="7"
							viewBox="0 0 13 7"
							xmlns="http://www.w3.org/2000/svg"
							class:wallet-adapter-modal-list-more-icon-rotate={expanded}
						>
							<path
								d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z"
							/>
						</svg>
					</button>
					<Collapse {expanded} id="wallet-adapter-modal-collapse">
						<ul class="wallet-adapter-modal-list">
							{#each collapsedWallets as wallet (wallet.adapter.name)}
								<li>
									<WalletListItem
										{wallet}
										onclick={() => {
											select(wallet.adapter.name);
											walletModal.visible = false;
										}}
										tabIndex={expanded ? 0 : -1}
									/>
								</li>
							{/each}
						</ul>
					</Collapse>
				{/if} -->
					</div>
				</div>
			{/if}
		</div>
		<!-- top bar -->
	</div>
</dialog>

<style>
	@keyframes fly-in-from-bottom {
		0% {
			transform: translateY(100px);
		}
		100% {
			transform: translateY(0);
		}
	}

	.wallet-adapter-modal-list-container {
		&::-webkit-scrollbar {
			@apply w-4 rounded-lg bg-inherit;
		}
		&::-webkit-scrollbar-track {
			/* change me to blue to match the background */
			@apply m-2 rounded-lg bg-gray-200;
		}
		&::-webkit-scrollbar-thumb {
			@apply w-2 rounded-lg border-4 border-solid border-[inherit] bg-gray-400;
			/* change border color to blue to match the background */
		}
	}
</style>
