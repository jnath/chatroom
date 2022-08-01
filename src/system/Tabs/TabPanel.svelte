<script lang="ts" context="module">
  export interface Panel {
    id: string;
  }
</script>

<script lang="ts">
  import { getContext } from 'svelte';

  import getId from './id';
  import { TABS } from './Tabs.svelte';

  const panel: Panel = {
    id: getId()
  };
  const { registerPanel, selectedPanel, labeledBy } = getContext(TABS);

  registerPanel(panel);
</script>

<tabpanel
  id={panel.id}
  aria-labelledby={$labeledBy[panel.id]}
>
  {#if $selectedPanel === panel}
    <slot />
  {/if}
</tabpanel>

<style lang="postcss">
  tabpanel {
    margin-top: 0.5em;
  }
</style>
