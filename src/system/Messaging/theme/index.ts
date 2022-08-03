import {
  Ctx,
  emotionCtx,
  // internalThemeKeys,
  ThemeEnvironmentReady,
  ThemeGlobal, ThemeIcon, ThemeManager, themeManagerCtx, ThemeReady, type IconValue, type MilkdownPlugin, type ThemeSliceKey
} from '@milkdown/core';
import { useAllPresetRenderer, listeners } from './renderer';
import { getStyle } from './style';

export {
  listeners
}
export type CreateThemePack = (ctx: Ctx, manager: ThemeManager) => void;
export type ThemePlugin = MilkdownPlugin & {
  override: (overrideFn: CreateThemePack) => ThemePlugin;
};
export const themeFactory = (createThemePack?: CreateThemePack): ThemePlugin => {
  let overrideFn: CreateThemePack | null = null;
  const theme: ThemePlugin = (pre) => async (ctx) => {
    Object.values(listeners).forEach(listener => pre.inject(listener))
    await ctx.wait(ThemeEnvironmentReady);
    const themeManager = ctx.get(themeManagerCtx);

    themeManager.setExecutor(() => {
      createThemePack?.(ctx, themeManager);
      overrideFn?.(ctx, themeManager);

      // internalThemeKeys.forEach((key) => {
      //   if (!themeManager.has(key as ThemeSliceKey)) {
      //     console.warn('Theme key not found: ', key.sliceName);
      //   }
      // });

      themeManager.get(ThemeGlobal, undefined);
    });

    ctx.done(ThemeReady);
  };
  theme.override = (fn) => {
    overrideFn = fn;
    return theme;
  };
  return theme;
};

import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import Icon from 'svelte-fa';

const theme = themeFactory((ctx, manager) => {
  const emotion = ctx.get(emotionCtx)
  manager.set(ThemeGlobal, () => {
    getStyle(manager, emotion);
  });
  manager.set(ThemeIcon, (icon): IconValue | undefined => {
    if (!icon) return;
    if(icon !== 'loading') return;
    const span = document.createElement('span');
    new Icon({
      target: span,
      props: {
        icon: faHourglass
      }
    })
    return {dom: span, label:''};
});
  useAllPresetRenderer(ctx, emotion)
});

export default theme
