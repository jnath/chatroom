<script lang="ts">
  import CircleProgressBar from '$system/ProgressBar';


  export let src: string;
  export let title: string;
  export let width: number | '100%' = '100%';
  export let height: number | 'auto' = 'auto';

  let loaded = false;

  let imgWidth = typeof width === 'number' ? width : 0;
  let imgHeight = typeof height === 'number' ? height : 0;

  const finish = (e: Event)=>{
    const target: HTMLImageElement | null = e.target as HTMLImageElement | null;
    imgWidth = target?.width || 0;
    imgHeight = target?.height || 0;
    loaded = true;
  }

</script>

<picture
  style:--width="{width}px"
  style:--height="{height}px"
>
  {#if !loaded}
    <loader>
      <CircleProgressBar wait />
    </loader>
  {/if}
  <img
    {src}
    {title}
    width={imgWidth}
    height={imgHeight}
    alt={title}
    on:load={finish}
  />
</picture>

<style lang="postcss">
  picture {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: lightgrey;

    img {
      width: var(--width);
      height: var(--height);
      object-fit: cover;
    }

    loader {
      position: absolute;
      opacity: .5;
    }
  }
</style>
