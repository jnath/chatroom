<script lang="ts">
  import Input, { Hint, email } from '$system/Input';

  export let value = '';
  export let name: string;

  export let required = false;

</script>
<Input
  bind:value
  type="email"
  {name}
  {required}
  label="Email"
  placeholder="Email"
  autocomplete="username"
  validators={[email]}
  {...$$restProps}
>
  <svelte:fragment slot="hints">
    <Hint on="email" hideWhenRequired>Email is not valid</Hint>
  </svelte:fragment>
</Input>
