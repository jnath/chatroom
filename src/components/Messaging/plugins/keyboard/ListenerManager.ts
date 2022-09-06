import type { Ctx } from '@milkdown/core';


type Fn = (ctx: Ctx) => void;

export default class ListenerManager {
  public sendListeners: Array<Fn> = [];
  send = (fn: Fn) => {
    this.sendListeners.push(fn);
    return this;
  };
}
