<script lang="ts">
  import type { EmojiData } from './data';

  import { createEventDispatcher } from 'svelte';
  import twemoji from 'twemoji';

  export let emoji: EmojiData;

  const dispatch = createEventDispatcher();
  function onClick() {
    dispatch('emojiclick', emoji);
  }
  function onMouseOver() {
    dispatch('emojihover', emoji);
  }
  function onMouseOut() {
    dispatch('emojihover', null);
  }
  function onFocus() {
    dispatch('emojifocus', null);
  }
  function onBlur() {
    dispatch('emojiblur', null);
  }
</script>

<button
  on:mouseover={onMouseOver}
  on:mouseout={onMouseOut}
  on:blur={onBlur}
  on:focus={onFocus}
  on:click={onClick}
>
  {@html twemoji.parse(emoji.emoji, {
    folder: 'svg',
    ext: '.svg',
  })}
</button>

<style lang="postcss">
  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.3em;
    width: 1.5em;
    height: 1.5em;
    padding: 0;
    margin: 0;
  }
  button:hover {
    background: #E8F4F9;
    border-radius: 5px;
  }
</style>
