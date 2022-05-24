<script lang="ts" context="module">
  import type { SvelteComponent } from 'svelte/internal';

  export type Component = 'div' | SvelteComponent;
</script>

<script lang="ts">
  export let component: Component = 'div';
  export let selected = false;
</script>

{#if typeof component === 'string'}
  <svelte:element
    on:click
    class:selected
    this={component}
    >
    <slot />
  </svelte:element>
{:else}
  <svelte:component
    on:click
    this={component}
    {selected}
    >
    <slot />
  </svelte:component>
{/if}

<style lang="postcss">
  * {
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    border-radius: 0;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    color: inherit;
    display: flex;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    text-decoration: none;
    min-width: 0;
    box-sizing: border-box;
    text-align: left;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding: var(--padding, 8px 16px 8px 16px);

    &:hover {
      text-decoration: none;
      background-color: var(--action-hover);
    }

    &.selected {
      background-color: var(--palette-primary-main);
      color: var(--palette-primary-contrast);
    }
  }
</style>
