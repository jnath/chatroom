<script lang="ts">

  type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  export let tag: TagName;
</script>

<svelte:element class={`Typography ${tag}`} this={tag} {...$$restProps}>
  <slot />
</svelte:element>

<style lang="postcss">
  .Typography {
    font-family: Inter;
    text-transform: var(--transform, inherit);
    padding: var(--padding, 0);
  }
  .h1.Typography {
    font-size: 24px;
  }
  .h2.Typography {
    font-size: 18px;
  }
  .h3.Typography {
    font-size: 12px;
  }
  .h4.Typography {
    font-size: 8px;
  }
  .h5.Typography {
    font-size: 6px;
  }
  .h6.Typography {
    font-size: 4px;
  }
</style>
