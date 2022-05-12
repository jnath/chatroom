<script type="typescript">
  import type { FirebaseApp } from 'firebase/app';
  import type { AuthError } from 'firebase/auth';
  import * as firebase from 'firebase/app';
  import { initializeFirestore, type FirestoreSettings } from "firebase/firestore";

  import { getNotificationsContext } from 'svelte-notifications';

  import translations from 'firebase-error-translator/dist/languages/fr'

  import { initAuth } from '$stores/auth';

  import Auth, { type LoginFields, type RegisterFields } from '$components/Auth';
  import Chatroom from '$components/Chatroom';

  const { addNotification } = getNotificationsContext();
  type Code = keyof typeof translations;
  const getTranslation = (code: Code) => {
    let translation = translations[code];
    if (!translation) {
        translation = translations['else'];
    }
    return translation;
  };

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

  const firestore = initializeFirestore(firebaseApp, firestoreSettings);

  const { loginWithEmailPassword, logout, user } = initAuth(firebaseApp);

  function removeHash () {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
  const loginHandler = async (event: CustomEvent<LoginFields>)=>{
    const { email, password } = event.detail
    try {
      await loginWithEmailPassword(email, password);
      removeHash();
    } catch (err) {
      addNotification({
        text: getTranslation((err as AuthError).code as Code),
        position: 'top-center',
        type: 'danger'
      });
    }
  }
</script>

{#if $user}
  <Chatroom {firestore} />
{:else}
  <Auth on:send:login={loginHandler} />
{/if}
