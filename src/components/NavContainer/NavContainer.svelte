<script lang="ts">
  import Typography from '$system/Typography';

  export let title: string;
</script>

<div>
  <Typography
    variant="body2"
    bold
    spaceLeft
  >
    {title}
  </Typography>
  <slot />
</div>

<style lang="postcss">
  div {
    display: flex;
    flex-direction: column;
    /* padding: 16px 0; */
  }
</style>
