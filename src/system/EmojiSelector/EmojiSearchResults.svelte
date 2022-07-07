<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { faFrown } from '@fortawesome/free-regular-svg-icons';
  import Icon from 'svelte-fa';
  import EmojiList from './EmojiList.svelte';
  import { default as emojiData, type EmojiData} from './data';
  export let searchText = '';

  const dispatch = createEventDispatcher();

  let searchResults: EmojiData[];
  $: searchResults = emojiData.filter(emoji => (
    emoji.names.find(name => name.indexOf(searchText) >= 0)
  ));

  function onMouseOver() {
    dispatch('emojihover', null);
  }
  function onFocus(){
    dispatch('emojifocus');
  }
</script>

<div class="svelte-emoji-picker__search-results">
  {#if searchResults.length}
    <EmojiList emojis={searchResults} withTabs={false} on:emojihover on:emojiclick />
  {:else}
    <div class="svelte-emoji-picker__no-results" on:mouseover={onMouseOver} on:focus={onFocus}>
      <div class="icon"><Icon icon={faFrown} /></div>
      <h3>No emojis found.</h3>
    </div>
  {/if}
</div>

<style lang="postcss">
  .svelte-emoji-picker__search-results {
    padding: 0.25em;
    height: 15rem;
  }
  .svelte-emoji-picker__search-results h3 {
    margin: 0;
    font-size: 0.9em;
    margin: 0 auto;
    color: #999999;
  }
  .svelte-emoji-picker__no-results {
    height: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .svelte-emoji-picker__no-results .icon {
    margin: 0 auto;
    font-size: 3em;
    color: #999999;
  }
</style>
