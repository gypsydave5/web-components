<script lang="ts">
    import type {Rank, File} from "./Chess";

    enum Colour {
        Light = 'light',
        Dark = 'dark'
    }

    export let rank: Rank
    export let file: File
    export let dark: string
    export let light: string

    const squareColour = (rank: Rank, file: File): Colour => {
        const f = file.charCodeAt(0) - 97
        const r = rank.charCodeAt(0) - 49
        return (f + r) % 2 === 0 ? Colour.Dark : Colour.Light
    }

</script>

<div class={squareColour(rank,file)} style="--dark: {dark}; --light: {light}">
    {file}{rank}
</div>

<style>
        .light {
            background-color: var(--light);
        }

        .dark {
            background-color: var(--dark);
        }
</style>