<script lang="ts">
  import { computePosition, type ComputePositionConfig } from '@floating-ui/dom';
  import { onMount } from 'svelte';

  export let anchor: HTMLElement | undefined = undefined;

  export let options: Partial<ComputePositionConfig> = {};

  let el: HTMLDivElement;

  const compute = ()=>{
    if(anchor){
      computePosition(anchor, el, options).then(({x, y}) => {
        console.log(x, y)
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }
  }

  onMount(()=>{
    window.addEventListener('resize', compute);
    compute();
    return () => {
      window.removeEventListener('resize', compute);
    }
  })
</script>

<div
  bind:this={el}
>
  <slot />
</div>

<style lang="postcss">
  * {
    position: absolute;
  }

</style>
