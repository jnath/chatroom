import {

    SupportedKeys as GfmSupportedKeys,
} from '@milkdown/preset-gfm';

// const {
//     StrikeThrough,
//     TaskList,
//     NextCell,
//     PrevCell,
//     ExitTable,
//     HardBreak,
//     Blockquote,
//     BulletList,
//     OrderedList,
//     CodeFence,
//     H1,
//     H2,
//     H3,
//     H4,
//     H5,
//     H6,
//     Text,
//     CodeInline,
//     ...Gsk
// } = GfmSupportedKeys

export const SupportedKeys = {
    ...GfmSupportedKeys,
    ToggleBold: 'ToggleBold',
    ToggleItalic: 'ToggleItalic',
    ToggleStrikeThrough: 'ToggleStrikeThrough',
    ToggleLink: 'ToggleLink',
    ModifyLink: 'ModifyLink',
    ModifyImage: 'ModifyImage',
    ToggleBulletList: 'ToggleBulletList',
    ToggleOrderedList: 'ToggleOrderedList',
} as const;
export type SupportedKeys = typeof SupportedKeys;
