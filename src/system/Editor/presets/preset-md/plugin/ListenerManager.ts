import type { Ctx } from '@milkdown/core';
import type { MarkType, NodeType } from '@milkdown/prose/model';

export interface Activated {
  type: string;
  schema: MarkType | NodeType;
  activated: boolean;
}

type Fn = (ctx: Ctx, data: Record<string, Activated>) => void;

export default class ListenerManager {
  public updatedListeners: Array<Fn> = [];
  updated = (fn: Fn) => {
    this.updatedListeners.push(fn);
    return this;
  };
}
