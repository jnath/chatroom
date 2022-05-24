<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte/internal';

  export type Component = 'li' | 'div' | SvelteComponent;
</script>

<script lang="ts">
  export let component: Component = 'li';
</script>

{#if typeof component === 'string'}
  <svelte:element this={component}>
    <slot />
  </svelte:element>
{:else}
  <svelte:component this={component}>
    <slot />
  </svelte:component>
{/if}


<style lang="postcss">
  * {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    text-decoration: none;
    width: 100%;
    box-sizing: border-box;
    text-align: left;
  }
</style>
