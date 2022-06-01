<script lang="ts" context="module">
  export interface RegisterFields {
    email: string;
    password: string;
    username: string;
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Form from '$system/Form';
  import Button from '$system/Button';
  import Typography from '$system/Typography';

  import Email from '$components/Inputs/Email.svelte';
  import Password from '$components/Inputs/Password.svelte';
  import ConfirmPassword from '$components/Inputs/ConfirmPassword.svelte';
  import Username from '$components/Inputs/Username.svelte';

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

<Typography variant="headline6" gutterBottom >Register</Typography>
<Form let:valid>

  <Email bind:value={emailValue} name="email" required />
  <Password bind:value={passwordValue} name="password" required />
  <ConfirmPassword name="password2" required />

  <Username bind:value={usernameValue} name="username" required />

  <Button variant="container" on:click={send} disabled={!valid}>Registration</Button>
</Form>
<p>Login <a href="#login" >here</a></p>
