import { createPlugin } from '@milkdown/utils';
import { Plugin, PluginKey } from '@milkdown/prose/state';
import hasMark from '$components/Messaging/presets/preset-md/helpers/hasMark';
import isActive from '$components/Messaging/presets/preset-md/helpers/isActive';
import ListenerManager, { type Activated } from './ListenerManager';
import { createSlice } from '@milkdown/core';

export const menuListenerCtx = createSlice<ListenerManager>(new ListenerManager(), 'menu-listener');
export const menuKey = new PluginKey('MILKDOWN_MENU_LISTENER');

export const menuPlugin = createPlugin(() => ({
  prosePlugins: (_, ctx) => {
    const plugin = new Plugin({
      key: menuKey,
      view: () => {
        const listener = ctx.get(menuListenerCtx);
        const { updatedListeners } = listener;

        return {
          update: (view) => {
            const { state } = view;
            const { schema: { marks, nodes }} = state;

            if(updatedListeners.length === 0) return;

            const keys = [
              ...Object.keys(marks),
              ...Object.keys(nodes),
            ];

            const data: Record<string, Activated> = keys.map((key)=>{
              let activated = false;
              if(marks[key]){
                activated = hasMark(state, marks[key]);
              } else if (nodes[key]){
                activated = isActive(state, nodes[key]);
              }
              return ({
                type: key,
                schema: marks[key],
                activated
              })
            }).reduce((obj, { type, schema, activated})=>{
              return {
                ...obj,
                [type]: {
                  schema,
                  activated
                },
              };
            }, {})

            updatedListeners.forEach((fn)=>fn(
              ctx,
              data
            ))
          },
        };
      }
    });

    return [plugin];
  },
}), [
  menuListenerCtx
]);
