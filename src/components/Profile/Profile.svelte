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

  export let currentUser: StoredUser;
  const storage = getStorage();
  $: avatarRef = $currentUser && ref(storage, `users/${$currentUser.id}/avatar.png`);

  $: file = files?.[0];
  $: openAvatarEditor = !!file;
  let dataUrl = '';

  const onSave = async ()=>{
    if(!avatarRef){
      return;
    }
    // updateProfile()
    const snapshot = await uploadString(avatarRef, dataUrl, 'data_url', {contentType: 'image/png'});
    const downloadURL = await getDownloadURL(snapshot.ref);

    await currentUser.updateProfile({
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
  let oldPasswordValue: string;
  let passwordValue: string;
  let usernameValue: string;

  const saveNewEmail = () => {
    currentUser.updateEmail(emailValue);
  }

  const saveNewPassword = () => {
    return
  }

  const saveNewUsername = () => {
    currentUser.updateProfile({
      displayName: usernameValue
    });
  }

  let openChangePassword = false;
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
    {#if $currentUser}
      <div class="Avatar">
        <AvatarUploader
          username={$currentUser.username}
          picture={$currentUser.picture}
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
          <Email bind:value={emailValue} placeholder={$currentUser.email} name="email" required/>
          {#if valid}
            <Button variant="container" on:click={saveNewEmail} disabled={!valid}>save</Button>
          {/if}
        </Form>
        <Divider />
        <Form let:valid>
          <Username bind:value={usernameValue} placeholder={$currentUser.username} name="username" />
          {#if valid}
            <Button variant="container" on:click={saveNewUsername} disabled={!valid}>save</Button>
          {/if}
        </Form>
        <Divider />
        <Button on:click={()=>openChangePassword = true}>Change password</Button>
        <Modal open={openChangePassword} on:close={()=>openChangePassword = false}>
          <Paper elevation={3}>
            <div
              style:margin="16px"
            >
              <Form let:valid>
                <Password
                  bind:value={oldPasswordValue}
                  label="Old password"
                  placeholder="Old password"
                  name="old-password"
                  required
                />
                <Password
                  bind:value={passwordValue}
                  label="New password"
                  placeholder="New password"
                  name="password"
                  required
                />
                <ConfirmPassword
                  label="Confirme new password"
                  placeholder="Confirme new password"
                  name="password2"
                  required
                />
                <div
                  style:display="flex"
                  style:gap="8px"
                  style:justify-content="flex-end"
                >
                  <Button on:click={closeAvatarEditor}>Annuler</Button>
                  <Button variant="container" on:click={saveNewPassword} disabled={!valid}>save</Button>
                </div>
              </Form>
            </div>
          </Paper>
        </Modal>
      </div>
    {/if}
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

