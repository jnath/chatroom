<script lang="ts">
  // import type { EmojiData } from '$system/EmojiSelector/data';

  // import emojiData from '$system/EmojiSelector/data';

  import Controls from '$system/Editor/Controls.svelte';
  import Content from '$system/Editor/Content.svelte';
  import Toolbar, { type EventValueDetails } from '$system/Editor/Toolbar.svelte';
  import Dialog from '$system/Dialog';
  import Form from '$system/Form';
  import Input from '$system/Input';
  import Button from '$system/Button';
  // import PopupEmojiShortcut from '$system/Editor/PopupEmojiShortcut.svelte';


  let content: Content;
  let editor: HTMLElement;
  // let popupEmojiShortcutHeight: number;

  // onMount(async () => {

  // });

  const onContentMounted = ()=>{
    // const emojiShortcut = content.plugin('emoji:shortcut');
    // if(emojiShortcut){
    //   emojiShortcut.addEventListener('emoji:shortcut:open', onEmojiOpen);
    //   emojiShortcut.addEventListener('emoji:shortcut:close', onEmojiClose);
    //   emojiShortcut.addEventListener('emoji:shortcut:query', onEmojiQuery);
    // }
    const localStorageShowTextEditing = localStorage.getItem('showTextEditing');
    showTextEditing = localStorageShowTextEditing !== null ? JSON.parse(localStorageShowTextEditing) : false;
  }

  // let showPicker = false;
  // let popupX = 0;
  // let popupY = 0;
  // const onEmojiOpen = ()=>{
  //   console.log('open')
  //   showPicker = true;
  //   const rect = document.getSelection()?.getRangeAt(0).getBoundingClientRect();
  //   const editorRect = editor.getBoundingClientRect();
  //   popupX = (rect?.x || 0) - editorRect.x;
  //   popupY = (rect?.y || 0) - editorRect.y - 24;
  // }
  // const onEmojiClose = ()=>{
  //   showPicker = false;
  // }

  // const closeEmojiPopup = ()=>{
  //   const emojiShortcut = content.plugin('emoji:shortcut');
  //   if(emojiShortcut){
  //     emojiShortcut.close();
  //   }
  // }

  // let emojisShortcutList: EmojiData[] = [];
  // const onEmojiQuery = ({ detail: query }: EmojiShortcutQueryEvent)=>{
  //   emojisShortcutList = emojiData.filter((emoji)=>emoji.name.indexOf(query) !== -1);
  // }

  // const onPopupEmojiSelected = (e: CustomEvent) => {
  //   closeEmojiPopup();
  //   onEmojiSelected(e)
  // }

  const onEmojiSelected = ({ detail }: CustomEvent) => {
    // const selection = content.getCore().getSelection();
    // if(selection){
    //   content.getCore().insertText(selection.index, detail)
    // }
  }

  const send = ()=>{
    console.log('send', contentValue)
  }

  export let showTextEditing = false;
  const toogleTextEditing = ()=>{
    showTextEditing = !showTextEditing;
    localStorage.setItem('showTextEditing', String(showTextEditing));
  }

  const onToolbarSelect = async ({ detail: cmd }: CustomEvent ) => {
    await content.command(cmd.command, cmd.payload)
  }

  $: promptValueOpen = false;
  let promptCallback: (value: unknown) => void;
  let promptReturnedValue: string;
  const promptValue = async ({detail: { callback }}: CustomEvent<EventValueDetails>)=>{
    promptReturnedValue = '';
    promptValueOpen = true;
    promptCallback = callback;
  }

  let contentValue: string;
</script>

<Dialog bind:open={promptValueOpen} title="Link" bind:callback={promptCallback} let:ok >
  <Form let:valid>
    <Input name="linkurl" placeholder="link url" required bind:value={promptReturnedValue} />
    <Button variant="container" on:click={()=>ok(promptReturnedValue)} disabled={!valid}>save</Button>
  </Form>
</Dialog>
<editor
  bind:this={editor}
  class:closeFormating={!showTextEditing}
>
  <Toolbar
    hidden={!showTextEditing}
    on:select={onToolbarSelect}
    on:value={promptValue}
  />
  <Content
    bind:this={content}
    on:mounted={onContentMounted}
    on:send={send}
    defaultValue=""
    bind:value={contentValue}
  />
  <!-- {#if showPicker}
    <PopupEmojiShortcut
      on:close={closeEmojiPopup}
      on:select={onPopupEmojiSelected}
      bind:offsetHeight={popupEmojiShortcutHeight}
      pos={{x:popupX, y:popupY - popupEmojiShortcutHeight}}
      items={emojisShortcutList}
    />
  {/if} -->
  <Controls
    on:onEmojiSelected={onEmojiSelected}
    on:sendMessages={send}
    on:toogleTextEditing={toogleTextEditing}
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
