<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$components/Button.svelte';
  import Text from '$components/Text/Text.svelte';

  export let id: string;
  export let title: string;

  const dispatch = createEventDispatcher();

  const onClick = ()=>{
    dispatch('select', { id })
  }
</script>

<Button
  on:click={onClick}
  --padding="8px"
  --background-hover="var(--background-secondary)"
>
  # {title}
</Button>

