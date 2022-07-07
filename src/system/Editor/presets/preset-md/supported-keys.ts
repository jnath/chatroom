export const SupportedKeys = {
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
