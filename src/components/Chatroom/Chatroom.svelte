<script lang="ts">
  import type { Firestore } from 'firebase/firestore';

  import { create, type StoreFirestore } from '$stores/firestore';

  import scrollBottom from '$directives/scrollBottom'

  import { roomConverter } from '$models/Room';
  import { userConverter } from '$models/User';
  import { messageConverter, MessageData } from '$models/Message';

  import Message from '$components/Message.svelte';
  import TextArea from '$components/TextArea.svelte';
  import NavContainer from '$components/NavContainer';
  import Room from '$components/Room.svelte';
  import User from '$components/User.svelte';
  import List from '$components/List.svelte';
  import Logo from '$components/Logo.svelte';
import Typography from '$components/Typography';

  export let firestore: Firestore;

  let messagesEl: HTMLElement;
  let textAreaEl: TextArea;

  const rooms = create(firestore, roomConverter, 'rooms');
  const users = create(firestore, userConverter, 'users');

  let messages: StoreFirestore<MessageData> | undefined;

  let input = '';
  const sendMessage = async () => {
    if(!input || !messages){
      return
    }
    messages.add(new MessageData({ text: input }))
    textAreaEl.reset();
    messagesEl.scrollTo({
      behavior: 'smooth',
      top: messagesEl.scrollHeight
    })
  }

  const onSelectRoom = ({ detail: { id }}: CustomEvent<{id: string}>)=>{
    messages = create(firestore, messageConverter, 'rooms', id, 'messages')
  }
</script>

<div class="wrapper">
  <header>
    <Logo />
  </header>
  <nav>
    <NavContainer title="Rooms">
      <List>
        {#each $rooms as data}
          <Room {...data} on:select={onSelectRoom} />
        {/each}
      </List>
    </NavContainer>
    <List>
      <Typography
        tag="h3"
        --transform='uppercase'
        --padding="0 0 0 8px"
      >Users</Typography>
      {#each $users as data}
        <User {...data} />
      {/each}
    </List>
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
    border-bottom: 1px solid var(--border-color);
    padding: 16px;
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
    grid-area: nav;
    background: white;
    border-right: 1px solid var(--border-color);
    overflow-y: auto;

    & > :global(*:not(:last-child)){
      border-bottom: 1px solid var(--border-color);
    }
  }

  aside {
    grid-area: sidebar;
  }

  footer {
    height: 0px;
  }
</style>
