<script lang="ts">
  import type { StoredUser } from '$stores/currentUser';

  import Icon from 'svelte-fa';
	import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

  import Profile from '$components/Profile';

  import Avatar from '$system/Avatar';
  import Button from '$system/Button';
  import Menu, { offset } from '$system/Menu';
  import MenuItem from '$system/Menu/MenuItem.svelte';
  import Modal from '$system/Modal';
  import Typography from '$system/Typography';
  import { logout } from '$stores/auth';
import Divider from '$system/Divider';

  export let currentUser: StoredUser;

  let buttonAvatar: HTMLButtonElement;
  let openMenu = false;
  const toogleMenu = ()=>{
    openMenu= !openMenu;
  }

  const closeMenu = ()=>{
    openMenu= false;
  }


  let openProfile = false;
  const showProfile = ()=>{
    openProfile= true;
    openMenu = false;
  }
  const closeProfile = ()=>{
    openProfile= false;
  }
</script>

{#if $currentUser}
  <Button
    variant="none" bind:el={buttonAvatar}
    class="nav-header-button"
    disabled={openMenu}
    on:click={toogleMenu}
  >
    <Avatar size="sm" username={$currentUser.username} picture={$currentUser.picture} />
    <Typography variant="body1">{$currentUser.username}</Typography>
    <Icon size="lg" icon={faArrowDown} />
  </Button>
{/if}
<Menu
  open={openMenu}
  anchor={buttonAvatar}
  on:close={closeMenu}
  options={{
    placement: "bottom-start",
    middleware: [ offset({crossAxis:10}) ]
  }}
>
  <div class="info">
    <div>
      <Avatar size="lg" username={$currentUser?.username} picture={$currentUser?.picture} />
      <Typography variant="body2" bold>{$currentUser?.username}</Typography>
    </div>
    <Typography variant="body2">{$currentUser?.email}</Typography>
  </div>
  <Divider />
  <MenuItem on:click={showProfile}>Profile</MenuItem>
  <MenuItem on:click={showProfile}>Préference</MenuItem>
  <Divider />
  <MenuItem on:click={logout}>Se deconnecter</MenuItem>
</Menu>

<Modal open={openProfile} on:close={closeProfile}>
  <Profile on:close={closeProfile} {currentUser}  />
</Modal>

<style lang="postcss">
  :global(.nav-header-button) {
    padding: 16px;
    &:hover {
      background-color: var(--palette-primary-dark);
    }
  }
  div.info {
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 16px;
    & > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
    }
  }
</style>
