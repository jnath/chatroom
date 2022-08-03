import type { NodeType, Attrs } from '@milkdown/prose/model';
import type { EditorState } from '@milkdown/prose/state';

export default function isActive(state: EditorState, type: NodeType, attrs: Attrs = {}) {
  const $from = state.selection.$from;

  let wrapperDepth;
  let currentDepth = $from.depth;
  while (currentDepth > 0) {
      const currentNodeAtDepth = $from.node(currentDepth);
      const comparisonAttrs = { ...attrs };
      if (currentNodeAtDepth.attrs.id) {
          comparisonAttrs.id = currentNodeAtDepth.attrs.id;
      }

      /* Previous versions used node.hasMarkup but that */
      /* mandates deep equality on attrs. We just want to */
      /* ensure that everyting in the passed in attrs */
      /* is present in the node at the depth */
      const isType = type.name === currentNodeAtDepth.type.name;
      const hasAttrs = Object.keys(attrs).reduce((prev, curr)=> {
          if (attrs[curr] !== currentNodeAtDepth.attrs[curr]) { return false; }
          return prev;
      }, true);

      if (isType && hasAttrs) { wrapperDepth = currentDepth; }
      currentDepth -= 1;
  }

  return !!wrapperDepth;
}
