<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Button from '$system/Button';
  import Icon from 'svelte-fa';
	import { faUpload, faPaperPlane, faParagraph } from '@fortawesome/free-solid-svg-icons';

  import EmojiSelector from '$system/EmojiSelector';

  const dispatch = createEventDispatcher();

  const onEmojiSelected = ({detail}: CustomEvent)=> dispatch('onEmojiSelected', detail);
  const toogleTextEditing = ()=> dispatch('toogleTextEditing');
  const sendMessages = ()=> dispatch('sendMessages');

  let input: HTMLInputElement;
  export let files: FileList;
  export let disabled = false;

</script>

<controls>
  <controls-right>
    <input
      bind:this={input}
      type="file" multiple accept="image/*" style="display:none" bind:files />
    <Button variant="icon" on:click={()=>input.click()} {disabled}>
      <Icon
        icon={faUpload}
      />
    </Button>
  </controls-right>
  <controls-buttons>
    <EmojiSelector on:emoji={onEmojiSelected} />
    <Button variant="icon" on:click={toogleTextEditing} {disabled}>
      <Icon
        icon={faParagraph}
      />
    </Button>
  </controls-buttons>
  <controls-left>
    <Button
      variant="icon"
      style='primary'
      on:click={sendMessages}
      {disabled}
    >
      <Icon
        icon={faPaperPlane}
      />
    </Button>
  </controls-left>
</controls>

<style lang="postcss">

  controls {
    display: flex;
    padding: 4px;
    align-items: center;

    controls-right {
      flex-shrink: 0;
    }

    controls-buttons {
      flex-grow: 1;
    }

    controls-left {
      flex-shrink: 0;
      align-items: flex-end;
    }
  }
</style>
