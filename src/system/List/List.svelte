<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte/internal';

  export type Component = 'ul' | 'nav' | SvelteComponent;
</script>

<script lang="ts">
  export let component: Component = 'ul';
  export let dense = false;

</script>

{#if typeof component === 'string'}
  <svelte:element
    this={component}
    class="{dense ? 'dense': ''}"
  >
    <slot />
  </svelte:element>
{:else}
  <svelte:component
    this={component}
    {dense}
  >
    <slot />
  </svelte:component>
{/if}

<style lang="postcss">
  * {
    list-style: none;
    margin: 0px;
    position: relative;
    padding: 8px 0;

    &.dense {
      padding: 0;
    }
  }
</style>
