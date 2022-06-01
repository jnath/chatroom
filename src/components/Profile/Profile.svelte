<script lang="ts">
  import type { StoredUser } from '$stores/currentUser';

  import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

  import { createEventDispatcher } from 'svelte';

  import Icon from 'svelte-fa';
	import { faClose } from '@fortawesome/free-solid-svg-icons';

  import Button from '$system/Button';
  import Paper from '$system/Paper/Paper.svelte';
  import Typography from '$system/Typography';
  import AvatarEditor from '$system/Avatar/AvatarEditor.svelte';
  import AvatarUploader from '$system/Avatar/AvatarUploader.svelte';
  import Modal from '$system/Modal';
  import Form from '$system/Form';
  import Divider from '$system/Divider';

  import Email from '$components/Inputs/Email.svelte';
  import Password from '$components/Inputs/Password.svelte';
  import ConfirmPassword from '$components/Inputs/ConfirmPassword.svelte';
  import Username from '$components/Inputs/Username.svelte';

  let files: FileList | undefined = undefined;

  export let storedUser: StoredUser;
  const storage = getStorage();
  $: avatarRef = $storedUser && ref(storage, `users/${$storedUser.id}/avatar.png`);

  $: file = files?.[0];
  $: openAvatarEditor = !!file;
  let dataUrl = '';

  const onSave = async ()=>{
    // updateProfile()
    console.log(dataUrl)
    const snapshot = await uploadString(avatarRef, dataUrl, 'data_url', {contentType: 'image/png'});
    console.log(snapshot)
    const downloadURL = await getDownloadURL(snapshot.ref);

    await storedUser.updateProfile({
      photoURL: downloadURL
    })

    closeAvatarEditor();
  }

  const dispatch = createEventDispatcher();

  const closeAvatarEditor = ()=>{
    openAvatarEditor = false;
  }

  const closeSelf = () => {
    dispatch('close')
  }

  let emailValue:string;
  let passwordValue: string;
  let usernameValue: string;

  const saveNewEmail = () => {
    return
  }

  const saveNewPassword = () => {
    return
  }

  const saveNewUsername = () => {
    return
  }
</script>

<Paper elevation={2} >
  <header>
    <Typography variant="headline5" --flex="1">Profile</Typography>
    <Button on:click={closeSelf} variant="icon"><Icon icon={faClose} /></Button>
  </header>
  <main
    style:width="75vw"
    style:height="75vh"
  >
    <div class="Avatar">
      <AvatarUploader
        username={$storedUser.username}
        picture={$storedUser.picture}
        bind:files
      />
      <Modal open={openAvatarEditor} on:close={closeAvatarEditor}>
        <Paper elevation={3} >
          <div
            style:margin="16px"
          >
            <AvatarEditor bind:dataUrl image={file} />
            <div
              style:display="flex"
              style:gap="8px"
              style:justify-content="flex-end"
            >
              <Button on:click={closeAvatarEditor}>Annuler</Button>
              <Button on:click={onSave}>Save</Button>
            </div>
          </div>
        </Paper>
      </Modal>
    </div>
    <div class="Infos">
      <Typography variant="headline5">Informations personelle</Typography>
      <Form let:valid>
        <Email bind:value={emailValue} name="email" required/>
        {#if valid}
          <Button variant="container" on:click={saveNewEmail} disabled={!valid}>save</Button>
        {/if}
      </Form>
      <Divider />
      <Form let:valid>
        <Password bind:value={passwordValue} name="password" required/>
        <ConfirmPassword name="password2" required />
        {#if valid}
          <Button variant="container" on:click={saveNewPassword} disabled={!valid}>save</Button>
        {/if}
      </Form>
      <Divider />
      <Form let:valid>
        <Username bind:value={usernameValue} name="username" />
        {#if valid}
          <Button variant="container" on:click={saveNewUsername} disabled={!valid}>save</Button>
        {/if}
      </Form>
    </div>
  </main>
</Paper>

<style lang="postcss">
  header {
    display: flex;
    height: min-content;
    align-items: center;
    border-bottom: 1px solid var(--palette-divider);
    padding: 16px;
  }
  main {
    margin: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-content: baseline;
    justify-content: space-around;

    & .Avatar {
      flex: 0;
      height: max-content;
    }
    & .Infos {
      flex:1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 300px;
      max-width: 800px;
    }
  }
</style>

