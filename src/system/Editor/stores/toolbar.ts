import type { Activated } from '$system/Editor/plugins/menu/ListenerManager';
import { writable } from 'svelte/store';

export const buttonStatus = writable<Record<string, Activated>>({});
