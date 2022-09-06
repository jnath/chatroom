<script lang="ts">
  import Avatar from '$system/Avatar/Avatar.svelte';
  import ListItemButton from '$system/List/ListItemButton.svelte';
  import ListItemText from '$system/List/ListItemText.svelte';
  import ListItemAvatar from '$system/List/ListItemAvatar.svelte';
  import Typography from '$system/Typography';
  import { createEventDispatcher } from 'svelte';

  export let id: string;
  export let picture: string;
  export let username: string;
  export let online = false;

  const dispatch = createEventDispatcher();

  const onClick = ()=>{
    dispatch('select', { id })
  }
  let binded: ListItemButton;
  export function scrollIntoView() {
    binded.scrollIntoView();
  }
</script>

<!-- <ListItem data-id={id}> -->
  <ListItemButton
    bind:this={binded}
    on:click={onClick}
    on:touchstart={onClick}
  >
    <ListItemAvatar>
      <Avatar size="xs" {username} {picture} {online} />
    </ListItemAvatar>
    <ListItemText>
      <Typography
        variant="body2"
      >
        {username}
      </Typography>
    </ListItemText>
  </ListItemButton>
<!-- </ListItem> -->
