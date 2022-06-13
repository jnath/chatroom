<script lang="ts">
  import Input, { passwordValid, Hint } from '$system/Input';

  export let value: string;
  export let name: string;

  export let required = false;
</script>

<Input
  bind:value={value}
  type="password"
  {name}
  label="Password"
  placeholder="Password"
  autocomplete="new-password"
  {required}
  validators={[passwordValid]}
  {...$$restProps}
>
  <svelte:fragment slot='hints'>
    <Hint on="passwordValid" hideWhenRequired>Passwords must containe min 8 char, Uppercase, Lowercase, 2 digit, and no space</Hint>
  </svelte:fragment>
</Input>
