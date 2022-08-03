<script lang="ts">
  import type { Ctx } from '@milkdown/core';

  import Button from '$system/Button';
  import Paper from '$system/Paper';
  import PaperHeader from '$system/Paper/PaperHeader.svelte';
  import Popper from '$system/Popper';

  import { listeners } from '../theme';
  import Form from '$system/Form';
  import Input from '$system/Input';
import { onDestroy, onMount } from 'svelte';

  export let ctx: Ctx;
  export let value = '';

  let listener = ctx.get(listeners.inputChipListenerCtx);
  let show = false;
  let pos = { left: 0, top: 0};
  let sendValid: (value: string)=>void;
  $: sendValid;

  onMount(()=>{
    listener.show((ctx, view, calculatePosition)=>{
      show = true;
      pos = calculatePosition();
    });
    listener.hide(()=>{
      show = false;
    });
    listener.update((ctx, _value)=>{
      value = _value;
    });

    sendValid = listener.sendValid;
  })

  onDestroy(()=>{
    listener?.removeAllListener();
  })


  const close = ()=>{
    show = false;
  }

  const save = ()=>{
    sendValid(value)
    close();
  }

</script>

{#if show}
  <Popper
    on:close={close}
    pos={{x: pos.left, y: pos.top, align: 'top'}}
    >
    <Paper elevation={3}>
      <PaperHeader
        on:close={close}
        title="Link ( edit )"
        column
        >
        <Form let:valid>
          <Input name="linkurl" placeholder="link url" required bind:value />
          <Button variant="container" on:click={save} disabled={!valid}>save</Button>
        </Form>
      </PaperHeader>
    </Paper>
  </Popper>
{/if}
