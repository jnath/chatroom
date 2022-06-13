<script lang="ts">
  import Input, { Hint, passwordMatch, passwordValid } from '$system/Input';

  export let name: string;
  export let required = false;
</script>

<Input
  type="password"
  {name}
  label="Confirme password"
  placeholder="Confirme password"
  autocomplete="new-password"
  {required}
  validators={[
    passwordValid,
    passwordMatch
  ]}
  {...$$restProps}
>
  <svelte:fragment slot='hints'>
    <Hint on="passwordValid" hideWhenRequired>Passwords must containe min 8 char, Uppercase, Lowercase, 2 digit, and no space</Hint>
    <Hint on="passwordMatch" hideWhenRequired>Not match with password</Hint>
  </svelte:fragment>
</Input>
