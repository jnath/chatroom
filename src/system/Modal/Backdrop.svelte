<script lang="ts">
  export let opacity = 1;
</script>

<div
  on:click
  style:opacity
/>

<style lang="postcss">
  * {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-tap-highlight-color: transparent;
    z-index: -1;
  }
</style>
