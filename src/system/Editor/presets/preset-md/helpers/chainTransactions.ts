import type { Command, Transaction } from 'prosemirror-state';

export default function chainTransactions(...commands: Command[]): Command {
  return (state, dispatch): boolean => {
      const dispatcher = (tr: Transaction) => {
          state = state.apply(tr);
          dispatch?.(tr);
      };
      const last = commands.pop();
      const reduced = commands.reduce((result, command) => {
          return result || command(state, dispatcher);
      }, false);
      return reduced && last !== undefined && last(state, dispatch);
  };
}
