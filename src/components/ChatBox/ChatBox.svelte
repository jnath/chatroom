<script lang="ts">
  import { createStoreCollection, orderBy, limit, type StoreFirestoreCollection } from '$stores/firestore';

  import { startAfter, Timestamp } from 'firebase/firestore';

  import { getCurrentUser } from '$stores/currentUser';

  import { messageConverter, MessageData } from '$models/Message';

  import TextArea from '$components/TextArea.svelte';
  import Message from '$components/Message.svelte';
  import MessagesList from '$components/ChatBox/MessagesList.svelte';
  import { derived } from 'svelte/store';

  export let roomId: string | undefined;

  let paginations: StoreFirestoreCollection<MessageData>[] = [];

  let addMessage: (doc: MessageData) => Promise<void>;
  let prevRoomId: string | undefined;
  $: {
    if(roomId && prevRoomId !== roomId) {
      const initNumberOfMessages = Math.ceil(document.body.offsetHeight / 60) + 5;
      const init = createStoreCollection({
        converter: messageConverter,
        containtes: [orderBy('date', 'desc'), limit(initNumberOfMessages)],
        paths: ['rooms', roomId, 'messages']
      });
      addMessage = init.add;
      paginations = [init];
    }
    prevRoomId = roomId;
  }

  $: messages = derived<StoreFirestoreCollection<MessageData>[], MessageData[]>(
    paginations,
    ($values)=> $values.flat()
  );

  $: currentUser = getCurrentUser();

  let textAreaEl: TextArea;
  let virtualList: MessagesList;
  let loading: boolean;
  let input = '';
  const sendMessage = async () => {
    if(!input || !messages || !$currentUser){
      return
    }
    await addMessage(new MessageData({
      text: input,
      date: Timestamp.now(),
      from: currentUser.getRef()
    }))
    textAreaEl.reset();
    await virtualList.scrollToBottom();
  }

  let prevLastDate: Timestamp;
  const morePreviousMessage = async () => {
    const lastDate = $messages[$messages.length -1].date;
    if(!roomId || prevLastDate === lastDate) return;
    loading = true;
    paginations = [...paginations, createStoreCollection({
      converter: messageConverter,
      containtes: [orderBy('date', 'desc'), limit(10), startAfter(lastDate)],
      paths: ['rooms', roomId, 'messages']
    })]
    messages.subscribe(()=>{
      loading = false;
    })
    prevLastDate = lastDate;
  }
</script>

{#if $messages?.length && $currentUser}
  <MessagesList
    bind:this={virtualList}
    items={[...$messages].reverse()}
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
