<script lang="ts" context="module">
  export { commands } from './presets/preset-md';
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  import {
    Editor,
    rootCtx,
    defaultValueCtx,
    commandsCtx,
    type CmdKey
  } from '@milkdown/core';

  import { md, menuListenerCtx } from './presets/preset-md'

  import theme from './theme';
  import { buttonStatus } from './stores/toolbar';

  import { emoji } from '@milkdown/plugin-emoji';
  import { history } from '@milkdown/plugin-history';
  import { clipboard } from '@milkdown/plugin-clipboard';
  import { listener, listenerCtx } from '@milkdown/plugin-listener';
  import { tooltip } from '@milkdown/plugin-tooltip';

  const dispatch = createEventDispatcher();

  export let defaultValue: string;
  export let value: string;

  let editor: Editor;
  let content: HTMLElement;

  onMount(async () => {
    editor = await (
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, content);
          ctx.get(listenerCtx).markdownUpdated((ctx, markdown) => {
            value = markdown;
          });
          ctx.set(defaultValueCtx, defaultValue);
          ctx.get(listenerCtx).mounted(()=>{
            dispatch('mounted');
          })

          ctx.get(menuListenerCtx).updated((ctx, data)=>{
            console.log(data)
            buttonStatus.set(data);
          })
        })
        .use(listener)
        .use(theme)
        .use(md)
        .use(emoji)
        .use(history)
        .use(clipboard)
        .use(tooltip)
        .create()
    );
  });

  onDestroy(()=>{
    dispatch('destroy');
  })

  export function command<T>(command: CmdKey<T>, payload: T | undefined) {
    return new Promise<boolean>((resolve)=>{
      editor.action((ctx) => {
        const commandManager = ctx.get(commandsCtx);
        resolve(commandManager.call(command, payload));
      });
    })
  }

</script>

<content bind:this={content}>
  {#if !editor}
    <p>Loading content please wait....</p>
  {/if}
</content>
