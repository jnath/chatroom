<script lang="ts" context="module">
  export interface LoginFields {
    email: string;
    password: string;
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Form from '$system/Form';
  import Button from '$system/Button';
  import Typography from '$system/Typography';

  import Email from '$components/Inputs/Email.svelte';
  import Password from '$components/Inputs/Password.svelte';

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

<Typography variant="headline6" gutterBottom >Login</Typography>
<Form let:valid >
  <Email bind:value={emailValue} name="email" required/>
  <Password bind:value={passwordValue} name="password" required/>

  <Button
    variant="container"
    on:click={send}
    disabled={!valid}
  >Login</Button>
</Form>
<p>Create account <a href="#register" >here</a></p>
