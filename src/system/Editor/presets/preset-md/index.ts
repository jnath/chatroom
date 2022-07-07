import {
    ToggleBold,
    ToggleItalic,
    ToggleStrikeThrough,
    ModifyImage,

    link as linkRemove,
    codeInline as codeInlineRemove,
    blockquote as blockquoteRemove,
    codeFence as codeFenceRemove,
    heading as headingRemove,
    taskListItem as taskListItemRemove,
    footnoteDefinition as footnoteDefinitionRemove,
    footnoteReference as footnoteReferenceRemove,
    table as tableRemove,
    bulletList as bulletListRemove,
    orderedList as orderedListRemove,
    hr as hrRemove,

    gfm,
} from '@milkdown/preset-gfm';

gfm.remove(linkRemove);
gfm.remove(codeInlineRemove);
gfm.remove(blockquoteRemove);
gfm.remove(codeFenceRemove);
gfm.remove(headingRemove);
gfm.remove(taskListItemRemove);
gfm.remove(footnoteDefinitionRemove);
gfm.remove(footnoteReferenceRemove);
gfm.remove(tableRemove);
gfm.remove(bulletListRemove);
gfm.remove(orderedListRemove);
gfm.remove(hrRemove);

import { AtomList } from '@milkdown/utils';

import {
    ToggleBulletList,
    bulletList
} from './node/toggleBulletList';

import {
    ToggleOrderedList,
    orderedList
} from './node/toggleOrderedList';

import {
    ToggleLink,
    ModifyLink,
    link
} from './mark/link';

export { SupportedKeys } from './supported-keys';

export {
    ToggleBulletList,
    bulletList,
    ToggleOrderedList,
    orderedList,
};

import plugins, { menuListenerCtx } from './plugin';

export { menuListenerCtx };

export const md = AtomList.create([
    ...plugins,
    ...gfm,

    link(),
    bulletList(),
    orderedList(),
]);

export * from './supported-keys';
export const commands = {
    ToggleBold,
    ToggleItalic,
    ToggleStrikeThrough,
    ToggleLink,
    ModifyLink,
    ModifyImage,
    ToggleBulletList,
    ToggleOrderedList
} as const;
export type Commands = typeof commands;

