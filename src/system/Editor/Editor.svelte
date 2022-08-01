<script lang="ts" context="module">
  export interface SendEventData {
    text: string;
    attachements: FileUploadResult[];
    sended:()=>void;
  }
</script>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Controls from '$system/Editor/Controls.svelte';
  import Content, { SupportedKeys, commands } from '$system/Editor/Content.svelte';
  import Toolbar, { type Cmd } from '$system/Editor/Toolbar.svelte';
  import Dialog from '$system/Dialog';
  import Form from '$system/Form';
  import Input from '$system/Input';
  import Button from '$system/Button';
  import { editorViewCtx, type Ctx } from '@milkdown/core';
  import twemoji from 'twemoji';
  import Attachements, { uploadWithFilelist, type FileUploadResult } from '$system/Editor/Attachements.svelte';

  const dispatch = createEventDispatcher();

  let content: Content;
  let ctx: Ctx;


  export let contentValue = '';
  let attachements: FileUploadResult[] = [];
  $:attachements;

  let attachementsLoaded: boolean;

  const onContentMounted = ()=>{
    const localStorageShowTextEditing = localStorage.getItem('showTextEditing');
    showTextEditing = localStorageShowTextEditing !== null ? JSON.parse(localStorageShowTextEditing) : false;
  }


  const onEmojiSelected = ({detail: emoji}: CustomEvent) => {
    const editorView = ctx.get(editorViewCtx);

    const { from } = editorView.state.selection

    const { tr } = editorView.state;
    const html = twemoji.parse(emoji.emoji, {
      folder: 'svg',
      ext: '.svg',
      attributes: (title:string)=>({title})
    });
    const node = editorView.state.schema.node('emoji', { html });

    editorView.dispatch(tr.insert(from, node));

  }

  export let status: 'sending' | 'idle' | 'want-send'  = 'idle';

  const send = ()=>{
    if(!contentValue){
      console.log('no text insered')
      return
    }

    status = 'want-send';
  }

  const processSend = ()=>{
    status = 'sending';
    dispatch('send', {
      text: contentValue,
      attachements,
      sended:()=>{
        content.reset();
        status = 'idle';
      }
    } as SendEventData);
  }

  $: {
    if(
      status === 'want-send'
    ) {
      if(attachements.length > 0){
        if(attachementsLoaded){
          processSend();
        }
      } else {
        processSend();
      }
    }
  }

  export let showTextEditing = false;
  const toogleTextEditing = ()=>{
    showTextEditing = !showTextEditing;
    localStorage.setItem('showTextEditing', String(showTextEditing));
  }

  let promptValue: string;
  $: promptOpen = false;
  let promptCallback: (value: unknown)=>void
  const prompt = ()=>{
    return new Promise((resolve)=>{
      promptCallback = (value: unknown)=> {
        promptValue = value as string;
        promptOpen = false;
        resolve(promptValue)
      };
      promptValue = '';
      promptOpen = true;
    })
  }

  const prompts: Record<string, ()=>Promise<string>> = {
    [SupportedKeys.ToggleLink]: async ()=>{
      await prompt();
      return promptValue;
    }
  }

  const onToolbarSelect = async ({ detail: cmd }: CustomEvent<Cmd> ) => {
    const prompting = prompts[cmd.command];
    const command = (commands as any)[cmd.command];
    if(prompting && !cmd.actived){
      let payload = await prompting();
      return await content.command(command, payload)
    }

    await content.command(command);
  }
  let files: FileList;
  $: {
    files && uploadWithFilelist(files);
  }

</script>

<Dialog bind:open={promptOpen} title="Link" bind:callback={promptCallback} let:ok >
  <Form let:valid>
    <Input name="linkurl" placeholder="link url" required bind:value={promptValue} />
    <Button variant="container" on:click={()=>ok(promptValue)} disabled={!valid}>save</Button>
  </Form>
</Dialog>
<editor
  class={status}
  class:closeFormating={!showTextEditing}
>
  <Toolbar
    disabled={status !== 'idle'}
    hidden={!showTextEditing}
    on:select={onToolbarSelect}
  />
  <Content
    disabled={status !== 'idle'}
    bind:ctx
    bind:this={content}
    on:mounted={onContentMounted}
    on:send={send}
    bind:value={contentValue}
  />
  <Attachements
    disabled={status !== 'idle'}
    bind:attachements
    bind:loaded={attachementsLoaded}
  />
  <Controls
    disabled={status !== 'idle'}
    on:onEmojiSelected={onEmojiSelected}
    on:sendMessages={send}
    on:toogleTextEditing={toogleTextEditing}
    bind:files
  />
</editor>

<style lang="postcss">
  /* @import './content.css'; */

  editor {
    display: flex;
    flex-direction: column;

    margin: 0 16px;
    border-radius: 8px;
    transform: translateY(-16px);
    border: 1px solid var(--palette-primary-light);
    transition: all .25s ease-in-out;

    pointer-events: none;
    &.idle {
      pointer-events: auto;
    }
    /* toolbar {
      display: flex;
      align-items: center;
      padding: 0 8px;
      background-color: var(--palette-primary-light);
      color: var(--palette-primary-contrast);
      border-radius: 4px 4px 0 0;
      border: none;
      height: 40px;
      transition: all .25s ease-in-out;
      overflow: hidden;

      flex-shrink: 0;
    } */

    &.closeFormating {
      transform: translateY(0);
      margin-bottom: 16px;
    }

    /* controls {
      display: flex;
      padding: 4px;
      align-items: center;

      controls-right {
        flex-shrink: 0;
      }

      controls-buttons {
        flex-grow: 1;
      }

      controls-left {
        flex-shrink: 0;
        align-items: flex-end;
      }
    } */
  }
</style>
