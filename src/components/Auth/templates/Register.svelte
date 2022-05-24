<script lang="ts" context="module">
  export interface RegisterFields {
    email: string;
    password: string;
    username: string;
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Email from '../components/Email.svelte';
  import Header from '../components/Header.svelte';
  import Form from '../components/Form.svelte';
  import Button from '$system/Button/Button.svelte';
  import Password from '../components/Password.svelte';
  import ConfirmPassword from '../components/ConfirmPassword.svelte';
  import Text from '../components/Text.svelte';

  let emailValue:string;
  let passwordValue: string;
  let usernameValue: string;

  const dispatch = createEventDispatcher();

  async function send(){
    dispatch('send', {
      email: emailValue,
      password: passwordValue,
      username: usernameValue
    } as RegisterFields)
  }

</script>

<Header>Register</Header>
<Form let:valid>

  <Email bind:value={emailValue} name="email"/>
  <Password bind:value={passwordValue} name="password" />
  <ConfirmPassword name="password2" />

  <Text
    bind:value={usernameValue}
    name="username"
    placeholder="Username"
    autocomplete="nickname"
    required
    minLength={3}
  />

  <Button variant="container" on:click={send} disabled={!valid}>Registration</Button>
</Form>
<p>Login <a href="#login" >here</a></p>
