<script lang="ts" context="module">
  import { onMount, type SvelteComponent } from 'svelte/internal';

  export type Component = 'div' | SvelteComponent;
  export type Padding = Record<'left' | 'right' | 'top' | 'bottom', number>;
</script>

<script lang="ts">
  export let component: Component = 'div';
  export let selected = false;
  export let dense = false;

  let mounted = false;

  let binded:HTMLElement;
  export function focus(){
    binded.focus();
  }

  $: {
    if(mounted && selected){
      binded.scrollIntoView();
    }
  }

  onMount(()=>{
    mounted = true;
  })
</script>

{#if typeof component === 'string'}
  <svelte:element
    this={component}
    bind:this={binded}
    on:click
    on:touchstart
    on:keydown
    class="{selected ? 'selected': ''} {dense ? 'dense': ''}"
  >
    <slot />
  </svelte:element>
{:else}
  <svelte:component
    on:click
    on:touchstart
    on:keydown
    this={component}
    bind:this={binded}
    {selected}
    {dense}
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
    gap: 16px;

    &:hover {
      text-decoration: none;
      background-color: var(--action-hover);
    }

    &.selected {
      background-color: var(--palette-primary-dark);
      color: var(--palette-primary-contrast);
    }

    &.dense {
      --padding: 0 16px 0 16px;
    }
  }
</style>
