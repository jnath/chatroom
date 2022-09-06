<script lang="ts" context="module">
  export { commands, SupportedKeys } from '../presets/preset-md';

  const cache: Record<string, string> = {};

  const config = (v: HTMLElement)=>Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, v);
      ctx.set(defaultValueCtx, '');
      ctx.set(editorViewOptionsCtx, {
        editable: ()=>false
      });
    })
    .use(theme)
    .use(md)
    .use(emoji);

  type EditorType = {index: number, used: boolean, editor: Editor, viewer: HTMLElement};
  let editors: (EditorType| null)[] = [];

  function notEmpty<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}
  const getUnUseEditor = ()=>{
    return editors.filter(notEmpty).filter((e)=>!e?.used)[0];
  }

  const updateEditorUsed = (index: number, used: boolean)=>{
    if(editors[index]){
      (editors as EditorType[])[index] = {...(editors as EditorType[])[index], used};
    }
  }

  const addNewEditor = async ()=>{
    const index = editors.push(null);
    let v: HTMLElement | null = document.body.querySelector(`viewer.glob.editor-${index}`);
    if(!v){
      v = document.createElement('viewer');
      v.className = `glob editor-${index}`;
      v.style.display = 'none';
      document.body.appendChild(v);
    }
    const editor = {
      editor: await config(v).create(),
      viewer: v,
      index: index,
      used: false,
    }
    editors[index] = editor;
    return editor;
  }

  async function getHtmlByMarkdown(value: string){

    let unUseEditor = getUnUseEditor();
    if(!unUseEditor){
      unUseEditor = await addNewEditor();
    }
    const editor = unUseEditor.editor;
    const v = unUseEditor.viewer;
    updateEditorUsed(unUseEditor.index, true);
    const currentEditor = await editor;
    const editorView = editor.ctx.get(editorViewCtx);
    const state = currentEditor.ctx.get(editorStateCtx);
    editorView.dispatch(state.tr.deleteRange(0, state.doc.content.size));
    currentEditor.action(insert(value))
    const html = v?.innerHTML;
    updateEditorUsed(unUseEditor.index, false);

    return html;

  }

</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  import {
    Editor,
    rootCtx,
    defaultValueCtx,
    editorViewOptionsCtx,
    editorViewCtx,
    editorStateCtx
  } from '@milkdown/core';

  import { md } from '../presets/preset-md'

  import theme from '../theme';

  import { emoji } from '../plugins/emoji';
  import { insert } from '@milkdown/utils';
import { writable } from 'svelte/store';

  export let value: string;

  const text = writable('');

  const dispatch = createEventDispatcher();
  onMount(async () => {
    if(!cache[value]){
      cache[value] = '';
      const valueProcessed = await getHtmlByMarkdown(value) || '';
      cache[value] = valueProcessed;
    }

    text.set(cache[value]);
    dispatch('mounted');
  });
</script>

<viewer>
  {#if $text}
    {@html $text}
  {/if}
</viewer>


