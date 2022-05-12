<script lang="ts">
  import Typography from '$components/Typography';

  export let title: string;
</script>

<div>
  <Typography
    tag='h3'
    --transform='uppercase'
    --padding="0 0 0 8px"
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
