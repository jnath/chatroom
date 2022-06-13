<script lang="ts">
  import { computePosition, type ComputePositionConfig } from '@floating-ui/dom';
  import { createEventDispatcher, onMount } from 'svelte';
  import clickOutside from '$directives/clickOutside';

  export let anchor: HTMLElement | undefined = undefined;

  export let options: Partial<ComputePositionConfig> = {};

  const dispatch = createEventDispatcher();

  let el: HTMLDivElement;

  const compute = async ()=>{
    if(anchor){
      const { x, y } = await computePosition(anchor, el, options);
      Object.assign(el.style, {
        left: `${x}px`,
        top: `${y}px`,
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
  style:z-index={10}
  bind:this={el}
  use:clickOutside={()=>dispatch('close')}
>
  <slot />
</div>

<style lang="postcss">
  * {
    position: absolute;
  }

</style>
