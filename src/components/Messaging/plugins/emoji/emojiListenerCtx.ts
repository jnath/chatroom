import ListenerManager from '$components/Messaging/plugins/emoji/ListenerManager';
import { createSlice } from '@milkdown/core';

export const emojiListenerCtx = createSlice<ListenerManager>(new ListenerManager(), 'emoji-listener');
