<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ListItemButton from '$system/List/ListItemButton.svelte';
  import ListItemText from '$system/List/ListItemText.svelte';
  import Typography from '$system/Typography';

  export let id: string;
  export let title: string;
  export let selected = false;
  const dispatch = createEventDispatcher();

  const onClick = ()=>{
    dispatch('select', { id })
  }
</script>

<ListItemButton
  {selected}
  dense
  on:click={onClick}
  on:touchstart={onClick}
>
  <ListItemText>
    <Typography
      variant="body2"
    >
      # {title}
    </Typography>
  </ListItemText>
</ListItemButton>

