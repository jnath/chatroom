<script lang="ts" context="module">
  export { commands, SupportedKeys } from '../presets/preset-md';

  export interface Attachement {
    src: string;
    name: string;
  }

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
  export let attachements: Attachement[];
  let editor: Editor;
  let viewer: HTMLElement;

  let ctx: Ctx;

  onMount(async () => {
    editor = await (
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
  });

</script>

<viewer bind:this={viewer} />

<Attachements bind:attachements />
