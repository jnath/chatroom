<script type="typescript">
  import type { FirebaseApp } from 'firebase/app';
  import type { AuthError } from 'firebase/auth';
  import * as firebase from 'firebase/app';
  import { getFirestore, initializeFirestore, type FirestoreSettings } from "firebase/firestore";

  import { initAuth } from '../auth';

  import { getNotificationsContext } from 'svelte-notifications';
  const { addNotification } = getNotificationsContext();
  import translations from 'firebase-error-translator/dist/languages/fr'
  type Code = keyof typeof translations;
  const getTranslation = (code: Code) => {
    let translation = translations[code];
    if (!translation) {
        translation = translations['else'];
    }
    return translation;
  };

  import Auth, { type LoginFields, type RegisterFields } from '../components/Auth';
  import Chatroom from '../components/Chatroom';

  let firebaseApp: FirebaseApp | undefined;
  const firebaseConfig = {
    apiKey: "AIzaSyCr3quQkV-U9ikLg5_KBEzlCrjiH0j3IVs",
    authDomain: "chatroom-64934.firebaseapp.com",
    projectId: "chatroom-64934",
    storageBucket: "chatroom-64934.appspot.com",
    messagingSenderId: "10685221809",
    appId: "1:10685221809:web:b76b837d140922a6df8b90"
  };
  firebaseApp = firebase.initializeApp(firebaseConfig);
  const firestoreSettings: FirestoreSettings & { useFetchStreams: boolean } = {
                  useFetchStreams: false, /* this might not be doing anything*/
                  experimentalAutoDetectLongPolling: true /* This line fixed my issue*/
             };

  const db = initializeFirestore(firebaseApp, firestoreSettings)

  const {loginWithEmailPassword, logout, user} = initAuth(firebaseApp);
  // let error: Error | null = null;

  // const loginHandler = async (event: Event) => {
  //   const { target } = event;
  //   const { email, password } = target as HTMLFormElement
  //   try {
  //     error = null;
  //     await loginWithEmailPassword(email.value, password.value);
  //   } catch (err) {
  //     error = err as Error;
  //   }
  // };

  function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
  const loginHandler = async (event: CustomEvent<LoginFields>)=>{
    const { email, password } = event.detail
    console.log(email, password)
    try {
      await loginWithEmailPassword(email, password);
      removeHash();
    } catch (err) {
      const error = err as AuthError;
      addNotification({
        text: getTranslation(error.code as Code),
        position: 'top-center',
        type: 'danger'
      })
      console.log(error.code, error.customData, error.message, error.name)
    }
  }
</script>

{#if $user}
  <Chatroom {db} />
{:else}
  <Auth on:send:login={loginHandler} />
{/if}
<!--
<div class="wrapper">
  {#if $user}
    <div class="w-full max-w-xs">
      <div class="text-center">
        <h2>{$user.email}</h2>
        <button type="button" class="mt-3" on:click={logout}>Logout</button>
      </div>
    </div>
  {:else}
    <div class="w-full max-w-xs">
      <form
        on:submit|preventDefault={loginHandler}
        class="px-8 pt-6 pb-8 bg-white shadow-md"
      >
        <div class="mb-4">
          <label for="email">Email</label>
          <input
            class="input-field"
            id="email"
            type="email"
            placeholder="name@acme.com"
          />
        </div>
        <div class="mb-6">
          <label for="password">Password</label>
          <input
            class="input-field"
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        {#if error}
          <div transition:fade class="p-2 mb-6 bg-red-300">{error.message}</div>
        {/if}
        <div>
          <button type="submit">Sign In</button>
        </div>
      </form>
    </div>
  {/if}
</div> -->
