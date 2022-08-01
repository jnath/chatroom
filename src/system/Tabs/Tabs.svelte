<script lang="ts" context="module">
  export const TABS = {};
</script>

<script lang="ts">
  import type { Tab } from '$system/Tabs/Tab.svelte';
  import type { Panel } from '$system/Tabs/TabPanel.svelte';

  import { afterUpdate, setContext, onDestroy, onMount } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  export let selectedTabIndex = 0;

  const tabElements: HTMLLIElement[] = [];
  const tabs: Tab[] = [];
  const panels: Panel[] = [];

  const controls = writable({});
  const labeledBy = writable({});

  const selectedTab = writable<Tab | null>(null);
  const selectedPanel = writable<Panel | null>(null);

  function removeAndUpdateSelected(arr: Tab[], item: Tab, selectedStore: Writable<Tab | null>) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
    selectedStore.update(selected => selected === item ? (arr[index] || arr[arr.length - 1]) : selected);
  }

  function registerItem(arr: Tab[], item: Tab, selectedStore: Writable<Tab | null>) {
    arr.push(item);
    selectedStore.update(selected => selected || item);
    onDestroy(() => removeAndUpdateSelected(arr, item, selectedStore));
  }

  function selectTab(tab: Tab) {
    selectedTabIndex = tabs.indexOf(tab);
    selectedTab.set(tab);
    selectedPanel.set(panels[selectedTabIndex]);
  }

  setContext(TABS, {
    registerTab(tab: Tab) {
      registerItem(tabs, tab, selectedTab);
    },

    registerTabElement(tabElement: HTMLLIElement) {
      tabElements.push(tabElement);
    },

    registerPanel(panel: Panel) {
      registerItem(panels, panel, selectedPanel);
    },

    selectTab,

    selectedTab,
    selectedPanel,

    controls,
    labeledBy
  });

  onMount(() => {
    selectTab(tabs[selectedTabIndex]);
  });

  afterUpdate(() => {
    for (let i = 0; i < tabs.length; i++) {
      controls.update(controlsData => ({...controlsData, [tabs[i].id]: panels[i].id}));
      labeledBy.update(labeledByData => ({...labeledByData, [panels[i].id]: tabs[i].id}));
    }
  });

  $: selectedTabIndex, ()=>{
    selectedTab.set(tabs[selectedTabIndex]);
    selectedPanel.set(panels[selectedTabIndex]);
  };

  async function handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === "tab") {
      if(!$selectedTab){
        return
      }
      let selectedIndex = tabs.indexOf($selectedTab);

      switch (event.key) {
        case 'ArrowRight':
          selectedIndex += 1;
          if (selectedIndex > tabs.length - 1) {
            selectedIndex = 0;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
          break;

        case 'ArrowLeft':
          selectedIndex -= 1;
          if (selectedIndex < 0) {
            selectedIndex = tabs.length - 1;
          }
          selectTab(tabs[selectedIndex]);
          tabElements[selectedIndex].focus();
      }
    }
  }
</script>

<tabs on:keydown={handleKeyDown}>
  <slot />
</tabs>
