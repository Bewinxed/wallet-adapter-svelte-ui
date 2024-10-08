import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit()
		// scopeTailwind({
		// 	react: 'false'
		// })
		// nodePolyfills()],
	],
	// css: {
	// 	postcss: {
	// 		plugins: [tailwindcss()]
	// 	}
	// },
	server: {
		host: '127.0.0.1',
		port: 5173
	},
	resolve: {
		alias: {
			$lib: resolve('./src/lib')
		}
	},
	build: {
		lib: {
			name: '@bewinxed/wallet-adapter-svelte-ui',
			entry: 'src/lib/index.ts',
			fileName: 'index',
			formats: ['es']
		},

		rollupOptions: {
			external: [
				'@solana/web3.js',
				'@bewinxed/wallet-adapter-base',
				'@solana/wallet-adapter-base-ui',
				'@solana/wallet-adapter-wallets',
				'@bewinxed/wallet-adapter-svelte'
			]
		},
		ssr: true
	}
});
