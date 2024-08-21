<script lang="ts">
	import type { ButtonProps } from '$lib/button.js';
	import type { PublicKey } from '@solana/web3.js';
	import { fade, fly, slide } from 'svelte/transition';
	import { useWalletModal } from '../useWalletModal.svelte.js';
	import {
		setWalletMutliButtonContext,
		useWalletMultiButton
	} from '../useWalletMultiButton.svelte.js';
	import Button from './Button.svelte';
	import WalletIcon from './WalletIcon.svelte';
	import { clickOutside } from '../ui/clickOutside.js';
	import { cubicBezierSpring } from '$lib/ui/springEasing.js';

	let {
		children,
		onconnect,
		ondisconnect,
		onselectwallet,
		oncopy,
		class: className,
		...props
	}: ButtonProps & {
		labels?: Omit<
			{ [TButtonState in ReturnType<typeof useWalletMultiButton>['buttonState']]: string },
			'connected' | 'disconnecting'
		> & {
			'copy-address': string;
			copied: string;
			'change-wallet': string;
			disconnect: string;
		};
		/** Callback when the wallet is connected */
		onconnect?: (publicKey: PublicKey) => void;
		/** Callback when the copy button is clicked */
		oncopy?: (publicKey: PublicKey) => void;
		/** Callback when the wallet is disconnected */
		ondisconnect?: () => void;
		/** Callback when the wallet is selected */
		onselectwallet?: () => void;
	} = $props();

	let walletModal = useWalletModal();
	setWalletMutliButtonContext({
		onselectwallet() {
			walletModal.visible = true;
		}
	});
	let walletMultiButton = useWalletMultiButton();
	const { buttonState, wallet, walletIcon, walletName, context } = $derived(walletMultiButton);

	let copied = $state(false);
	let menuOpen = $state(false);

	let menuElement = $state<HTMLUListElement>();

	const labels = {
		'change-wallet': 'Change wallet',
		connecting: 'Connecting ...',
		'copy-address': 'Copy address',
		copied: 'Copied',
		disconnect: 'Disconnect',
		'has-wallet': 'Connect',
		'no-wallet': 'Select Wallet'
	} as const;

	let content = $derived(
		wallet?.publicKey
			? `${wallet.publicKey.toBase58().slice(0, 4)}..${wallet.publicKey.toBase58().slice(-4)}`
			: buttonState === 'connecting' || buttonState === 'has-wallet'
				? labels[buttonState]
				: labels['no-wallet']
	);

	$effect(() => {
		if (wallet) {
			if (onselectwallet) {
				onselectwallet();
			}
			if (onconnect) {
				wallet.adapter.on('connect', onconnect);
			}
			if (ondisconnect) {
				wallet.adapter.on('disconnect', ondisconnect);
			}
		}
	});
</script>

