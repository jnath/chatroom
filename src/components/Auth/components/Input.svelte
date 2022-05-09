<script lang="ts">
  import { HintGroup, validators as validation, type Validator } from "svelte-use-form";

  export let value:string | undefined = undefined;
  export let name: string;
  export let validators: Validator[] = [];
</script>

<input bind:value={value} {name} {...$$restProps} use:validation={validators} />
<HintGroup for={name}>
  <slot name="hints" />
</HintGroup>

<style lang="postcss">
  input {
    background-color: rgb(232, 240, 254);
    outline: 0;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
  :global(.svelte-use-form-hint) {
    margin-bottom: 10px;
    font-size: 12px;
    color: lightcoral;
  }
</style>
