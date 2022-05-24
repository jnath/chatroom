<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import portal from '$system/actions/portal';
  import Backdrop from '$system/Modal/Backdrop.svelte';

  export let open = false;

  const dispatch = createEventDispatcher();

  const clickBackdropHandler = () => {
    dispatch('close');
  }

  $: {
    // const wrapper = document.querySelector<HTMLDivElement>('body > div');
    if(open){
      document.body.style.paddingRight = '15px';
      document.body.style.overflow = 'hidden';
      // if(wrapper){
      //   wrapper.style.backdropFilter = 'blur(4px)';
      //   backdrop-filter: blur(10px) brightness(60%);
      // }
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      // if(wrapper){
      //   wrapper.style.filter = '';
      // }
    }
  }
</script>

<div
  role="modal"
  class:open
  use:portal
>
  <Backdrop
    on:click={clickBackdropHandler}
  />
  <div role="modal-content">
    <slot />
  </div>
</div>

<style lang="postcss">
  div[role="modal"] {
    display: none;
    position: fixed;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    transform: scale(1);
    transform-origin: top left;
    opacity: 0;
    /* overflow: auto; */
    will-change: transform, opacity;
    z-index: 8;
    /* transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1), height 250ms cubic-bezier(0, 0, 0.2, 1);
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    background-color: #fff;
    color: #000;
    border-radius: 4px; */
    transform-origin-left: top left;
    transform-origin-right: top right;
    /* backdrop-filter: blur(4px); */

    & div[role="modal-content"] {
      top: 50vh;
      position: fixed;
      left: 50vw;
      transform: translate(-50%, -50%);
    }

    &.open {
      display: flex;
      /* transform: scale(1); */
      opacity: 1;

      /* transform-origin: center top; */
      left: 0px;
      top: 0px;
    }
  }

</style>
