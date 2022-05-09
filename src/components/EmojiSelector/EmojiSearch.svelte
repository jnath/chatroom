<script lang="ts">
  import { onMount } from 'svelte';
  import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
  import Icon from 'fa-svelte';
  export let searchText = '';
  let searchField: HTMLInputElement;
  onMount(() => {
    searchField.focus();
  });
  function clearSearchText() {
    searchText = '';
    searchField.focus();
  }
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && searchText) {
      clearSearchText();
      event.stopPropagation();
    }
  }
</script>

<div class="svelte-emoji-picker__search">
  <input type="text" placeholder="Search emojis..." bind:value={searchText} bind:this={searchField} on:keydown={handleKeyDown}>

  {#if searchText}
    <span class="icon clear-button" role="button" on:click|stopPropagation={clearSearchText}><Icon icon={faTimes} /></span>
  {:else}
    <span class="icon"><Icon icon={faSearch} /></span>
  {/if}
</div>

<style lang="postcss">
  .svelte-emoji-picker__search {
    display: flex;
    padding: 0.25em;
    position: relative;
  }
  .svelte-emoji-picker__search input {
    flex: 1;
    border-radius: 20px;
    border: none;
    padding-left: 16px;
    color: #a0d18c;
    background-color: #f3f3f5;
    height: 35px;
  }

  .svelte-emoji-picker__search input:focus {
    outline: none;
  }
  .icon {
    color: #AAAAAA;
    position: absolute;
    font-size: 1em;
    top: calc(50% - 0.5em);
    right: 16px;
  }
  .icon.clear-button {
    cursor: pointer;
  }
</style>
