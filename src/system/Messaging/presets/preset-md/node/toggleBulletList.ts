/* Copyright 2021, Milkdown by Mirone. */
import { createCmd, createCmdKey } from '@milkdown/core';
import { wrapIn, lift } from '@milkdown/prose/commands';
import { wrappingInputRule } from '@milkdown/prose/inputrules';
import { createNode, createShortcut } from '@milkdown/utils';
import { SupportedKeys } from '../supported-keys';
import { editorViewCtx } from '@milkdown/core';

import isActive from '../helpers/isActive';
import chainTransactions from '../helpers/chainTransactions';


export const ToggleBulletList = createCmdKey('ToggleBulletList');

type Keys = Extract<keyof SupportedKeys, 'ToggleBulletList'>;

export const bulletList = createNode<Keys>((utils) => {
    const id = 'bullet_list';
    return {
        id,
        schema: () => ({
            content: 'listItem+',
            group: 'block',
            parseDOM: [{ tag: 'ul' }],
            toDOM: (node) => {
                return ['ul', { class: utils.getClassName(node.attrs, 'bullet-list') }, 0];
            },
            parseMarkdown: {
                match: ({ type, ordered }) => type === 'list' && !ordered,
                runner: (state, node, type) => {
                    state.openNode(type).next(node.children).closeNode();
                },
            },
            toMarkdown: {
                match: (node) => node.type.name === id,
                runner: (state, node) => {
                    state.openNode('list', undefined, { ordered: false }).next(node.content).closeNode();
                },
            },
        }),
        inputRules: (nodeType) => [wrappingInputRule(/^\s*([-+*])\s$/, nodeType)],
        commands: (nodeType, ctx) => [
            createCmd(ToggleBulletList, () => {
                const { state } = ctx.get(editorViewCtx);
                if(isActive(state, nodeType)){
                    return lift;
                }

                if(isActive(state, nodeType.schema.nodes['ordered_list'])){
                    return chainTransactions(
                        lift,
                        wrapIn(nodeType)
                    );
                }

                return wrapIn(nodeType)
            })
        ],
        shortcuts: {
            [SupportedKeys.ToggleBulletList]: createShortcut(ToggleBulletList, 'Mod-Alt-8'),
        },
    };
});
