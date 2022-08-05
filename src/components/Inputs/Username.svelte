<script lang="ts">
  import Input, {
    Hint,
    maxLength as maxLengthValidator,
    minLength as minLengthValidator
  } from '$system/Input';

  export let value = '';
  export let name: string;

  export let required = false;

  const placeholder = "Username";
  const maxLength = 20;
  const minLength = 3;

</script>
<Input
  bind:value
  type="text"
  {name}
  autocomplete="nickname"
  label={placeholder}
  {placeholder}
  {required}
  validators={[
    maxLengthValidator(maxLength),
    minLengthValidator(minLength)
  ]}
  {...$$restProps}
>
  <svelte:fragment slot="hints">
    <Hint on="maxLength" hideWhenRequired let:value>{placeholder} requires at max {maxLength} characters.</Hint>
    <Hint on="minLength" hideWhenRequired let:value>{placeholder} requires at least {minLength} characters.</Hint>
  </svelte:fragment>
</Input>
