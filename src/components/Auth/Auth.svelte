<script lang="ts" context="module">
  export enum Template {
    login = 'login',
    register = 'register'
  }
  export type { LoginFields } from './templates/Login.svelte';
  export type { RegisterFields } from './templates/Register.svelte';
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Login, { type LoginFields} from './templates/Login.svelte';
  import Register, { type RegisterFields } from './templates/Register.svelte';
  import { page } from "$app/stores";
  import Paper from '$system/Paper';

  let templateName: Template;
  $: templateName = $page.url.hash?.slice(1) as Template || Template.login

  const dispatch = createEventDispatcher()

  const send = (templateName:Template) => (event: CustomEvent<LoginFields | RegisterFields>) => {
    switch(templateName){
      case Template.login:
        dispatch('send:login', event.detail);
        break;
      case Template.register:
        dispatch('send:register', event.detail);
      break;
      default:
      break;
    }
  }

  const templates = {
    login: Login,
    register: Register
  }

  $: template = templates[templateName];
</script>

<div class="Container">
  <div id="Logo"><img src="/logo.png" alt="logo" /></div>
  <Paper elevation={3}>
    <div class="Form">
      <svelte:component this={template} on:send={send(templateName)} />
    </div>
  </Paper>
</div>

<style lang="postcss">
  .Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  #Logo {
    position: relative;
    z-index: 2;
    & > img {
      position: absolute;
      transform: translate(-50%, -90%);
    }
  }
  .Form {
    z-index: 1;
    background: #FFFFFF;
    max-width: 360px;
    min-width: 190px;
    margin: 0 auto;
    padding: 45px;
    text-align: center;
  }
</style>
