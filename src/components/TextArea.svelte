<script lang="ts">
  import MdSend from 'svelte-icons/md/MdSend.svelte'

  import EmojiSelector from './EmojiSelector';

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
    on:click={send}
    --width='25px'
    --color='var(--palette-primary-main)'
    --padding='4px 0 0 0'
  >
    <MdSend />
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
