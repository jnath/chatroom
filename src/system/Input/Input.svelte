<script lang="ts">
  import {
    type Validator,
    HintGroup,
    Hint,
    validators as validation,
    required as requiredValidator,
  } from 'svelte-use-form';

  export let value:string | undefined = undefined;
  export let name: string;
  export let label: string | undefined = undefined;
  export let placeholder: string;
  export let required = false;
  export let validators: Validator[] = [];
</script>

<div>
  {#if label}
    <label for={name}>{label}</label>
  {/if}
  <input
    bind:value
    id={name}
    {name}
    {placeholder}
    {...$$restProps}
    use:validation={[
      ... required ? [requiredValidator] : [],
      ...validators
    ]}
  />
  <HintGroup for={name}>
    {#if required}
    <Hint on="required">This is a mandatory field</Hint>
    {/if}
    <slot name="hints" />
  </HintGroup>
</div>

<style lang="postcss">
  @import '../styles/mixin.css';
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    label {
      @mixin font body2;
    }

    input {
      background-color: rgb(232, 240, 254);
      outline: 0;
      width: 100%;
      border: 0;
      margin: 0;
      padding: 15px;
      box-sizing: border-box;
      font-size: 14px;
    }
  }
  :global(.svelte-use-form-hint) {
    margin-bottom: 10px;
    font-size: 12px;
    color: lightcoral;
  }
</style>
