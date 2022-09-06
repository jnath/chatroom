<script lang="ts">
  import type { AttachementData } from '$models/Attachement';

  import type { UserData } from '$models/User';
  import Avatar from '$system/Avatar';
  import { Viewer } from '$components/Messaging';
  import Attachements from '$components/Messaging/Viewer/Attachements.svelte';
  import Typography from '$system/Typography';
  import { getDocFromCache, getDocFromServer, type DocumentReference } from 'firebase/firestore';
  import { createEventDispatcher, onMount, tick } from 'svelte';

  export let from: DocumentReference<UserData>;
  export let text: string;
  export let attachements: DocumentReference<AttachementData>[];
  export let timestamp: number;
  export let isCurrentUser = false;

  let user: UserData | undefined = undefined;

  let files: Record<number, AttachementData | undefined> = {};
  $: hasFiles = attachements && attachements.length;

  const dispatched = [false, false];

  const dispatch = createEventDispatcher();

  const onViewerMounted = ()=>{
    if(!dispatched[0]){
      dispatched[0] = true;
    }
    if(dispatched[0] && dispatched[1]){
      dispatch('mounted');
    }
  }

  onMount(async ()=> {
    try {
      user = (await getDocFromCache(from)).data()
    } catch (error) {
      user = (await getDocFromServer(from)).data()
    }

    attachements?.forEach(async (attachement, i)=>{
      if(files[i]) return;
      let data;
      try {
        data = (await getDocFromCache(attachement)).data()
      } catch (error) {
        data = (await getDocFromServer(attachement)).data()
      }
      files = {
        ...files,
        [i]: data
      };
    })
    await tick();

    if(dispatched[0] && !dispatched[1]){
      dispatched[1] = true;
    }
    if(dispatched[0] && dispatched[1]){
      dispatch('mounted');
    }
    return ()=>{
      files = {};
    }
  })

  function notEmpty<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}

  $: attaches = hasFiles && Object.values(files).filter(notEmpty).map(({ src, name})=>({ src, name})) || null;
</script>

<message
  class:isCurrentUser
>
  <Avatar size="md" username={user?.username} picture={user?.picture} />
  <div class="details">
    <div class="header">
      <Typography variant="body2" bold >
        {isCurrentUser ? 'Moi' : user?.username || 'Anonymous'}
      </Typography>
      <Typography variant="body2">
        {new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short', dateStyle:'medium' }).format(new Date(timestamp))}
      </Typography>
    </div>
    {#key text}
      <Viewer on:mounted={onViewerMounted} value={text} />
    {/key}
    <Attachements bind:attachements={attaches} />

    <!-- <Typography variant="body2">{text}</Typography> -->
  </div>
</message>

<style lang="postcss">
  message {
    display: flex;
    flex-direction: row;
    margin: 8px 16px;
    gap: 8px;
    & .details {
      overflow: hidden;
      flex-grow: 1;

      & .header {
        display: flex;
        flex-direction: row;
        gap: 16px;
      }
    }
    & > div {
      display: flex;
      flex-direction: column;
    }
  }
</style>
