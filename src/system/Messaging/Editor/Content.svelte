<script lang="ts" context="module">
  export { commands, SupportedKeys } from '../presets/preset-md';
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  import {
    Editor,
    rootCtx,
    defaultValueCtx,
    editorViewCtx,
    serializerCtx,
    commandsCtx,
    type CmdKey,
    type Ctx,
    editorStateCtx
  } from '@milkdown/core';

  import { md } from '../presets/preset-md'

  import theme from '../theme';
  import { buttonStatus } from './stores/toolbar';

  import { emoji } from '../plugins/emoji';
  // import { upload } from './plugins/upload';
  import { upload } from './Attachements.svelte';
  import { history } from '@milkdown/plugin-history';
  import { clipboard } from '@milkdown/plugin-clipboard';
  import { listener, listenerCtx } from '@milkdown/plugin-listener';
  import { tooltip } from '@milkdown/plugin-tooltip';

  import InputChips from './InputChips.svelte';
  import EmojiShortcut from './EmojiShortcut.svelte';
  import { menu, menuListenerCtx } from '../plugins/menu';
  import { keyboard, keyboardListenerCtx } from '../plugins/keyboard';

  const dispatch = createEventDispatcher();

  export let value: string;
  export let disabled = false;

  let editor: Editor;
  let content: HTMLElement;

  export let ctx: Ctx;

  onMount(async () => {
    editor = await (
      Editor.make()
        .config((_ctx) => {
          ctx = _ctx;
          ctx.set(rootCtx, content);
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
            value = markdown;
          });
          ctx.set(defaultValueCtx, value);
          ctx.get(listenerCtx).mounted(()=>{
            dispatch('mounted');
          })

          ctx.get(menuListenerCtx).updated((ctx, data)=>{
            buttonStatus.set(data);
          })

          ctx.get(keyboardListenerCtx).send(()=>{
            editor.action((ctx) => {
              const editorView = ctx.get(editorViewCtx);
              const serializer = ctx.get(serializerCtx);
              return dispatch('send', serializer(editorView.state.doc));
            });
          })
        })
        .use(listener)
        .use(theme)
        .use(md)
        .use(emoji)
        .use(tooltip.headless())
        .use(upload.headless())
        .use(menu)
        .use(keyboard)
        .use(history)
        .use(clipboard)
        .create()
        );
  });

  onDestroy(()=>{
    dispatch('destroy');
  })

  export async function reset(){
    const editorView = ctx.get(editorViewCtx);
    const state = editor.ctx.get(editorStateCtx);
    editorView.dispatch(state.tr.deleteRange(0, state.doc.content.size));
  }

  export function command<T>(command: CmdKey<T>, payload?: T | undefined) {
    return new Promise<boolean>((resolve)=>{
      editor.action((ctx) => {
        const commandManager = ctx.get(commandsCtx);
        resolve(commandManager.call(command, payload));
      });
    })
  }

</script>

{#if ctx}
  <InputChips bind:ctx />
  <EmojiShortcut bind:ctx />
{/if}
<content bind:this={content} class:disabled >
  {#if !editor}
    <p>Loading content please wait....</p>
  {/if}
</content>

<style lang="postcss">
  content.disabled {
    color: var(--action-disabled)
  }
</style>
