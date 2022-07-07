<script lang="ts" context='module'>
  export interface EventValueDetails {
    promptTemplate: string,
    callback:(value: unknown) => void;
  }
</script>
<script lang="ts">
  import type { CmdKey } from '@milkdown/core';
  import { createEventDispatcher } from 'svelte';

  import Icon from 'svelte-fa';
	import { faBold, faItalic, faStrikethrough, faLink, faLinkSlash, faList, faListOl } from '@fortawesome/free-solid-svg-icons';

  import Button from '$system/Button';

  import { commands } from './Content.svelte';

  import { buttonStatus } from './stores/toolbar';
import ToolbarButton from '$system/Editor/ToolbarButton.svelte';


  export let hidden = false;

  const dispatch = createEventDispatcher();

  const linkValue = async ()=>{
    return new Promise((resolve)=>{
      dispatch('value', {
        promptTemplate: 'link',
        callback:resolve
      })
    })
    // return prompt('Enter the URL');
  }

  const selectToolButton = <T,>(cmd: { command: CmdKey<T>, payload?: T | unknown}) => async (e: CustomEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let payload
    if(typeof cmd.payload === 'function'){
      payload = await cmd.payload();
    }else{
      payload = cmd.payload;
    }
    dispatch('select',{ command: cmd.command, payload });
  }
</script>
<toolbar
  class:hidden
>
  <ToolbarButton
    on:click={selectToolButton({ command: commands.ToggleBold })}
    hightlight={$buttonStatus['strong']?.activated}
  >
    <Icon icon={faBold} />
  </ToolbarButton>
  <ToolbarButton
    on:click={selectToolButton({ command: commands.ToggleItalic })}
    hightlight={$buttonStatus['em']?.activated}
  >
    <Icon icon={faItalic} />
  </ToolbarButton>
  <ToolbarButton
    on:click={selectToolButton({ command: commands.ToggleStrikeThrough })}
    hightlight={$buttonStatus['strike_through']?.activated}
  >
    <Icon icon={faStrikethrough} />
  </ToolbarButton>
  <ToolbarButton
    on:click={selectToolButton({
      command: commands.ToggleLink,
      payload: $buttonStatus['link']?.activated ? undefined : linkValue
    })}
    hightlight={$buttonStatus['link']?.activated}
  >
    <Icon
      icon={$buttonStatus['link']?.activated ? faLinkSlash : faLink}
    />
  </ToolbarButton>
  <ToolbarButton
    on:click={selectToolButton({ command: commands.ToggleBulletList })}
    hightlight={$buttonStatus['bullet_list']?.activated}
  >
    <Icon icon={faList} />
  </ToolbarButton>
  <ToolbarButton
    on:click={selectToolButton({ command: commands.ToggleOrderedList })}
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