<div class="wallet-adapter-dropdown contents">
	<div class="group cursor-pointer relative w-fit">
		<Button
			{...props}
			class=" {buttonState === 'connected' ? ' ' : ''}  {className} {menuOpen
				? '!active:scale-100'
				: ''}"
			popovertarget="#wallet-adapter-dropdown-list"
			aria-haspopup="menu"
			aria-expanded={menuOpen}
			style={{ pointerEvents: menuOpen ? 'none' : 'auto', ...props.style }}
			onclick={async () => {
				switch (buttonState) {
					case 'no-wallet':
						walletModal.visible = true;
						break;
					case 'has-wallet':
						await wallet?.connect();
						break;
					case 'connected':
						menuOpen = !menuOpen;
						break;
				}
			}}
		>
			{#if children}
				{#if walletIcon}
					<div
						style:box-shadow="var(--chin-shadow)"
						class:p-0.5={buttonState === 'connected'}
						transition:slide={{ axis: 'x' }}
						class="relative aspect-square w-[1.25lh] rounded-lg border transition-all bg-white"
					>
						{#if buttonState === 'connected'}
							<div
								transition:fade
								class="animate-tilt absolute -inset-0 rounded-lg bg-gradient-to-r from-purple-300 to-green-300 opacity-75 blur-sm transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
							>
								<div class="inset-1 h-[80%] w-[80%]"></div>
							</div>
						{/if}
						<!-- <i class="wallet-adapter-button-start-icon mix-blend-multiply"> -->
						<WalletIcon wallet={{ adapter: { icon: walletIcon, name: '' } }} />
						<!-- </i> -->
					</div>
				{/if}
				{@render children()}
			{:else}
				{#if !context.wallet}
					<i
						transition:slide={{ axis: 'x', duration: 200 }}
						class:w-[1lh]={walletModal.visible}
						class="h-[1lh] w-0 group-hover:w-[1lh] transition-[width] overflow-hidden inline-flex relative"
					>
						<svg
							class="group-hover:translate-x-0 w-0 group-hover:w-[1lh] group-active:scale-0 -translate-x-10 transition-transform ease-[cubic-bezier(0.175,0.885,0.32,1.275)] duration-300 absolute inset-0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M21.78 3.28a.75.75 0 0 0-1.06-1.06l-2.012 2.012a4.25 4.25 0 0 0-5.463.462l-1.068 1.069a1.75 1.75 0 0 0 0 2.474l3.585 3.586a1.75 1.75 0 0 0 2.475 0l1.068-1.068a4.25 4.25 0 0 0 .463-5.463zm-3.585 2.475l.022.023l.003.002l.002.003l.023.022a2.75 2.75 0 0 1 0 3.89l-1.068 1.067a.25.25 0 0 1-.354 0l-3.586-3.585a.25.25 0 0 1 0-.354l1.068-1.068a2.75 2.75 0 0 1 3.89 0M10.78 11.28a.75.75 0 1 0-1.06-1.06L8 11.94l-.47-.47a.75.75 0 0 0-1.06 0l-1.775 1.775a4.25 4.25 0 0 0-.463 5.463L2.22 20.72a.75.75 0 1 0 1.06 1.06l2.012-2.012a4.25 4.25 0 0 0 5.463-.463l1.775-1.775a.75.75 0 0 0 0-1.06l-.47-.47l1.72-1.72a.75.75 0 1 0-1.06-1.06L11 14.94L9.06 13zm-3.314 2.247l.004.003l.003.004l2.993 2.993l.004.003l.003.004l.466.466l-1.244 1.245a2.75 2.75 0 0 1-3.89 0l-.05-.05a2.75 2.75 0 0 1 0-3.89L7 13.062z"
							/>
						</svg>
						<svg
							class:animate-pulse={walletModal.visible}
							class:!translate-x-0={walletModal.visible}
							class:w-[1lh]={walletModal.visible}
							class:scale-100={walletModal.visible}
							class="group-hover:translate-x-0 w-0 group-hover:w-[1lh] scale-0 group-active:scale-100 -translate-x-10 transition-[width,transform,scale] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] absolute inset-0"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M19.49 5.57a6 6 0 0 1-1.893 8.962c-.649.351-1.43.135-1.952-.386l-5.79-5.791c-.522-.522-.738-1.303-.388-1.952A6 6 0 0 1 18.43 4.51l2.29-2.29a.75.75 0 1 1 1.061 1.06zM3.28 21.78l2.29-2.29a6 6 0 0 0 8.962-1.893c.351-.649.135-1.43-.387-1.952l-5.79-5.79c-.522-.522-1.303-.738-1.952-.388A6 6 0 0 0 4.51 18.43l-2.29 2.29a.75.75 0 1 0 1.06 1.061"
							/>
						</svg></i
					>
				{/if}

				<div
					class:-translate-x-20={!walletIcon}
					class:opacity-0={!walletIcon}
					class:w-0={!walletIcon}
					class:absolute={!walletIcon}
					style:box-shadow="var(--chin-shadow)"
					class:p-0.5={buttonState === 'connected'}
					transition:slide={{ axis: 'x' }}
					class="aspect-square rounded-lg border transition-all  w-[1.25lh]"
				>
					
					<i class="wallet-adapter-button-start-icon relative mix-blend-multiply">
						{#if buttonState === 'connected'}
						<div
							transition:fade
							class="animate-tilt absolute -inset-0 rounded-lg bg-gradient-to-r from-purple-300 to-green-300 opacity-75 blur-sm transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
						>
							<div class="inset-1 h-[80%] w-[80%]"></div>
						</div>
					{/if}
					{#if walletIcon}
					<WalletIcon wallet={{ adapter: { icon: walletIcon, name: '' } }} />
					{/if}
					</i>
				</div>

				<span>{content}</span>
				{#if !context.wallet}
					<i
						transition:slide={{ axis: 'x', duration: 200 }}
						class:!w-0={walletModal.visible}
						class="w-[1lh] group-hover:w-0 transition-[width] overflow-hidden ease-in-out duration-200"
					>
						<svg
							class:translate-x-10={walletModal.visible}
							class="group-hover:translate-x-10 transition-transform ease-in-out duration-200 shadow-sm"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<g fill="none">
								<path
									fill="url(#tokenBrandedSolana0)"
									d="M19.125 7.447a.7.7 0 0 1-.456.18H2.644c-.569 0-.856-.65-.462-1.03l2.632-2.538a.67.67 0 0 1 .455-.188h16.088c.574 0 .855.656.456 1.038z"
								/>
								<path
									fill="url(#tokenBrandedSolana1)"
									d="M19.125 19.954a.7.7 0 0 1-.456.175H2.644c-.569 0-.856-.645-.462-1.026l2.632-2.544a.66.66 0 0 1 .455-.181h16.088c.574 0 .855.65.456 1.03z"
								/>
								<path
									fill="url(#tokenBrandedSolana2)"
									d="M19.125 10.303a.7.7 0 0 0-.456-.175H2.644c-.569 0-.856.645-.462 1.025l2.632 2.545a.7.7 0 0 0 .455.18h16.088c.574 0 .855-.65.456-1.03z"
								/>
								<defs>
									<linearGradient
										id="tokenBrandedSolana0"
										x1="2.001"
										x2="22.51"
										y1="59.823"
										y2="59.635"
										gradientUnits="userSpaceOnUse"
									>
										<stop stop-color="#599db0" />
										<stop offset="1" stop-color="#47f8c3" />
									</linearGradient>
									<linearGradient
										id="tokenBrandedSolana1"
										x1="2.001"
										x2="22.379"
										y1="8.853"
										y2="8.697"
										gradientUnits="userSpaceOnUse"
									>
										<stop stop-color="#c44fe2" />
										<stop offset="1" stop-color="#73b0d0" />
									</linearGradient>
									<linearGradient
										id="tokenBrandedSolana2"
										x1="3.152"
										x2="21.225"
										y1="12.003"
										y2="12.003"
										gradientUnits="userSpaceOnUse"
									>
										<stop stop-color="#778cbf" />
										<stop offset="1" stop-color="#5dcdc9" />
									</linearGradient>
								</defs>
							</g>
						</svg>
					</i>
				{/if}
			{/if}
		</Button>
		{#if menuOpen}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<ul
				use:clickOutside
				onclickoutside={() => {
					menuOpen = false;
				}}
				id="wallet-adapter-dropdown-list"
				aria-label="dropdown-list"
				class="absolute bg-white top-full left-0 z-10 min-w-56 shadow-xl wallet-adapter-dropdown-list mt-1 flex max-w-xs flex-1 flex-col divide-y {menuOpen &&
					'wallet-adapter-dropdown-list-active'}"
				bind:this={menuElement}
				role="menu"
				transition:slide={{ axis: 'y' }}
				onclick={(e) => {}}
			>
				{#if wallet?.publicKey}
					<li class="contents first:rounded-t-lg last:rounded-b-lg rounded-[unset]">
						<Button
							flat
							square
							class="wallet-adapter-dropdown-list-item flex flex-1 justify-start items-center gap-2 rounded-[inherit] font-normal text-sm"
							onclick={async (e) => {
								if (oncopy) {
									oncopy(wallet.publicKey!);
								}
								await navigator.clipboard.writeText(wallet.publicKey!.toBase58());
								copied = true;
								setTimeout(() => (copied = false), 500);
							}}
							role="menuitem"
						>
							<div class="transition-container w-[1lh] h-[1lh] p-0.5 overflow-hidden">
								{#if copied}
									<svg
										transition:fly={{
											duration: 250,
											x: 50,
											easing: cubicBezierSpring
										}}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<g fill="none" fill-rule="evenodd">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 2h11v11H4z"
											/>
										</g>
									</svg>
								{:else}
									<svg
										transition:fly={{
											duration: 250,
											x: 50,
											easing: cubicBezierSpring
										}}
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<g fill="none">
											<path
												d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
											/>
											<path
												fill="currentColor"
												d="M13.586 2A2 2 0 0 1 15 2.586L19.414 7A2 2 0 0 1 20 8.414V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 4H6v16h12V10h-4.5A1.5 1.5 0 0 1 12 8.5zm1.59 8.657a1 1 0 0 1 1.415 1.414l-3.111 3.112a1.1 1.1 0 0 1-1.556 0l-1.343-1.344a1 1 0 0 1 1.414-1.414l.707.707ZM14 4.414V8h3.586z"
											/>
										</g>
									</svg>
								{/if}
							</div>
							{#if copied}
								{labels['copied']}
							{:else}
								{labels['copy-address']}
							{/if}
						</Button>
					</li>
				{/if}
				<li class="contents first:rounded-t-lg last:rounded-b-lg">
					<Button
						square
						class="wallet-adapter-dropdown-list-item flex flex-1 justify-start items-center gap-2 rounded-[inherit] font-normal text-sm "
						onclick={(e) => {
							e.stopPropagation();
							walletModal.visible = true;
							menuOpen = false;
						}}
						role="menuitem"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-[1lh] p-0.5"
						>
							<g fill="none">
								<path
									d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
								/>
								<path
									fill="currentColor"
									d="M16 4a1 1 0 0 1 .117 1.993L16 6H5.5a.5.5 0 0 0-.09.992L5.5 7H19a2 2 0 0 1 1.995 1.85L21 9v9a2 2 0 0 1-1.85 1.995L19 20H5a2 2 0 0 1-1.995-1.85L3 18V6.5a2.5 2.5 0 0 1 2.336-2.495L5.5 4zM5 8.95V18h14V9H5.5q-.171 0-.337-.022zM15.5 12a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
								/>
							</g>
						</svg>
						{labels['change-wallet']}
					</Button>
				</li>

				<li class="contents first:rounded-t-lg last:rounded-b-lg">
					<Button
						square
						class="wallet-adapter-dropdown-list-item flex flex-1 justify-start items-center gap-2 rounded-[inherit] font-normal text-sm "
						onclick={async (e) => {
							e.stopPropagation();
							if (ondisconnect) {
								ondisconnect();
							}
							await wallet?.disconnect();
							menuOpen = false;
						}}
						role="menuitem"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-[1lh] p-0.5"
						>
							<g fill="none">
								<path
									d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
								/>
								<path
									fill="currentColor"
									d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16M9.879 8.464L12 10.586l2.121-2.122a1 1 0 1 1 1.415 1.415l-2.122 2.12l2.122 2.122a1 1 0 0 1-1.415 1.415L12 13.414l-2.121 2.122a1 1 0 0 1-1.415-1.415L10.586 12L8.465 9.879a1 1 0 0 1 1.414-1.415"
								/>
							</g>
						</svg>
						{labels['disconnect']}
					</Button>
				</li>
			</ul>
		{/if}
	</div>
</div>

<style>
	.connected {
		animation: tilt 5s infinite linear;
	}

	@keyframes tilt {
		0% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(180deg);
		}
		50% {
			transform: rotate(0deg);
		}
		75% {
			transform: rotate(-180deg);
		}
		100% {
			transform: rotate(0deg);
		}
	}
</style>
