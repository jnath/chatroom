<script lang="ts">
  import type { Validator } from 'svelte-use-form';
  import {
    Hint,
    required as requiredValidator,
    maxLength as maxLengthValidator,
    minLength as minLengthValidator
  } from 'svelte-use-form';

  import Input from './Input.svelte';
  export let value: string;
  export let name: string;
  export let placeholder: string;
  export let autocomplete: string;

  export let required = false;
  export let maxLength = 0;
  export let minLength = 0;

  const validators: Validator[] = [];

  if(required){
    validators.push(requiredValidator)
  }

  if(maxLength > 0){
    validators.push(maxLengthValidator(maxLength));
  }

  if(minLength > 0){
    validators.push(minLengthValidator(minLength));
  }
</script>
<Input
  bind:value={value}
  type="text"
  {name}
  {placeholder}
  {autocomplete}
  {validators}
>
  <svelte:fragment slot="hints">
    {#if required}
      <Hint on="required">This is a mandatory field</Hint>
    {/if}
    {#if maxLength}
      <Hint on="maxLength" hideWhenRequired let:value>{placeholder} requires at max {maxLength} characters.</Hint>
    {/if}
    {#if minLength}
      <Hint on="minLength" hideWhenRequired let:value>{placeholder} requires at least {minLength} characters.</Hint>
    {/if}
  </svelte:fragment>
</Input>
