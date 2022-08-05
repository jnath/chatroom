import type { Activated } from '$system/Messaging/plugins/menu/ListenerManager';
import { writable } from 'svelte/store';

export const buttonStatus = writable<Record<string, Activated>>({});
