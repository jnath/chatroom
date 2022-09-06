import type { Activated } from '$components/Messaging/plugins/menu/ListenerManager';
import { writable } from 'svelte/store';

export const buttonStatus = writable<Record<string, Activated>>({});
