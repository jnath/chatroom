<script lang="ts">
  import Typography from '$system/Typography';

  export let title: string;
</script>

<div>
  <Typography
    variant="subtitle2"
    --paddingLeft="16px"
    --transform="uppercase"
  >
    {title}
  </Typography>
  <slot />
</div>

<style lang="postcss">
  div {
    display: flex;
    flex-direction: column;
    padding: 8px 0 16px 0;
  }
</style>
