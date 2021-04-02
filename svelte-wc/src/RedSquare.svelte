<svelte:options tag={"red-square"} />

<script>
    export let colour = '#F77'
</script>

<div class="square" style="background-color: {colour}">

</div>

<style>
    .square {
        width: 50px;
        height: 50px;
    }
</style>