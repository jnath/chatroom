import type { Ctx, Emotion } from '@milkdown/core';
// import { image } from './image';
import { inputChip, inputChipListenerCtx } from './input-chip';

export const listeners = {
  inputChipListenerCtx
}
export const useAllPresetRenderer = (ctx: Ctx, emotion: Emotion) => {
  [
    inputChip,
    // image,
  ].forEach((f) => {
      f(ctx, emotion);
  });
};
