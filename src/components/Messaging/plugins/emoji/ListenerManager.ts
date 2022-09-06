import type { Ctx } from '@milkdown/core';
import type { Emoji } from 'node-emoji';

type ShowProps = {
  replace: (html: string) => void;
  node: Node,
  calculatePosition: ()=>{ top: number, left: number }
}

type UpdateProps = {
  emojis: Emoji[],
}

type Fn = (ctx: Ctx) => void;
type FnShow = (ctx: Ctx, props: ShowProps) => void;

type FnKeyboard = (ctx: Ctx, event: KeyboardEvent) => void;
type FnUpdate = (ctx: Ctx, props: UpdateProps) => void;

export default class ListenerManager {
  public initListeners: Array<Fn> = [];
  public destroyListeners: Array<Fn> = [];
  public showListeners: Array<FnShow> = [];
  public hideListeners: Array<Fn> = [];
  public keyboardListeners: Array<FnKeyboard> = [];
  public updateListeners: Array<FnUpdate> = [];

  init = (fn: Fn) => {
    this.initListeners.push(fn);
    return this;
  };

  destroy = (fn: Fn) => {
    this.destroyListeners.push(fn);
    return this;
  };

  show = (fn: FnShow) => {
    this.showListeners.push(fn);
    return this;
  };

  hide = (fn: Fn) => {
    this.hideListeners.push(fn);
    return this;
  };

  keyboard = (fn: FnKeyboard) => {
    this.keyboardListeners.push(fn);
    return this;
  };

  update = (fn: FnUpdate) => {
    this.updateListeners.push(fn);
    return this;
  };

  removeAllListener = () => {
    this.initListeners = [];
    this.destroyListeners = [];
    this.showListeners = [];
    this.hideListeners = [];
    this.keyboardListeners = [];
    this.updateListeners = [];
  }
}
