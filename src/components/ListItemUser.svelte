<script lang="ts">
  import Avatar from '$system/Avatar/Avatar.svelte';
  import ListItemButton from '$system/List/ListItemButton.svelte';
  import ListItemText from '$system/List/ListItemText.svelte';
  import ListItemAvatar from '$system/List/ListItemAvatar.svelte';
  import ListItem from '$system/List/ListItem.svelte';
  import Typography from '$system/Typography';

  export let id: string;
  export let picture: string;
  export let username: string;
  export let online = false;
</script>

<ListItem data-id={id}>
  <ListItemButton
    on:click
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
</ListItem>
