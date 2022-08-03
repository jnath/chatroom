/* Copyright 2021, Milkdown by Mirone. */
import { AtomList } from '@milkdown/utils';

import { menuPlugin } from './menu';
export * from './menu';

export const menu = AtomList.create([menuPlugin()]);
