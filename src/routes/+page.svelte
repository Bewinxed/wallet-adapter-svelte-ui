<script lang="ts">
	import WalletConnectButton from '$lib/components/WalletConnectButton.svelte';
	import WalletDisconnectButton from '$lib/components/WalletDisconnectButton.svelte';
	import WalletMultiButton from '$lib/components/WalletMultiButton.svelte';
	import { useSolana } from '@bewinxed/wallet-adapter-svelte';
	import { onMount } from 'svelte';

	const solana = useSolana();
</script>

<div class="p-2 container gap-2 flex-col">
	<button onclick={() => solana.context.wallet?.connect()}>Connect</button>
	<button onclick={() => solana.context.wallet?.disconnect()}>Disconnect</button>
	<WalletMultiButton class=" " />
	<WalletConnectButton />
	<WalletDisconnectButton />
	<h1>Welcome to your library project</h1>
	<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
</div>
