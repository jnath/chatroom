<script lang="ts">
  import { getDocs, query, type Firestore } from 'firebase/firestore';

  import { onDestroy, onMount } from 'svelte';
  import { collection, addDoc, doc, onSnapshot, type Unsubscribe } from "firebase/firestore";

  import Message from '../Message.svelte';
  import TextArea from '../TextArea.svelte';

  export let db: Firestore;

  let messages: string[];
  $: messages = [];

  let unsubscribe: Unsubscribe;

  onMount(async ()=>{

    // unsub = onSnapshot(doc(db, "message"), (doc) => {
    //     console.log("Current data: ", doc.data());
    // });
    // const querySnapshot = await getDocs(collection(db, "messages"));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });

    const q = query(collection(db, "messages"));

    // unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   console.log('totototototototo')
    //   querySnapshot.forEach((doc) => {
    //       console.log(doc.data())
    //   });
    // });

    // onSnapshot(q, (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     console.log('do change')
    //     console.log(change);

    //   });
    // });

    onSnapshot(q, (snapshot) => {
      console.log('snap', snapshot);
      snapshot.docChanges().forEach((change) => {
        console.log('change', change);
        messages = [...messages, change.doc.data().message]
      });
    });
  })

  let input = '';


  const sendMessage = async ()=>{
    console.log('send', input);
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        message: input
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    input = ''
  }

  onDestroy(()=>{
    unsubscribe && unsubscribe();
  })
</script>

<div class="wrapper">
  <aside class="sidebar-first"></aside>
  <main class="main">
    <div id="messages">
      {#each messages as message}
        <Message {message}/>
      {/each}
    </div>
    <TextArea bind:value={input} on:send={sendMessage} />
  </main>
  <aside class="sidebar-second">Sidebar second: Fixed width</aside>
</div>

<style lang="postcss">
  #messages{
    flex: 1;
    overflow: auto;
  }
  .wrapper{
    height: 100vh;
    display: flex;
    flex-direction: row;
  }
  .main{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sidebar-first{
    width: 50px;
    background: rgb(24, 24, 24);
  }
  .sidebar-second{
    width: 0%;
    overflow: auto;
    &.open {
      width: 30%;
    }
    background: rgb(255, 255, 255);

  }
</style>
