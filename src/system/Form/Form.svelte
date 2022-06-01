<script lang="ts">
  import { useForm } from "svelte-use-form";

  const form = useForm();
</script>

<form use:form>
  <slot valid={$form.valid} />
</form>

<style lang="postcss">
  form {
    display: flex;
    flex-direction: var(--form-flex-direction, column);
    position: relative;
    gap: 16px;
  }
</style>
