<script lang="ts">
  import { onMount } from 'svelte';

	export let progress = -1;
  export let diameter = 40;
  export let color = 'var(--palette-primary-light)';
  export let wait = false;

  // const dispatch = createEventDispatcher();

  // let progressElement: SVGCircleElement;
  // const transitionEnd = () => {
  //   if(progress >= 1) {
  //     dispatch('anim:complete');
  //   }
  // };
  // onMount(()=>{
  //   progressElement.addEventListener("transitionend", transitionEnd);

  //   return ()=>{
  //     progressElement.removeEventListener("transitionend", transitionEnd);
  //   }
  // })

  // $: {
  //   if(wait){}
  // }

  // onMount(()=>{
  //   if(wait){
  //     progress = 0;
  //     setInterval(()=>{
  //       progress = progress + 1;
  //     }, 1000)
  //   }
  // })
</script>

<svg
  class:wait
  style:--diameter={`${diameter}px`}
  style:--color={color}
  viewBox="2 -2 28 36"
  xmlns="http://www.w3.org/2000/svg"
  >
  {#if progress > 0 }
    <circle
      class="progress"
      r="16"
      cx="16"
      cy="16"
      style="stroke-dashoffset: {(1 - progress) * 100}"
    />
  {/if}
  {#if wait }
    <circle
      class="progress"
      r="16"
      cx="16"
      cy="16"
    />
  {/if}
</svg>

<style lang="postcss">
  svg {
    --border-width: 4px;

    width: var(--diameter);
    height: var(--diameter);
    transform: rotate(-90deg);
    &.wait{
      animation: rotation 1s linear infinite;
      circle.progress {
        animation: auto-progress 2s alternate infinite
      }
    }

    circle.progress {
      fill: none;
      stroke-linecap: round;
      stroke: var(--color);
      stroke-dasharray: 100 100;
      stroke-linecap: round;
      stroke-width: var(--border-width);
      transition: stroke-dashoffset 1s;
      will-change: transform;
    }
  }

  @keyframes rotation {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes auto-progress {
    0%   { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
</style>
