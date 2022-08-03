/* Copyright 2021, Milkdown by Mirone. */

// import type ListenerManager from '$system/Editor/plugins/emoji/ListenerManager';
import type { Ctx } from '@milkdown/core';
// import { calculateNodePosition } from '@milkdown/prose';
import { Plugin, PluginKey } from '@milkdown/prose/state';
import type { EditorView } from '@milkdown/prose/view';
import nodeEmoji from 'node-emoji';

import { emojiListenerCtx } from '../emojiListenerCtx';

import {
  checkTrigger,
  // renderDropdownList
} from './helper';
// import { injectStyle } from './style';

export const key = new PluginKey('MILKDOWN_EMOJI_FILTER');

export const filter = (ctx: Ctx) => {
  let trigger = false;
  let _from = 0;
  let _search = '';
  // let $active: null | HTMLElement = null;

  const off = () => {
    trigger = false;
    _from = 0;
    _search = '';
    // $active = null;
  };

  const emojiListener = ctx.get(emojiListenerCtx);

  return new Plugin({
    key,
    props: {
      handleKeyDown(_, event) {
        if (['Delete', 'Backspace'].includes(event.key)) {
          _search = _search.slice(0, -1);
          if (_search.length <= 1) {
            off();
          }
          return false;
        }
        if (!trigger) return false;
        if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
          return false;
        }
        return true;
      },
      handleTextInput(view, from, to, text) {
        trigger = checkTrigger(
          view,
          from,
          to,
          text,
          (from) => {
            _from = from;
          },
          (search) => {
            _search = search;
          },
        );
        if (!trigger) {
          off();
        }
        return false;
      },
    },
    view: (editorView) => {
      const { parentNode } = editorView.dom;
      if (!parentNode) {
        throw new Error();
      }

      emojiListener.initListeners.forEach(fn => fn(ctx));

      const replace = (html: string) => {

        const { tr } = editorView.state;
        const node = editorView.state.schema.node('emoji', { html });

        editorView.dispatch(tr.delete(_from, _from + _search.length).insert(_from, node));
        off();
        emojiListener.hideListeners.forEach(fn => fn(ctx));
      };

      const onKeydown = (e: Event) => {
        if (!trigger || !(e instanceof KeyboardEvent)) return;

        const { key } = e;

        if (['Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
          emojiListener.keyboardListeners.forEach(fn => fn(ctx, e as KeyboardEvent));
          return;
        }
      };

      parentNode.addEventListener('keydown', onKeydown);

      const getPos = (view: EditorView)=> {
        const state = view.state;
        const { from, to } = state.selection;
        return {
          start: view.coordsAtPos(from),
          end: view.coordsAtPos(to)
        }
      }

      const calculatePosition = (
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

      return {
        update: (view) => {
          const { selection } = view.state;

          if (selection.from - selection.to !== 0 || !trigger) {
            off();
            emojiListener.hideListeners.forEach(fn => fn(ctx));
            return null;
          }
          const emojis = nodeEmoji.search(_search)
          const { node } = view.domAtPos(_from);
          if (emojis.length === 0 || !node) {
            emojiListener.hideListeners.forEach(fn => fn(ctx));
            return null;
          }

          emojiListener.updateListeners.forEach(fn => fn(ctx, {
            emojis,
          }));


          emojiListener.showListeners.forEach(fn => fn(ctx, {
            replace,
            node,
            calculatePosition: ()=>calculatePosition(view)
          }));
          return null;
        },

        destroy: () => {
          parentNode.removeEventListener('keydown', onKeydown);

          emojiListener.destroyListeners.forEach(fn=>fn(ctx));
        },
      };
    },
  });
};
