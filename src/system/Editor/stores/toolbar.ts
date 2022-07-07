import type { Activated } from '$system/Editor/presets/preset-md/plugin/ListenerManager';
import { writable } from 'svelte/store';

export const buttonStatus = writable<Record<string, Activated>>({});
