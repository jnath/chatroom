<script lang="ts" context='module'>
  export interface EventValueDetails {
    promptTemplate: string,
    callback:(value: unknown) => void;
  }

  export { SupportedKeys } from './Content.svelte';

  export type Cmd = { command: string, actived: boolean};

</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Icon from 'svelte-fa';
	import { faBold, faItalic, faStrikethrough, faLink, faLinkSlash, faList, faListOl } from '@fortawesome/free-solid-svg-icons';

  import { SupportedKeys } from './Content.svelte';

  import { buttonStatus } from './stores/toolbar';
  import ToolbarButton from './ToolbarButton.svelte';

  export let hidden = false;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  const selectToolButton = (cmd: Cmd) => async (e: CustomEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch('select',cmd);
  }
</script>
<toolbar
  class:hidden
>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleBold,
      actived: $buttonStatus['strong']?.activated
    })}
    hightlight={$buttonStatus['strong']?.activated}
  >
    <Icon icon={faBold} />
  </ToolbarButton>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleItalic,
      actived: $buttonStatus['em']?.activated
    })}
    hightlight={$buttonStatus['em']?.activated}
  >
    <Icon icon={faItalic} />
  </ToolbarButton>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleStrikeThrough,
      actived: $buttonStatus['strike_through']?.activated
    })}
    hightlight={$buttonStatus['strike_through']?.activated}
  >
    <Icon icon={faStrikethrough} />
  </ToolbarButton>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleLink,
      actived: $buttonStatus['link']?.activated
    })}
    hightlight={$buttonStatus['link']?.activated}
  >
    <Icon
      icon={$buttonStatus['link']?.activated ? faLinkSlash : faLink}
    />
  </ToolbarButton>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleBulletList,
      actived: $buttonStatus['bullet_list']?.activated
    })}
    hightlight={$buttonStatus['bullet_list']?.activated}
  >
    <Icon icon={faList} />
  </ToolbarButton>
  <ToolbarButton
    {disabled}
    on:click={selectToolButton({
      command: SupportedKeys.ToggleOrderedList,
      actived: $buttonStatus['ordered_list']?.activated
    })}
    hightlight={$buttonStatus['ordered_list']?.activated}
  >
    <Icon icon={faListOl} />
  </ToolbarButton>
</toolbar>

<style lang="postcss">
  toolbar {
    display: flex;
    align-items: center;
    padding: 0 8px;
    background-color: var(--palette-primary-light);
    color: var(--palette-primary-contrast);
    border-radius: 4px 4px 0 0;
    border: none;
    height: 40px;
    transition: all .25s ease-in-out;
    overflow: hidden;

    flex-shrink: 0;

    &.hidden {
      height: 0;
    }
  }
</style>
