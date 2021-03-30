<script lang="ts">
    import Square from './Square.svelte'
    import {squares} from "./Chess";

    export let dark = '#666'
    export let light = '#ddd'
</script>

<div class="chessBoard">
    {#each squares as {rank, file}, i}
        <Square {rank} {file} {dark} {light}/>
    {/each}
</div>

<style>
    .chessBoard {
        width: 80vmin;
        height: 80vmin;
        background-color: red;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        box-sizing: border-box;
    }
</style>