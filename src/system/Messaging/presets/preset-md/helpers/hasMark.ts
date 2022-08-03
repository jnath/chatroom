import type { MarkType } from '@milkdown/prose/model';
import type { EditorState } from '@milkdown/prose/state';

export default function (state: EditorState, type: MarkType | undefined): boolean {
  if (!type) return false;
  const { from, $from, to, empty } = state.selection;
  if (empty) {
      return !!type.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, type);
};
