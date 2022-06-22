<script lang="ts">
  import { createStoreCollection, orderBy, limit, type StoreFirestoreCollection } from '$stores/firestore';

  import { getFirestore, startAfter, startAt, Timestamp } from 'firebase/firestore';

  import { getCurrentUser } from '$stores/currentUser';

  import { messageConverter, MessageData } from '$models/Message';

  import TextArea from '$components/TextArea.svelte';
  import Message from '$components/Message.svelte';
  import MessagesList from '$components/ChatBox/MessagesList.svelte';
  import { derived } from 'svelte/store';

  export let roomId: string | undefined;

  const firestore = getFirestore();

  let paginations: StoreFirestoreCollection<MessageData>[] = [];

  $: messages = roomId && createStoreCollection({
    firestore,
    converter: messageConverter,
    containtes: [orderBy('date', 'desc'), limit(10)],
    paths: ['rooms', roomId, 'messages']
  });

  // $: paginations;

  $: currentUser = getCurrentUser();

  let textAreaEl: TextArea;
  let virtualList: MessagesList;
  let loading: boolean;
  let input = '';
  const sendMessage = async () => {
    if(!input || !messages || !$currentUser){
      return
    }
    await messages.add(new MessageData({
      text: input,
      date: Timestamp.now(),
      from: currentUser.getRef()
    }))
    textAreaEl.reset();
    await virtualList.scrollToBottom();
  }
  const morePreviousMessage = async () => {
    loading = true;
    const lastDate = $nextMessages[$nextMessages.length -1]?.date || messages && $messages[$messages.length -1].date;
    if(!roomId) return;
    paginations = [...paginations, createStoreCollection({
      firestore,
      converter: messageConverter,
      containtes: [orderBy('date', 'desc'), limit(10), startAfter(lastDate)],
      paths: ['rooms', roomId, 'messages']
    })]
  }


  $:nextMessages = derived<StoreFirestoreCollection<MessageData>[], MessageData[]>(paginations, ($values, set)=>{
    set($values.flat())
  });

  $: console.log($nextMessages);
</script>

{#if messages && $messages && $messages.length && $currentUser}
  <MessagesList
    bind:this={virtualList}
    items={[...$messages, ...(nextMessages && $nextMessages || [])].reverse()}
    on:infinite={morePreviousMessage}
    bind:loading
  >
    <div slot="loader">Loading</div>
    <svelte:fragment slot="item" let:item>
      <Message
        slot="item"
        isCurrentUser={item.from.id === $currentUser.id}
        text={item.text}
        timestamp={item.date.seconds * 1000}
        from={item.from}
      />
    </svelte:fragment>
  </MessagesList>
  <TextArea
    bind:this={textAreaEl}
    bind:value={input}
    on:send={sendMessage}
  />
{/if}

<style lang="postcss">
  /* div {
    overflow: auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;

    & > :global(*:first-child) {
      margin-top: auto;
    }
  } */

  /* svelte-virtual-list-row:nth-child(1) {
    margin-top: auto;
  } */
</style>
