<script lang="ts">

  import { Hint, required, email } from 'svelte-use-form';
  import Input from './Input.svelte';

  export let value: string;
  export let name: string;

</script>
<Input
  bind:value={value}
  type="email"
  {name}
  placeholder="Email"
  autocomplete="username"
  validators={[required, email]}
>
  <svelte:fragment slot="hints">
    <Hint on="required">This is a mandatory field</Hint>
    <Hint on="email" hideWhenRequired>Email is not valid</Hint>
  </svelte:fragment>
</Input>
