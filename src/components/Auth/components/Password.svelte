<script lang="ts">
  import { Hint, required } from 'svelte-use-form';

  import Input from './Input.svelte';

  import { passwordValid } from '../validators/password';

  export let value: string;
  export let name: string;
</script>

<Input
  bind:value={value}
  type="password"
  {name}
  placeholder="Password"
  autocomplete="new-password"
  validators={[required, passwordValid]}
>
  <svelte:fragment slot='hints'>
    <Hint on="required">This is a mandatory field</Hint>
    <Hint on="passwordValid" hideWhenRequired>Passwords must containe min 8 char, Uppercase, Lowercase, 2 digit, and no space</Hint>
  </svelte:fragment>
</Input>
