<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Icon from 'svelte-fa';
	import { faClose } from '@fortawesome/free-solid-svg-icons';

  import Button from '$system/Button';
  import Paper from '$system/Paper/Paper.svelte';
  import Typography from '$system/Typography';
  import Modal from '$system/Modal';

  const dispatch = createEventDispatcher();

  export let title = '';
  export let open = false;
  export let callback: (value?: unknown)=>void = ()=>void(0);

  const closeSelf = () => {
    open = false;
    dispatch('closed')
  }

  const valid = (value: unknown) => {
    callback(value);
    closeSelf();
  }
</script>

<Modal {open} on:close={closeSelf} >
  <Paper elevation={2} >
    <header>
      <Typography variant="headline5" --flex="1">{title}</Typography>
      <Button on:click={closeSelf} variant="icon"><Icon icon={faClose} /></Button>
    </header>
    <!-- <main style:width="75vw" style:height="75vh"> -->
    <main>
      <slot cancel={closeSelf} ok={valid} />
    </main>
  </Paper>
</Modal>

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
    flex-wrap: wrap;
    gap: 1rem;
    align-content: baseline;
    justify-content: space-around;
  }
</style>

