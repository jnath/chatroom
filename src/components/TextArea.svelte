<script lang="ts">
  import MdSend from 'svelte-icons/md/MdSend.svelte'

  import EmojiSelector from './EmojiSelector';

  import { createEventDispatcher } from 'svelte';
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

</script>

<div class="TextArea">
  <input
    bind:value={value}
    autocomplete="off"
    on:keypress={onKeyPress}
    type="text"
    placeholder="Aa"
  />
  <EmojiSelector on:emoji={onEmoji}  />
  <button on:click={send} >
    <MdSend />
  </button>
</div>


<style lang="postcss">
  .TextArea {
    display: flex;
    padding: 5px 10px;
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

    :global(button) {
      border: none;
      margin: 0;
      padding: 0;
      width: auto;
      overflow: visible;

      background: transparent;

      /* inherit font & color from ancestor */
      color: inherit;
      font: inherit;

      /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
      line-height: normal;

      /* Corrects font smoothing for webkit */
      -webkit-font-smoothing: inherit;
      -moz-osx-font-smoothing: inherit;

      /* Corrects inability to style clickable `input` types in iOS */
      -webkit-appearance: none;

      width: 25px;
      margin: 0px 5px;
      color: rgb(0, 153, 255);

      cursor: pointer;
    }

    :global(.svelte-emoji-picker){

    }
  }
</style>
