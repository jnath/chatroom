<div>
  {#if $$slots.title}
    <slot name="title" />
  {/if}
  <slot />
</div>

<style lang="postcss">
  div {
    display: flex;
    flex-direction: column;
  }
</style>
