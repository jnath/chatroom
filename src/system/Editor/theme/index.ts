import {
  themeFactory,
  ThemeGlobal
} from '@milkdown/core';
import { useAllPresetRenderer } from '@milkdown/theme-pack-helper';
import { getStyle } from './style';

const theme = themeFactory((emotion, manager) => {
  manager.set(ThemeGlobal, () => {
    getStyle(manager, emotion);
});
  useAllPresetRenderer(manager, emotion)
});

export default theme
