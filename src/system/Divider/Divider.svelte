<script lang="ts">
  export let gutterBottom = false;
</script>

<hr
  class:gutterBottom
/>

<style lang="postcss">
  * {
    margin: 0px;
    flex-shrink: 0;
    border-width: 0px 0px thin;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.12);

    &.gutterBottom {
      margin-bottom: 16px;
    }
  }
</style>
