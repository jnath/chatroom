<script lang="ts" context="module">
  export interface LoginFields {
    email: string;
    password: string;
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Header from '../components/Header.svelte';
  import Form from '../components/Form.svelte';
  import Email from '../components/Email.svelte';
  import Password from '../components/Password.svelte';
  import Button from '$system/Button/Button.svelte';

  let emailValue:string;
  let passwordValue: string;


  const dispatch = createEventDispatcher();

  async function send(){
    dispatch('send', {
      email: emailValue,
      password: passwordValue
    } as LoginFields)
  }

</script>

<Header>Login</Header>
<Form let:valid >
  <Email bind:value={emailValue} name="email"/>
  <Password bind:value={passwordValue} name="password" />

  <Button
    variant="container"
    on:click={send}
    disabled={!valid}
  >Login</Button>
</Form>
<p>Create account <a href="#register" >here</a></p>
