<script lang="ts">
  import { computePosition, type ComputePositionConfig } from '@floating-ui/dom';
  import { createEventDispatcher, onDestroy, onMount, afterUpdate } from 'svelte';
  import clickOutside from '$directives/clickOutside';

  export let anchor: HTMLElement | undefined = undefined;

  export let options: Partial<ComputePositionConfig> = {};

  export let pos: { x: number, y: number, align?: 'top' | undefined } | undefined = undefined;

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

  $: align = pos?.align;

  $: {
    if(pos && el){
      Object.assign(el.style, {
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      });

    }
  }

  let mounted = false;

  onMount(()=>{
    window.addEventListener('resize', compute);
    compute();
    mounted = true;
    return () => {
      window.removeEventListener('resize', compute);
    }
  })

  // afterUpdate(()=>{
  //   compute();
  // })

  onDestroy(()=>{
    mounted = false;
  })

  export function getBoundingClientRect(){
    return el?.getBoundingClientRect() || new DOMRect(0, 0, 0, 0);
  }
</script>

<div
  style:z-index={10}
  style:transform="{align === 'top' ? 'translateY(-100%)' : undefined}"
  bind:this={el}
  use:clickOutside={()=>mounted && dispatch('close')}
>
  <slot />
</div>

<style lang="postcss">
  * {
    position: absolute;
  }

</style>
