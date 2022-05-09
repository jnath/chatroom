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
    flex-direction: column;
    position: relative;
  }
</style>
