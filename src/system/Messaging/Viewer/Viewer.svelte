<script lang="ts" context="module">
  export { commands, SupportedKeys } from '../presets/preset-md';

  export interface Attachement {
    src: string;
    name: string;
  }

  const cache: Record<string, string> = {};

</script>

<script lang="ts">
  import { onMount } from 'svelte';

  import {
    Editor,
    rootCtx,
    defaultValueCtx,
    Ctx,
    editorViewOptionsCtx,
  } from '@milkdown/core';

  import {
    md,
  } from '../presets/preset-md'

  import theme from '../theme';

  import { emoji } from '../plugins/emoji';
  import Attachements from './Attachements.svelte';

  export let value: string;
  export let attachements: Attachement[] | null;
  let viewer: HTMLElement;

  let ctx: Ctx;

  onMount(async () => {
    if(!cache[value]){
      cache[value] = '';
      await (
        Editor.make()
          .config((_ctx) => {
            ctx = _ctx;
            ctx.set(rootCtx, viewer);
            ctx.set(defaultValueCtx, value);
            ctx.set(editorViewOptionsCtx, {
              editable: ()=>false
            });
          })
          .use(theme)
          .use(md)
          .use(emoji)
          .create()
          );
      cache[value] = viewer.innerHTML;
    }
  });

  $: text = cache[value];
</script>

<viewer bind:this={viewer} >
  {#if text}
    {@html text}
  {/if}
</viewer>

<Attachements bind:attachements />
