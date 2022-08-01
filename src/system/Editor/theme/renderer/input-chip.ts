/* Copyright 2021, Milkdown by Mirone. */
import {
  createSlice,
  Ctx,
  themeManagerCtx,
  type ThemeInputChipType,
} from '@milkdown/core';
import type { EditorView } from '@milkdown/prose/view';
import InputChipsListenerManager from '../listeners/InputChipsListenerManager';

export const inputChipListenerCtx = createSlice<InputChipsListenerManager>(
  new InputChipsListenerManager(),
  'input-chip-listener'
);

const getPos = (view: EditorView)=> {
  const state = view.state;
  const { from, to } = state.selection;
  return {
    start: view.coordsAtPos(from),
    end: view.coordsAtPos(to)
  }
}

const calcPos = (
  view: EditorView,
) => {
  const {
    start,
  } = getPos(view);
  const $editor = view.dom.parentElement;
  if (!$editor) {
    throw new Error();
  }

  const editorRect = $editor.getBoundingClientRect();

  let left = start.left - editorRect.left;
  const top = start.bottom - editorRect.top ;


  if (left < 0) left = 0;

  return {top, left};
};

export const inputChip = (ctx: Ctx) => {
  const manager = ctx.get(themeManagerCtx);
  manager.set<ThemeInputChipType>('input-chip', ({
    onUpdate,
  }) => {
    let value = '';

    const {
      updateListeners,
      destroyListeners,
      initListeners,
      hideListeners,
      showListeners,
      validListeners,
    } = ctx.get(inputChipListenerCtx);

    const hide = () => {
      hideListeners.forEach(fn => fn(ctx))
    };
    const show = (editorView: EditorView) => {
      showListeners.forEach(fn => fn(
        ctx,
        editorView,
        ()=>calcPos(editorView)
      ));
    };

    validListeners.push((value: string)=>{
      onUpdate(value);
    })

    const destroy = () => {
      destroyListeners.forEach(fn => fn(ctx));
    };

    const init = (editorView: EditorView) => {
      initListeners.forEach(fn => fn(ctx, editorView));
    };

    const update = (v: string) => {
      value = v;
      updateListeners.forEach(fn => fn(ctx, value))
    };

    return {
      dom: document.createElement('div'),
      init,
      show,
      hide,
      destroy,
      update,
    };
  });
};
