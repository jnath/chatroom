<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte/internal';

  export type Component = 'ul' | 'nav' | SvelteComponent;
</script>

<script lang="ts">
  export let component: Component = 'ul';
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
    list-style: none;
    margin: 0px;
    position: relative;
    padding: 8px 0;
  }
</style>
