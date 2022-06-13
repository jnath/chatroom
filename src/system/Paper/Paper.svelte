<script lang="ts">
  export let elevation: 0 | 1 | 2 | 3 = 0;

  let level = Math.max(0, Math.min(elevation, 3));
</script>

<div
  class:level0={level === 0}
  class:level1={level === 1}
  class:level2={level === 2}
  class:level3={level === 3}
>
  <slot />
</div>

<style lang="postcss">
  * {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 4px;
    /* width: var(--width, auto);
    height: var(--height, auto); */
    display: flex;
    flex-direction: column;

    &.level0 {
      box-shadow: none;
    }

    &.level1 {
      box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
    }

    &.level2 {
      box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
    }

    &.level3 {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }


  }

</style>
