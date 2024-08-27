<script lang="ts">
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import WalletDisconnectButton from '$lib/components/WalletDisconnectButton.svelte';
	import WalletMultiButton from '$lib/components/WalletMultiButton.svelte';
	import { useSolana } from '@bewinxed/wallet-adapter-svelte';
	import { onMount } from 'svelte';

	const solana = useSolana();
</script>

<div
	class="grid container gap-2 p-4 flex-col m-auto place-items-center place-content-center h-screen w-screen bg-gradient-to-br from-purple to-green-400"
>
	<!-- <button onclick={() => solana.context.wallet?.connect()}>Connect</button>
	<button onclick={() => solana.context.wallet?.disconnect()}>Disconnect</button> -->

	<ul class="place-self-center text-white flex flex-col gap-2">
		<span class="font-bold text-center place-self-center">Solana On Svelte</span>
		<li>* Auto Detected Wallets ;)</li>
		<li>* Revamped UI ;)</li>
		<li>* Feature parity with react version</li>
	</ul>
	<WalletMultiButton class="place-self-center scale-100 bg-white" />
	<!-- <WalletConnectButton /> -->
	<!-- <WalletDisconnectButton /> -->
	<!-- <h1>Welcome to your library project</h1>
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> -->
</div>
