<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '$components/Button.svelte';
  import Text from '$components/Text/Text.svelte';
  import Avatar from '$components/Avatar.svelte';

  export let id: string;
  export let picture: string;
  export let name: string;
  export let online = false;

  const dispatch = createEventDispatcher();

  const onClick = ()=>{
    dispatch('select', { id })
  }
</script>

<Button
  on:click={onClick}
  --padding='8px'
  --background-hover="var(--background-secondary)"
>
  <Avatar {name} {picture} {online} />
  <p>{name}</p>
</Button>

<style lang="postcss">
  p {

  }
</style>
