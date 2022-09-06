import type { Ctx } from '@milkdown/core';
import type { LinkOptions } from '@milkdown/preset-commonmark';
import type { EditorView } from '@milkdown/prose/view';
import type { CommonOptions } from '@milkdown/utils';

type FnView = (ctx: Ctx, view: EditorView) => void;
type FnViewPos = (
  ctx: Ctx,
  view: EditorView,
  // options: Partial<CommonOptions<string, LinkOptions>> | undefined,
  calculatePosition: ()=> { left: number, top: number },
  // onUpdate: (value: unknown) => void
) => void;
type FnValue = (ctx: Ctx, value: string) => void;
type Fn = (ctx: Ctx) => void;

export default class InputChipsListenerManager {

  public updateListeners: Array<FnValue> = [];
  public initListeners: Array<FnView> = [];
  public showListeners: Array<FnViewPos> = [];
  public hideListeners: Array<Fn> = [];
  public destroyListeners: Array<Fn> = [];
  public validListeners: Array<(value: string)=>void> = [];

  sendValid = (value: string) => {
    this.validListeners.forEach(fn=>fn(value));
  }

  update = (fn: FnValue) => {
    this.updateListeners.push(fn);
    return this;
  };

  init = (fn: FnView) => {
    this.initListeners.push(fn);
    return this;
  };

  show = (fn: FnViewPos) => {
    this.showListeners.push(fn);
    return this;
  };

  hide = (fn: Fn) => {
    this.hideListeners.push(fn);
    return this;
  };

  destroy = (fn: Fn) => {
    this.destroyListeners.push(fn);
    return this;
  };

  removeAllListener = () => {
    this.initListeners = [];
    this.destroyListeners = [];
    this.showListeners = [];
    this.hideListeners = [];
    this.updateListeners = [];
    this.validListeners = [];
  }

}
