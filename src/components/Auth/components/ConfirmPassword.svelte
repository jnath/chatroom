<script lang="ts">
  import { Hint, required } from 'svelte-use-form';

  import Input from './Input.svelte';

  import { passwordMatch, passwordValid } from '../validators/password';

  export let name: string;
</script>

<Input
  type="password"
  {name}
  placeholder="Confirme password"
  autocomplete="new-password"
  validators={[required, passwordValid, passwordMatch]}
>
  <svelte:fragment slot='hints'>
    <Hint on="required">This is a mandatory field</Hint>
    <Hint on="passwordValid" hideWhenRequired>Passwords must containe min 8 char, Uppercase, Lowercase, 2 digit, and no space</Hint>
    <Hint on="passwordMatch" hideWhenRequired>Not match with password</Hint>
  </svelte:fragment>
</Input>
