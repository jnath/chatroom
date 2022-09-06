<script lang="ts">
  import type { SendEventData } from '$components/Messaging/Editor/Editor.svelte';
  import { derived } from 'svelte/store';

  import { createStoreCollection, orderBy, limit, type StoreFirestoreCollection } from '$stores/firestore';

  import { startAfter, Timestamp } from 'firebase/firestore';

  import { getCurrentUser } from '$stores/currentUser';

  import { messageConverter, MessageData } from '$models/Message';

  import Message from '$components/Message.svelte';
  import MessagesList from '$components/ChatBox/MessagesList.svelte';
  import Editor from '$components/Messaging/Editor';
  import { debounce } from '$helpers/debounce';

  export let id: string | undefined;
  export let type: string | undefined;

  let paginations: StoreFirestoreCollection<MessageData>[] = [];

  let messageStore: StoreFirestoreCollection<MessageData>;
  let prevRoomId: string | undefined;
  $: {
    if(type && id && prevRoomId !== id) {
      const initNumberOfMessages = Math.ceil(document.body.offsetHeight / 60) + 5;
      messageStore = createStoreCollection({
        converter: messageConverter,
        containtes: [orderBy('date', 'desc'), limit(initNumberOfMessages)],
        paths: [type, id, 'messages']
      });
      paginations = [messageStore];
    }
    prevRoomId = id;
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

    await data.sended();
    await virtualList.scrollToBottom();
  }

  let prevLastDate: Timestamp;
  const morePreviousMessage = async () => {
    const lastDate = $messages[$messages.length -1].date;
    if(!type || !id || prevLastDate === lastDate) return;
    loading = true;
    paginations = [...paginations, createStoreCollection({
      converter: messageConverter,
      containtes: [orderBy('date', 'desc'), limit(10), startAfter(lastDate)],
      paths: [type, id, 'messages']
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

  let isBottom = true;
  let isScrolling = false;

  const onMounted = debounce(async ()=>{
    if(!isScrolling){
      await virtualList.scrollToBottom();
    }
  })
</script>

{#if id && $messages?.length && $currentUser}
  {#key id}
    <MessagesList
      bind:this={virtualList}
      items={[...$messages].reverse()}
      on:infinite={morePreviousMessage}
      bind:loading
      bind:paddingListBottom
      bind:isBottom
      bind:isScrolling
    >
      <svelte:fragment slot="item" let:item>
        <Message
          on:mounted={onMounted}
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
<!--
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
</style> -->
