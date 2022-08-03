import type { EditorView } from '@milkdown/prose/view';
import { createPlugin } from '@milkdown/utils';
import { Plugin, PluginKey } from '@milkdown/prose/state';
import { keydownHandler } from '@milkdown/prose/keymap';
import { chainCommands, createParagraphNear, liftEmptyBlock, newlineInCode, splitBlock } from '@milkdown/prose/commands';
import { createSlice } from '@milkdown/core';
import ListenerManager from './ListenerManager';

export const keyboardListenerCtx = createSlice<ListenerManager>(new ListenerManager(), 'keyboard-listener');

export const key = new PluginKey('MILKDOWN_KEYBOARD');

export const keyboardPlugin = createPlugin(() => ({
  prosePlugins: (_, ctx) => {
    const plugin = new Plugin({
      key: key,

      props:{
        handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
          if(event.key === 'Enter' && event.shiftKey === false){
            ctx.get(keyboardListenerCtx).sendListeners.forEach(fn=>fn(ctx));
            return true;
          }
          return keydownHandler({
            "Shift-Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
          })(view, event);
        }
      }
    });

    return [plugin];
  },
}), [
  keyboardListenerCtx
]
);
