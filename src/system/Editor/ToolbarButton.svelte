<script>
  import Button from '$system/Button';

  export let hightlight = false;
</script>

<toolbar-button
  class:hightlight
>
  <Button
      variant="icon"
      on:click
    >
    <slot />
  </Button>
</toolbar-button>

<style lang="postcss">
  toolbar-button {
    border-radius: 4px;
    overflow: auto;
    &.hightlight {
      background-color: var(--action-selected);
    }
  }
</style>
