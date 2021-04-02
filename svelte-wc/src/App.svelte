<svelte:options tag={"my-element"} />
<script lang="ts">
	import RedSquare from "./RedSquare.svelte";
	export let name: string
	export let hellos: string[] = ['a', 'b', 'c']
</script>

<main>
	<h1>Hello {name}!</h1>
	<h2>{hellos}</h2>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<!--	Have to use svelte components as web components when in svelte app-->
	<red-square />
	<ul>
	{#each hellos as hello}
		<li>{hello}</li>
	{/each}
	</ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
