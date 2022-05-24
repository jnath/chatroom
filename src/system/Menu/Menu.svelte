<script lang="ts" context="module">
  import type { Component as ListComponent } from '$system/List/List.svelte';

  export type Component = ListComponent;
</script>

<script lang="ts">
  import List from '$system/List/List.svelte';
  import Popper from '$system/Popper';

  export let component: Component = 'ul';
  export let open = true;

  type T = $$Generic<HTMLElement>;
  export let anchor: T | undefined = undefined;
</script>

{#if open}
  {#if anchor}
    <Popper {anchor}>
      <div>
        <List {component}>
          <slot />
        </List>
      </div>
    </Popper>
  {:else}
    <div>
      <List {component}>
        <slot />
      </List>
    </div>
  {/if}
{/if}

<style lang="postcss">
  * {
    background-color: rgb(255, 255, 255);
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
    /* position: absolute; */
    overflow: hidden auto;
    min-width: 16px;
    min-height: 16px;
    max-width: 100%;
    max-height: 100%;
    outline: 0px;

    &.open {

    }
  }
</style>
