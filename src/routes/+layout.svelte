<script lang="ts">
	import WalletModalProvider from '$lib/components/WalletModalProvider.svelte';
	import { ConnectionProvider, WalletProvider } from '@bewinxed/wallet-adapter-svelte';
	import {
		PhantomWalletAdapter,
		SolflareWalletAdapter,
		MathWalletAdapter
	} from '@solana/wallet-adapter-wallets';
	import { Toaster, toast } from 'svelte-sonner';

	import '../lib/app.css';
	// import '../lib/app.css';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();

	const wallets = [
		// new UnsafeBurnerWalletAdapter(),
		new PhantomWalletAdapter(),
		new SolflareWalletAdapter(),
		new MathWalletAdapter()
	];
</script>

<ConnectionProvider config={{}} endpoint="https://api.devnet.solana.com">
	<WalletProvider 
		{wallets}
		onconnect={(publicKey) => {
			toast.message('Connected to ' + publicKey?.toBase58());
		}}
		ondisconnect={() => {
			toast.message('Disconnected');
		}}
		onerror={(error) => {
			toast.error(error.message);
		}}
	>
		<WalletModalProvider>
			{@render children()}
		</WalletModalProvider>
	</WalletProvider>
</ConnectionProvider>
<Toaster />

<style>
</style>
