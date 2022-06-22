<script lang="ts">
  import type { UserData } from '$models/User';
  import Avatar from '$system/Avatar';
  import Typography from '$system/Typography';
  import { onSnapshot, type DocumentReference } from 'firebase/firestore';
  import { onMount } from 'svelte';

  export let from: DocumentReference<UserData>;
  export let text: string;
  export let timestamp: number;
  export let isCurrentUser = false;

  let user: UserData | undefined = undefined;
  onMount(async ()=> {
    onSnapshot(from, (doc)=>{
      user = doc.data()
    })
  })
</script>

<div
  class="Message"
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
    <Typography variant="body2">{text}</Typography>
  </div>
</div>

<style lang="postcss">
  *.Message {
    display: flex;
    flex-direction: row;
    margin: 8px 16px;
    gap: 8px;
    & .details {
      flex-grow: 1;
      & .header {
        display: flex;
        flex-direction: row;
        gap: 16px;
        /* justify-content: space-between; */
      }
    }
    & > div {
      display: flex;
      flex-direction: column;
      /* gap: 4px; */
    }
    /* & > p {
      background-color: rgb(228, 230, 235);
      border-bottom-left-radius: 18px;
      border-bottom-right-radius: 18px;
      border-top-left-radius: 18px;
      border-top-right-radius: 18px;
      direction: ltr;
      display: block;
      font-size: 15px;
      line-height: 20.1px;
      overflow-wrap: break-word;
      overflow-x: hidden;
      overflow-y: hidden;
      padding-bottom: 8px;
      padding-left: 12px;
      padding-right: 12px;
      padding-top: 7px;
      position: relative;
      white-space: pre-wrap;
      word-break: break-word;
      -webkit-font-smoothing: antialiased;
      color: rgb(5, 5, 5);
      unicode-bidi: isolate;
      white-space: pre-wrap;
      width: fit-content;
    } */
  }
</style>
