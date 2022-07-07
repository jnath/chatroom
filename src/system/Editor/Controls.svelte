<script>
  import { createEventDispatcher } from 'svelte';

  import Button from '$system/Button';
  import Icon from 'svelte-fa';
	import { faCirclePlus, faPaperPlane, faParagraph } from '@fortawesome/free-solid-svg-icons';

  import EmojiSelector from '$system/EmojiSelector';

  const dispatch = createEventDispatcher();

  const onEmojiSelected = ()=> dispatch('onEmojiSelected');
  const toogleTextEditing = ()=> dispatch('toogleTextEditing');
  const sendMessages = ()=> dispatch('sendMessages');

</script>
<controls>
  <controls-right>
    <Button variant="icon">
      <Icon
        icon={faCirclePlus}
      />
    </Button>
  </controls-right>
  <controls-buttons>
    <EmojiSelector on:select={onEmojiSelected} />
    <Button variant="icon" on:click={toogleTextEditing}>
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
