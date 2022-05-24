<script lang="ts">
  import { type Firestore, Timestamp } from 'firebase/firestore';
  import type { User } from 'firebase/auth';

  import {
    type StoreFirestoreCollection,
    orderBy,
    where,
    limit,
    createStoreCollection,
  } from '$stores/firestore';

  import scrollBottom from '$directives/scrollBottom'

  import { roomConverter } from '$models/Room';
  import { userConverter } from '$models/User';
  import { messageConverter, MessageData } from '$models/Message';

  import List from '$system/List/List.svelte';
  import Button from '$system/Button';
  import Avatar from '$system/Avatar';
  import MenuItem from '$system/Menu/MenuItem.svelte';
  import Menu from '$system/Menu';
  import Modal from '$system/Modal';

  import Message from '$components/Message.svelte';
  import TextArea from '$components/TextArea.svelte';
  import NavContainer from '$components/NavContainer';
  import Logo from '$components/Logo.svelte';
  import ListItemRoom from '$components/ListItemRoom.svelte';
  import ListItemUser from '$components/ListItemUser.svelte';
  import Profile from '$components/Profile';

  export let firestore: Firestore;
  export let user: User;

  let messagesEl: HTMLElement;
  let textAreaEl: TextArea;

  const roomsOrdered = createStoreCollection({
    firestore,
    converter: roomConverter,
    containtes: [where('order', '>=', 0), orderBy('order', 'asc')],
    paths: 'rooms'
  });
  const roomsUnordered = createStoreCollection({
    firestore,
    converter: roomConverter,
    containtes: [where('order', '<', 0), orderBy('order', 'desc'), orderBy('title', 'asc')],
    paths: 'rooms'
  });

  $: rooms = [...$roomsOrdered || [], ...$roomsUnordered || []];

  const users = createStoreCollection({
    firestore,
    converter: userConverter,
    containtes: [where('id', '!=', user.uid)],
    paths: 'users'
  });

  let messages: StoreFirestoreCollection<MessageData> | undefined;

  let input = '';
  const sendMessage = async () => {
    if(!input || !messages){
      return
    }
    messages.add(new MessageData({
      text: input,
      date: Timestamp.now(),
      userId: user.uid
    }))
    textAreaEl.reset();
    messagesEl.scrollTo({
      behavior: 'smooth',
      top: messagesEl.scrollHeight
    })
  }

  let selectedRoomId: string | undefined;
  $: selectedRoomId;

  const onSelectRoom = ({ detail: { id }}: CustomEvent<{id: string}>) => selectedRoomId = id;

  $: {
    if(!selectedRoomId) {
      selectedRoomId = rooms?.[0]?.id;
    }
    if(selectedRoomId){
      messages = createStoreCollection({
        firestore,
        converter: messageConverter,
        containtes: [orderBy('date', 'desc'), limit(100)],
        paths: ['rooms', selectedRoomId, 'messages']
      });
    }
  };

  let buttonAvatar: HTMLButtonElement;
  let openMenu = false;
  const toogleMenu = ()=>{
    openMenu= !openMenu;
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

<div class="wrapper">
  <header>
    <Logo />
    <Button
      variant="icon" bind:el={buttonAvatar}
      on:click={toogleMenu}
    >
      <Avatar username={user.displayName} picture={user.photoURL} />
    </Button>
    <Menu open={openMenu} anchor={buttonAvatar}>
      <MenuItem on:click={showProfile}>Profile</MenuItem>
      <MenuItem>Logout</MenuItem>
    </Menu>
    <Modal open={openProfile} on:click:outside={closeProfile}>
      <Profile />
    </Modal>
  </header>
  <nav>
    <NavContainer title="Rooms">
      <List>
        {#each rooms as data}
          <ListItemRoom
            {...data}
            selected={selectedRoomId === data.id}
            on:select={onSelectRoom}
          />
        {/each}
      </List>
    </NavContainer>
    <NavContainer title="Users">
      <List>
        {#each $users as data}
          <ListItemUser {...data} />
        {/each}
      </List>
    </NavContainer>
  </nav>
  {#if $messages}
    <main class="content">

      <div id="messages" use:scrollBottom bind:this={messagesEl}>
        {#each $messages as message}
          <Message {...message} />
        {/each}
      </div>
      <TextArea
        bind:this={textAreaEl}
        bind:value={input}
        on:send={sendMessage}
        />
      </main>
    {/if}
  <aside></aside>
  <footer></footer>
</div>

<style lang="postcss">
  :root{
    --border-color: var(--background-secondary);
    --header-size: 64px;
  }

  #messages {
    overflow: auto;
    flex-grow: 1;
  }
  .wrapper {
    height: 100vh;
    display: grid;
    grid-template-rows: var(--header-size) calc(100vh - var(--header-size)) 0px;
    grid-template-columns: 200px calc(100vw - 200px) 0px;
    grid-template-areas:
      "header header header"
      "nav content sidebar"
      "footer footer footer"
  }
  .content {
    grid-area: content;
    display: flex;
    flex-direction: column;
  }
  header {
    grid-area: header;
    background: white;
    border-bottom: 1px solid var(--palette-divider);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    grid-area: nav;
    background: white;
    border-right: 1px solid var(--palette-divider);
    overflow-y: auto;

    & > :global(*:not(:last-child)){
      border-bottom: 1px solid var(--palette-divider);
    }
  }

  aside {
    grid-area: sidebar;
  }

  footer {
    height: 0px;
  }
</style>
