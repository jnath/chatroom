<script lang="ts">
  import EmojiSelector from './EmojiSelector';

  import Icon from 'svelte-fa';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

  import { createEventDispatcher } from 'svelte';
  import Button from '$system/Button';

  export let value: string;

	const dispatch = createEventDispatcher();

  const send = ()=>{
    dispatch('send');
  }

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') send();
  }

  function onEmoji(event: CustomEvent) {
    value += event.detail;
  }

  export const reset = ()=>{
    value = '';
  }

</script>

<div>
  <input
    bind:value={value}
    autocomplete="off"
    on:keypress={onKeyPress}
    type="text"
    placeholder="Aa"
  />
  <EmojiSelector on:emoji={onEmoji}  />
  <Button
    variant="icon"
    style='primary'
    on:click={send}
  >
    <Icon
      size="lg"
      icon={faPaperPlane}
    />
  </Button>
</div>


<style lang="postcss">
  div {
    display: flex;
    padding: 5px 10px;
    gap: 10px;
    border-top: solid 1px var(--palette-divider);

    & > input {
      flex: 1;
    }

    input{
      border-radius: 20px;
      border: none;
      padding-left: 16px;
      color: #1e1e1e;
      background-color: #f3f3f5;
      height: 35px;
      font-size: 18px;
    }

    input:focus {
      outline: none;
      color: #2d9fd9;
    }
  }
</style>
