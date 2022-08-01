/* Copyright 2021, Milkdown by Mirone. */
import { AtomList } from '@milkdown/utils';

import { keyboardPlugin } from './keyboard';
export * from './keyboard';

export const keyboard = AtomList.create([keyboardPlugin()]);
