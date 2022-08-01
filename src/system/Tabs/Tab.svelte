<script lang="ts" context='module'>
  export interface Tab {
    id: string;
  }
</script>
<script lang="ts">
  import { getContext, onMount, tick } from 'svelte';

  import getId from './id';
  import { TABS } from './Tabs.svelte';

  let tabEl: HTMLLIElement;

  const tab: Tab = {
    id: getId()
  };
  const { registerTab, registerTabElement, selectTab, selectedTab, controls } = getContext(TABS);

  let isSelected: boolean;
  $: isSelected = $selectedTab === tab;

  registerTab(tab);

  onMount(async () => {
    await tick();
    registerTabElement(tabEl);
  });
</script>

<tab
  bind:this={tabEl}
  id={tab.id}
  aria-controls={$controls[tab.id]}
  aria-selected={isSelected}
  tabindex="{isSelected ? 0 : -1}"
  class:selected={isSelected}
  on:click={() => selectTab(tab)}>
	<slot></slot>
</tab>

<style lang="postcss">
	tab {
		border: none;
		border-bottom: 2px solid transparent;
		color: #000000;
    cursor: pointer;
    list-style: none;
    display: inline-block;
    padding: 0.5em 0.75em;

    &:focus {
      outline: thin dotted;
    }

    &.selected {
      border-bottom: 2px solid #4F81E5;
      color: #4F81E5;
    }
	}

</style>
