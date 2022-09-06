<script lang="ts">
  import {
    orderBy,
    where,
    createStoreCollection,
  } from '$stores/firestore';

  import { roomConverter } from '$models/Room';

  import List from '$system/List/List.svelte';

  import NavContainer from '$components/NavContainer';
  import ListItemRoom from '$components/ListItemRoom.svelte';
  import ListItemUser from '$components/ListItemOneOnOne.svelte';

  import { getCurrentUser } from '$stores/currentUser';
  import Divider from '$system/Divider';

  import NavHeader from '$components/NavHeader';
  import Typography from '$system/Typography';
  import ChatBox from '$components/ChatBox';
  import { oneOnOneConverter } from '$models/OneOnOne';
  import { DocumentReference, getDocFromCache, getDocFromServer } from 'firebase/firestore';
  import Spinner from '$system/Spinner';
  import type { UserData } from '$models/User';
import Avatar from '$system/Avatar';

  const currentUserStore = getCurrentUser();
  $: currentUser = currentUserStore;

  const roomsOrdered = createStoreCollection({
    converter: roomConverter,
    containtes: [where('order', '>=', 0), orderBy('order', 'asc')],
    paths: 'rooms'
  });

  const roomsUnordered = createStoreCollection({
    converter: roomConverter,
    containtes: [where('order', '<', 0), orderBy('order', 'desc'), orderBy('title', 'asc')],
    paths: 'rooms'
  });

  $: rooms = [...$roomsOrdered || [], ...$roomsUnordered || []];

  // $: users = $currentUser && createStoreCollection({
  //   converter: userConverter,
  //   containtes: [where('id', '!=', $currentUser.id)],
  //   paths: 'users'
  // });

  $: oneOnOne = $currentUser && createStoreCollection({
    converter: oneOnOneConverter,
    containtes: [where('users', 'array-contains', currentUserStore.getRef())],
    paths: 'one-on-one'
  });

  const getUser = async (from: DocumentReference<UserData>)=>{
    let user;
    try {
      user = (await getDocFromCache(from)).data()
    } catch (error) {
      user = (await getDocFromServer(from)).data()
    }
    return user;
  }

  function notEmpty<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}

  $: oneOnOneUsers = $oneOnOne?.map((pm)=>({
    id: pm.id,
    from: pm.users.filter((user)=>user.id !== $currentUser?.id)[0]
  }))
    .filter(notEmpty)

  let selectedId: string | undefined;
  $: selectedId;

  let selectedType: string | undefined = 'rooms';
  $: selectedType;

  const onSelectRoom = ({ detail: { id }}: CustomEvent<{id: string}>) => {
    selectedType = 'rooms',
    selectedId = id
  };
  const onSelectOneOnOne = ({ detail: { id }}: CustomEvent<{id: string}>) => {
    selectedType = 'one-on-one';
    selectedId = id;
  }

  $: {
    if(!selectedId) {
      selectedId = rooms?.[0]?.id;
    }
  };

  let title = '';
  let titleAvatarUser: UserData | undefined;

  $: {
    if(selectedType === 'rooms'){
      title = `# ${rooms.find((room)=>room.id === selectedId)?.title}` || '';
    } else if( selectedType === 'one-on-one') {
      const from = oneOnOneUsers?.find((pm)=>pm.from.id !== selectedId)?.from;
      if(from){
        getUser(from).then((user)=>{
          titleAvatarUser = user;
          title = user?.username || '';
        })
      }
    }
  }
</script>

{#if $currentUser}
  <div class="wrapper">
    <header>
      {#if selectedType === 'one-on-one' && titleAvatarUser}
        <Avatar size="xs" {...titleAvatarUser} />
      {/if}
      <Typography variant="headline5">{title}</Typography>
    </header>
    <nav>
      <NavHeader {currentUser} />
      <Divider gutterBottom />
      <div class="navlists">
        <NavContainer title="Channels">
          <List>
            {#each rooms as room}
              <ListItemRoom
                id={room.id}
                title={room.title}
                selected={selectedId === room.id}
                on:select={onSelectRoom}
              />
            {/each}
          </List>
        </NavContainer>
        {#if oneOnOneUsers && oneOnOneUsers.length }
          <NavContainer title="Direct Messages">
            <List>
              {#each oneOnOneUsers as pm}
                {#await getUser(pm.from)}
                  <Spinner />
                {:then user}
                  {#if user}
                    <ListItemUser
                      id={pm.id}
                      picture={user.picture}
                      username={user.username}
                      online={user.online}
                      on:select={onSelectOneOnOne}
                    />
                  {/if}
                {/await}
              {/each}
            </List>
          </NavContainer>
        {/if}
      </div>
    </nav>
    <main class="content">
      <ChatBox type={selectedType} id={selectedId} />
    </main>
    <aside></aside>
    <footer></footer>
  </div>
{:else}
  Loading
{/if}

<style lang="postcss">
  :root{
    --border-color: var(--background-secondary);
    --header-size: 64px;
  }


  .wrapper {
    height: 100vh;
    display: grid;
    grid-template-rows: var(--header-size) calc(100vh - var(--header-size)) 0px;
    grid-template-columns: 200px calc(100vw - 200px) 0px;
    grid-template-areas:
      "nav header header"
      "nav content sidebar"
      "nav footer footer"
  }
  .content {
    grid-area: content;
    display: flex;
    flex-direction: column;
  }
  header {
    grid-area: header;
    border-bottom: 1px solid var(--palette-divider);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
  }
  nav {
    display: flex;
    flex-direction: column;
    grid-area: nav;
    border-right: 1px solid var(--palette-divider);
    overflow-y: auto;
    background-color: var(--palette-primary-main);
    color: var(--palette-primary-contrast);

    & > .navlists {
      display: flex;
      flex-direction: column;
    }
  }

  aside {
    grid-area: sidebar;
  }

  footer {
    height: 0px;
  }
</style>
