<script lang="ts">
	import './layout.css';
	import DemoLinks from './demo/DemoLinks.svelte';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
  import Navbar from '#lib/components/Navbar.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,200..800&display=swap" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;800;900&display=swap" />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..500&display=swap" />
</svelte:head>

<Navbar />
<main>
  {@render children()}
</main>
<DemoLinks />
