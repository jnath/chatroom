<script lang="ts">
  import Button from '$system/Button';

  export let hightlight = false;
  export let disabled = false;
</script>

<toolbar-button
  class:hightlight
>
  <Button
      variant="icon"
      {disabled}
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
