<script lang="ts">
  import type { EmojiData } from './data';

  import Emoji from './Emoji.svelte';
  // export let name = '';
  export let withTabs = true;
  export let emojis: EmojiData[];
</script>


<!-- <h3>{name}</h3> -->
<div class="svelte-emoji-picker__emoji-list" class:tall={!withTabs}>
  {#each emojis as emoji}
    <Emoji emoji={emoji} on:emojihover on:emojiclick />
  {/each}
</div>

<style lang="postcss">
  /* h3 {
    margin: 0.25em;
    font-size: 0.9em;
    color: #333333;
  } */
  .svelte-emoji-picker__emoji-list {
    overflow: auto;
    height: 221px;
    width: 365px;
  }
  .svelte-emoji-picker__emoji-list.tall {
    height: 14.9rem;
  }
</style>
