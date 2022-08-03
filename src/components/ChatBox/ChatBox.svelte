<script lang="ts">
  import type { SendEventData } from '$system/Messaging/Editor/Editor.svelte';
  import { derived } from 'svelte/store';

  import { createStoreCollection, orderBy, limit, type StoreFirestoreCollection } from '$stores/firestore';

  import { startAfter, Timestamp } from 'firebase/firestore';

  import { getCurrentUser } from '$stores/currentUser';

  import { messageConverter, MessageData } from '$models/Message';

  import Message from '$components/Message.svelte';
  import MessagesList from '$components/ChatBox/MessagesList.svelte';
  import Editor from '$system/Messaging/Editor';

  export let roomId: string | undefined;

  let paginations: StoreFirestoreCollection<MessageData>[] = [];

  let messageStore: StoreFirestoreCollection<MessageData>;
  let prevRoomId: string | undefined;
  $: {
    if(roomId && prevRoomId !== roomId) {
      const initNumberOfMessages = Math.ceil(document.body.offsetHeight / 60) + 5;
      messageStore = createStoreCollection({
        converter: messageConverter,
        containtes: [orderBy('date', 'desc'), limit(initNumberOfMessages)],
        paths: ['rooms', roomId, 'messages']
      });
      paginations = [messageStore];
    }
    prevRoomId = roomId;
  }

  $: messages = derived<StoreFirestoreCollection<MessageData>[], MessageData[]>(
    paginations,
    ($values)=> $values.flat()
  );

  $: currentUser = getCurrentUser();

  let virtualList: MessagesList;
  let loading: boolean;

  const sendMessage = async (e: CustomEvent<SendEventData>) => {
    const data = e.detail;
    if(!messages || !$currentUser){
      return
    }

    await messageStore.add(new MessageData({
      text: data.text,
      attachements: data.attachements,
      date: Timestamp.now(),
      from: currentUser.getRef()
    }))

    data.sended();
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

  let showTextEditing: boolean;

  $: paddingListBottom = 0;

  $: {
    setTimeout(()=>{
      paddingListBottom = showTextEditing ? 24 : 0
    }, 300)
  }

</script>

{#if $messages?.length && $currentUser}
  {#key roomId}
    <MessagesList
      bind:this={virtualList}
      items={[...$messages].reverse()}
      on:infinite={morePreviousMessage}
      bind:loading
      bind:paddingListBottom
    >
      <div slot="loader">Loading</div>
      <svelte:fragment slot="item" let:item>
        <Message
          slot="item"
          isCurrentUser={item.from.id === $currentUser.id}
          text={item.text}
          timestamp={item.date.seconds * 1000}
          from={item.from}
          attachements={item.attachements}
        />
      </svelte:fragment>
    </MessagesList>
  {/key}
  <Editor
    on:send={sendMessage}
    bind:showTextEditing
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
