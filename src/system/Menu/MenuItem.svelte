<script lang="ts">
  import ListItemButton from '$system/List/ListItemButton.svelte';

  let binded: ListItemButton;

  export function scrollIntoView() {
    binded.scrollIntoView();
  }
</script>

<ListItemButton
  bind:this={binded}
  on:click
>
  <slot />
</ListItemButton>
