<script lang="ts">
  import Typography from '$system/Typography';
  import Icon from 'svelte-fa';
	import { faClose } from '@fortawesome/free-solid-svg-icons';
  import { createEventDispatcher } from 'svelte';
  import Button from '$system/Button';

  export let title: string;
  export let column = false;

  const dispatch = createEventDispatcher();

  const closeSelf = () => {
    dispatch('close')
  }
</script>

<header>
  <Typography variant="headline5" --flex="1">{title}</Typography>
  <Button on:click={closeSelf} variant="icon"><Icon icon={faClose} /></Button>
</header>
<!-- <main style:width="75vw" style:height="75vh"> -->
<main
  style:flex-direction={column ? 'column' : undefined}
>
  <slot />
</main>


<style lang="postcss">
  header {
    display: flex;
    height: min-content;
    align-items: center;
    border-bottom: 1px solid var(--palette-divider);
    padding: 16px;
  }
  main {
    margin: 16px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 1rem;
    align-content: baseline;
    justify-content: space-around;
  }
</style>
